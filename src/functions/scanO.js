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
        
        let subPath = "/var/scanO/" + inJSON.tp + "/" + inJSON.CTA
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
        try{
            var PDFImage = require("pdf-image").PDFImage;
            
            var pdfImage = new PDFImage(subPath);
            const splitPath = subPath.toLowerCase().split('.pdf');
            if(lengthP[inJSON.CTA]===undefined){
                lengthP[inJSON.CTA]=0;
                
                if(splitPath.length>1){
                    await getLength(pdfImage,inJSON)
                }
            }
            console.log("analice")
        //console.log(lengthP)
     //   pdfImage.convertPage(inJSON.npage).then(async(imagePath) => {
            // 0-th page (first page) of the slide.pdf is available as slide-0.
            const vision = require('@google-cloud/vision');
          //  console.log(vision)
            // Creates a client
            const client = new vision.ImageAnnotatorClient();
            // Performs text detection on the local file
            const imagePath = splitPath.length>1?pdf64.stackAna[inJSON.CTA][inJSON.npage]:subPath;
            let result = []
            try{
                [result] = await client.textDetection(imagePath)
            }catch(e){
                console.log(e)
            }
            /*.catch(e=>{
                console.log(e)
            });*/
            const detections = result.textAnnotations;
            let txt = ""
            let i = 0
            let prevLit = ""
            let auxTxt = ''
            outJSON.S = null
            outJSON.nombre=''
           // console.log(detections)
            if(detections){
                console.log(detections.length)
                detections.forEach(text => {
                    txt = text.description
                  //  console.log(txt)
                    
                    if (txt.includes("m²")) {
                        outJSON.S = prevLit
                    }

                    if (txt.includes("CONTRIBUYENTE:")) {
                        //outJSON.S = txt.replace("M2", "").replace("m2", "");
                        const split = txt.split("CONTRIBUYENTE: ");
                        let k = i
                        
                        if(/*detections.length>100&&*/split.length<2){
                            outJSON.nombre=detections[k+1].description
                            k++
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.nombre+=" "+detections[k+1].description;
                                k++;
                            }
                        }else{

                            outJSON.nombre=split[1];
                        }
                    }else if (txt.includes("CALLE:")){
                       const split = txt.split("CALLE: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++

                            //outJSON.calle=detections[k].description;
                            //k++
                            outJSON.calle="";
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.calle+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.calle+=detections[k].description;
                            }
                        }else{
                            outJSON.calle=split[1];
                        }

                    }else if (txt==="NÚM:"||txt==="NUM:"){
                       const split = txt.split("NÚM: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.numero="";
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.numero+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.numero+=detections[k].description;
                            }
                        }else{
                            outJSON.numero=split[1];
                        }
                    }else if (txt.includes("LTE:")){
                        const split = txt.split("LTE: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.lote="";
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.lote+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.lote+=detections[k].description;
                            }
                        }else{
                            outJSON.lote=split[1];
                        }
                    }else if (txt.includes("MZA:")){
                        const split = txt.split("MZA:");
                        let k = i
                        
                        //if(/*detections.length>150&&*/split.length<2){
                        if(!split[1]){
                            k++
                            outJSON.manzana="";    
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.manzana+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.manzana+=detections[k].description;
                            }
                        }else{
                            if(split[1]){
                                outJSON.manzana=split[1];
                            }else{
                                split = txt.split("MZA:");
                                outJSON.manzana=split[1];
                            }
                        }
                    }else if (txt.includes("COLONIA:")||txt.includes("COLONJA:")){
                        const split = txt.split("COLONIA: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.colonia="";
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.colonia+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.colonia+=detections[k].description;
                            }
                        }else{
                            outJSON.colonia=split[1];
                        }
                    }else if (txt.includes("MUNICIPIO:")){
                        const split = txt.split("MUNICIPIO: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.municipio="";
                            if(!detections[k].description.includes(':')){
                            while(!(detections[k+1].description+"").includes(":")){
                                outJSON.municipio+=detections[k].description+" ";
                                k++;
                            }
                            
                                outJSON.municipio+=detections[k].description;
                            }
                        }else{
                            outJSON.municipio=split[1];
                        }
                    }else if (txt.includes("LOCALIDAD")){
                        const split = txt.split("LOCALIDAD: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.localidad="";
                            let totalS = detections[k].description.split(',').join("");
                            totalS=parseInt(totalS);
                            if(!detections[k].description.includes(':')&&!detections[k].description.includes("PÁGUESE")&&!totalS){
                                totalS = detections[k+1].description.split(',').join("");
                                totalS=parseInt(totalS);
                                while(!(detections[k+1].description+"").includes(":")&&!detections[k+1].description.includes("PÁGUESE")&&!totalS){
                                    outJSON.localidad+=detections[k].description+" ";
                                    k++;
                                    totalS = detections[k+1].description.split(',').join("");
                                    totalS=parseInt(totalS);
                                }
                                
                                outJSON.localidad+=detections[k].description;
                                k++
                                if(parseInt(detections[k].description)){
                                    outJSON.total=parseInt(detections[k].description);
                                }
                            }
                        }else{
                            outJSON.localidad=split[1];
                        }
                    }/*else if (txt.includes("PÁGUESE:")){
                        outJSON.localidad=auxTxt
                        outJSON.total=''
                        auxTxt="";
                    }*/else if (txt.includes("DE:")){
                        
                        outJSON.total=detections[i+1].description;
                        if(outJSON.total.includes("$")){
                            outJSON.total=detections[i+2].description;
                        }
                        outJSON.total=outJSON.total.split(",").join("");
                        outJSON.total=parseInt(outJSON.total);
                    }else if (txt.includes("GRAVABLE:")){
                        outJSON.bg=detections[i+1].description.split(',').join('');
                        outJSON.bg=parseInt(outJSON.bg);
                        
                    }else if (txt.includes("CUENTA:")||txt.includes("CUENȚA")||txt.includes("CUENTĄ:")){
                        if(parseInt(detections[i+1].description)){
                            outJSON.CTA=detections[i+1].description;
                            outJSON.tp=detections[i+2].description;
                        }
                        //  auxTxt="";
                    }else if (txt.includes("PAGO:")){
                        outJSON.periodo=detections[i+1].description;
                        auxTxt="";
                    }else if (txt.includes("REGISTRO:")){
                        const split = txt.split("REGISTRO: ");
                        let k = i
                        
                        if(/*detections.length>150&&*/split.length<2){
                            k++
                            outJSON.dateUp=detections[k].description+"Z"
                            outJSON.dateUp=outJSON.dateUp.split(",").join(".");
                            /*k++
                            while(!(detections[k].description+"").includes(":")){
                                outJSON.dateUp+=" "+detections[k].description;
                                k++;
                            }*/
                        }else{
                            outJSON.dateUp=split[1]+"Z";
                        }
                    }else if(txt.includes("020401")){
                        outJSON.V020401='';
                        auxTxt="";
                    }/*else if(txt.includes("HABITACIÓN")){
                        outJSON.V020401=detections[i+2];
                        auxTxt=""
                    }*/else if(txt.includes("020403")){
                        outJSON.V020403='';
                        auxTxt=""
                    }else if(txt.includes("HABITACIÓN")||txt.includes("HÁBITACIÓN")){
                        //outJSON.V020401=detections[i+1].description;
                        let d=detections[i+1].description;
                        let k = i+1;
                        if((d+"").includes("41121001")||(d+"").includes("$")){
                            k++;
                            d=detections[k].description;
                            k++;
                        }
                        if(!d.includes(".")){
                          //  k++;
                            d=detections[k].description;
                            k++;
                        }
                        d = d.split(",").join("")
                        d=parseInt(d)
                        
                        while(!d){
                            d=detections[k].description;
                            d = d.split(",").join("")
                            d=parseInt(d)
                            k++;
                        }
                        if(d===411210010020401){
                            d=detections[k].description;
                            if(d.includes("$")){
                                d=detections[k+1].description;   
                            }
                            d = d.split(",").join("")
                            d=parseInt(d)
                            outJSON.V0020401=d;
                        }else{
                            let aux = detections[k].description
                            while(!aux.includes("IMPUESTOS")&&!aux.includes("20401")&&!aux.includes("20403")){
                                k--
                                aux = detections[k].description
                            }
                            if(d===41171001007){
                                       let m=i-1
                                        d=detections[m].description;
                                        d = d.split(",").join("")
                                        d=parseInt(d)
                                        while(!d){
                                            m--
                                            d=detections[m].description;
                                            if(d.includes(".")){
                                                d = d.split(",").join("")
                                                d=parseInt(d)
                                            }else{
                                                d=null
                                            }
                                        }
                            }
                            if(aux.includes("IMPUESTOS")||aux.includes("20403")){
                                
                                outJSON.V0020403=d;
                            }else if(aux.includes("20401")){
                                outJSON.V0020401=d;
                            }
                        }
                        //auxTxt=""
                    }else if(txt==="411310010030101"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("$")){
                                d=detections[k+1].description;
                                k++   
                            }
                            d = d.split(",").join("");
                            d=parseInt(d);
                            k++
                        }
                        outJSON.V0030101=d;
                    }else if (txt==="41171001007"){
                        let d=detections[i-1].description;
                        //let k = i+1;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        if(d&&d<0){
                            outJSON.V0020802=d;
                        }
                        
                    }else if(txt==="411710010070202"){
                        let k = i-1
                        let d=detections[k].description;
                        if(d.endsWith(",00")){
                            d[d.length-3]='.'
                            let f = d.length-3
                            let s = ''
                            while(f>=0){
                                s=d[f]+s
                                f--;
                            }
                            d=s;
                        }
                        d = d.split(",").join("");
                        while(!d.includes(".")||!parseInt(d)){
                            k--
                            d=detections[k].description;
                            d = d.split(",").join("");

                        }
                        d=parseInt(d);
                        if(d){
                            outJSON.V0070202=d;
                        }else{
                            let k = i + 1
                            d=detections[k].description;
                            if(d.includes("%")){
                                k++;
                                d=detections[k].description;
                            }
                            d = d.split(",").join("");
                            d=parseInt(d);
                            while(!d){
                                d=detections[k].description;
                                d = d.split(",").join("");
                                d=parseInt(d);
                                k++
                            }
                            outJSON.V0070202=d;
                        }
                    }else if(txt==="411710010070203"){
                        let k = i+1;
                        let d=detections[k].description;
                        if(detections[k-2].description.includes("-")){
                                d=detections[k-2].description;
                        }
                        d=d.split(",").join("")
                        d=parseInt(d);
                        k++;
                        while(!d||d>=0){
                            d=detections[k].description;
                            d=d.split(",").join("")
                            d=parseInt(d);
                            k++;
                        }
                        outJSON.V0070203 = d;
                    }else if(txt==="414910040090701"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("%")){
                                d=null;
                            }else{
                                d = d.split(",").join("");
                                d=parseInt(d);
                            }
                            k++
                        }
                        outJSON.V0090701=d;
                    }else if(txt==="414910040090702"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("%")||!d.includes(".")){
                                d=null;
                            }else{
                                d = d.split(",").join("");
                                d=parseInt(d);
                            }
                            k++
                        }
                        outJSON.V0090702=d;
                    }else if(txt==="414910040090703"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("%")){
                                d=null;
                            }else{
                                d = d.split(",").join("");
                                d=parseInt(d);
                            }
                            k++
                        }
                        outJSON.V0090703=d;
                    }else if(txt==="414910040090704"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("%")){
                                d=null;
                            }else{
                                d = d.split(",").join("");
                                d=parseInt(d);
                            }
                            k++
                        }
                        outJSON.V0090704=d;
                    }else if (txt==="415910050010804"){
                        let k = i + 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        while(!d){
                            d=detections[k].description;
                            if(d.includes("%")||d.includes("3DC")){
                                d=null;
                            }else{
                                d = d.split(",").join("");
                                d=parseInt(d);
                            }
                            k++
                        }
                        d/=72
                        outJSON.V0010804=d;
                    }else if (txt==="URBANO"||txt==="RÚSTICO"){
                        let k = i - 1
                        let d=detections[k].description;
                        d=parseInt(d);
                        outJSON.tp=txt;
                        if(d){
                            outJSON.CTA=d;
                        }
                    }else if(txt==="411210010020403"){
                        let k = i - 1
                        let d=detections[k].description;
                        d = d.split(",").join("");
                        d=parseInt(d);
                        if(d){
                            outJSON.V0020403=d
                        }
                    }/*else if (txt==="411710010070201"){ 
                        let k = i - 1
                        let d=detections[k].description;
                        d=parseInt(d);
                        outJSON.tp=txt;
                        if(d){
                            outJSON.CTA=d;
                        }
                    }*/

                    auxTxt+=txt+" "

                    prevLit = txt
                    i++;
                });
            }
            if ((!outJSON.S||outJSON.S === null||outJSON.S === undefined)&&detections&&splitPath.length>1) {
                inJSON.npage++;
                outJSON.npage=inJSON.npage;
                outJSON.lengthP=lengthP[inJSON.CTA];
                outJSON.p=(Math.round((inJSON.npage/lengthP[inJSON.CTA]*100)*100)/100)+" %";
                outJSON.analising=1;
                setResponse(res, outJSON, con);
            } else {
                if(!detections||splitPath.length<2){
                    outJSON.S='0'    
                }
                outJSON.S = outJSON.S.split(",").join("")
                outJSON.S = outJSON.S.split(" ").join("")
                /*let sql = `UPDATE padron${inJSON.tp} SET m1='${outJSON.S}'`
                sql += ` WHERE CTA=${inJSON.CTA}`
                con.query(sql, (err, result, fields) => {*/

                    outJSON.analize = 1
                    outJSON.p="- ANALISIS COMPLETADO - 100 %"

                    pdf64[inJSON.CTA] = '';
                    currentCTA = undefined;
                    lengthP[inJSON.CTA]=undefined
                    setResponse(res, outJSON,con);
               /* });*/
            }
        }catch(e){
            console.log(e)
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
                                let subPath = "/var/scanO/" + inJSON.tp + "/" + inJSON.CTA
                                if (!fs.existsSync(subPath)) {
                                    fs.mkdirSync(subPath, { recursive: true });
                                } 
                                subPath += "/" + inJSON.fileName
                                let decodedBase64 = base64.base64Decode(pdf64[inJSON.CTA], subPath);

                                /*let sql = `UPDATE padron${inJSON.tp} SET escriturasPath='${inJSON.fileName}' `
                                sql += ` WHERE CTA=${inJSON.CTA}`
                                    //console.log(sql)
                                con.query(sql, (err, result, fields) => {*/
                                    outJSON.next = 0
                                    pdf64[inJSON.CTA] = '';
                                    currentCTA = undefined;
                                    setResponse(res, outJSON,con);
                                //});
                             

                            }



                        }

                    }

                });
            } catch (e) {
                console.log(e)
            }
        }


const scanO = (req, res) => {
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
 
module.exports=scanO;
