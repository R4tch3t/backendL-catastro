const mysql = require('mysql');
const base64 = require('base64topdf');
const fs = require('fs');
pdf64 = {}
pdf64.stackAna={}
lengthP = {}
const setResponse = (res, outJSON,con) => {
     //   outJSON = JSON.stringify(outJSON);
     try{
       if(con){
          con.destroy();
       }
     }catch(e){
        
     };
     try{
        res.send(outJSON);
     }catch(e){
         console.log(e);
     };
       // con.destroy();
       // server.close();
       // server.listen(port, hostname);
}

promiseAna = (subPath, inJSON, outJSON, con, res)=>{ return new Promise((resolve,reject)=>{
       // imagePaths.bandAna[inJSON.CTA]=true
        renderPages(subPath, inJSON, outJSON, con, res)
        resolve(1)
})}

analice = (res, req) => {
    const inJSON = req.body
    let outJSON = {}
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    try {
      con.connect((err) => {
        
        let subPath = "/var/expedientes/" + inJSON.tp + "/" + inJSON.CTA
        subPath += "/" + inJSON.fileName
        promiseAna(subPath, inJSON, outJSON, con, res).then((v)=>{
        //    console.log(v)
        });
      });
    }catch(e){

    }
    
}

sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    getLength=async (pdfImage,inJSON)=>{
         let bandL = true
         let bandL2 = false
         pdf64.stackAna[inJSON.CTA] = []
       //  console.log('getLength')
         while(bandL){
        try{
            await sleep(100)
            if(!bandL2){
                bandL2=true
            pdfImage.convertPage(lengthP[inJSON.CTA]).then((imagePath) => {
                pdf64.stackAna[inJSON.CTA].push(imagePath);
              //  console.log(imagePath)
                lengthP[inJSON.CTA]++;
                bandL2=false
            }).catch(e=>{
                //console.log(e)
               // console.log(pdf64.stackAna[inJSON.CTA])
                bandL2=false
                bandL=false    
            })
            }
            
           
        }catch(e){
            //console.log(e)
            //console.log(lengthP)
            //console.log(pdf64.stackAna[inJSON.CTA])
            bandL=false
          //  return lengthP
        }
    }
        
    }
    renderPages = async (subPath, inJSON, outJSON, con, res) => {
      var PDFImage = require("pdf-image").PDFImage;
      
      var pdfImage = new PDFImage(subPath);
    
      if(lengthP[inJSON.CTA]===undefined){
            lengthP[inJSON.CTA]=0
            await getLength(pdfImage,inJSON)
      }
        //console.log(lengthP)
     //   pdfImage.convertPage(inJSON.npage).then(async(imagePath) => {
            // 0-th page (first page) of the slide.pdf is available as slide-0.
            const vision = require('@google-cloud/vision');
            console.log(vision)
            // Creates a client
            const client = new vision.ImageAnnotatorClient();
            // Performs text detection on the local file
            const imagePath = pdf64.stackAna[inJSON.CTA][inJSON.npage]
            const [result] = await client.documentTextDetection(imagePath);
            const detections = result.textAnnotations;
            let txt = ""
            let prevLit = ""
            outJSON.S = null
            detections.forEach(text => {
                txt = text.description

                if (txt === "=" && (prevLit === "S" || prevLit === "s")) {
                    prevLit = txt
                }
                if (txt.includes("m²")) {
                    outJSON.S = prevLit
                }
                if (prevLit.includes("=")) {
                    outJSON.S = txt.replace("M2", "").replace("m2", "");
                }
                prevLit = txt
            });
            if (!outJSON.S||outJSON.S === null||outJSON.S === undefined) {
                inJSON.npage++;
                outJSON.npage=inJSON.npage;
                outJSON.lengthP=lengthP[inJSON.CTA];
                outJSON.p=(Math.round((inJSON.npage/lengthP[inJSON.CTA]*100)*100)/100)+" %";
                outJSON.analising=1;
                setResponse(res, outJSON, con);
            } else {
                outJSON.S = outJSON.S.split(",").join("")
                outJSON.S = outJSON.S.split(" ").join("")
                let sql = `UPDATE padron${inJSON.tp} SET m1='${outJSON.S}'`
                sql += ` WHERE CTA=${inJSON.CTA}`
                con.query(sql, (err, result, fields) => {

                    outJSON.analize = 1
                    outJSON.p="- ANALISIS COMPLETADO - 100 %"

                    pdf64[inJSON.CTA] = '';
                    currentCTA = undefined;
                    lengthP[inJSON.CTA]=undefined
                    setResponse(res, outJSON,con);
                });
            }
    }

    registrar = (res, req) => {
    try {
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    const inJSON = req.body
    let outJSON = {}
                con.connect((err) => {
                    outJSON.error = {};
                    if (err) {
                        console.log(`Error: ${err}`);
                        setResponse(res, outJSON,con)
                    } else {
                        if (pdf64[inJSON.CTA] === undefined) {
                            pdf64[inJSON.CTA] = inJSON.dataPart

                        } else {
                            pdf64[inJSON.CTA] += inJSON.dataPart
                        }
                        
                        if (inJSON.count < inJSON.lengthE) {
                            outJSON.next = 1
                            setResponse(res, outJSON,con);
                        } else {
                            inJSON.CTA = parseInt(inJSON.CTA)
                            pdf64[inJSON.CTA] = pdf64[inJSON.CTA].split('base64,')[1]
                            if (pdf64[inJSON.CTA]) {
                                let subPath = "/var/expedientes/" + inJSON.tp + "/" + inJSON.CTA
                                if (!fs.existsSync(subPath)) {
                                    fs.mkdirSync(subPath, { recursive: true });
                                } 
                                subPath += "/" + inJSON.fileName
                                let decodedBase64 = base64.base64Decode(pdf64[inJSON.CTA], subPath);

                                let sql = `UPDATE padron${inJSON.tp} SET escriturasPath='${inJSON.fileName}' `
                                sql += ` WHERE CTA=${inJSON.CTA}`
                                    //console.log(sql)
                                con.query(sql, (err, result, fields) => {
                                    outJSON.next = 0
                                    pdf64[inJSON.CTA] = '';
                                    currentCTA = undefined;
                                    setResponse(res, outJSON,con);
                                });
                             

                            }



                        }

                    }

                });
            } catch (e) {
                console.log(e)
            }
        }


const regE = (req, res) => {
        try {
            const {CTA,analize} = req.body
            const outJSON = {}
                   if (CTA) {

                        if (!analize) {
                          if (currentCTA === undefined || currentCTA === CTA) {
                              currentCTA = CTA
                              registrar(res, req);
                          } else if (currentCTA !== CTA) {
                              outJSO.nextNode = 1
                              outJSON.currentCTA = currentCTA
                              setResponse(res, outJSON);
                              /*if(res){
                                res.end()
                              }*/
                          }
                         } else {
                            analice(res, req)
                          }

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=regE;
