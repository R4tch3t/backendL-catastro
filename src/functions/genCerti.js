const mysql = require('mysql');

const setResponse = (res, outJSON,con) => {
     //   outJSON = JSON.stringify(outJSON);
     try{
        con.destroy();
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

const getFolio = (req, res) => {
    //const {CTAnombre,tipoB,idOrden,tp} = req.body
    let outJSON = {}
    let inJSON = req.body
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    try{
    con.connect((err) => {
      outJSON = {};
      outJSON.error = {};
      //bandF = inJSON.bandF
      //inJSON.idFolio = parseInt(inJSON.idFolio)
      //console.log(bandF)
      if (err) {
        console.log(`Error: ${err}`);
      } else {

             const sql = `SELECT * FROM certificados WHERE CTA='${inJSON.CTA}' ORDER BY idCertificado DESC`
              con.query(sql, (err, result, fields) => {
                if (!err) {
                  if(result.length>0){
                    let f = result[0].idCertificado+"";
                    //let n = 0
                    while(f.length<4){
                      f = "0"+f
                    }
                    
                    outJSON.folio=f
                    setResponse(res, outJSON,con)   
                  }else{
                    outJSON.new=1
                    outJSON.lastFolio=1
                    let f = "1";
                    const sql = `SELECT * FROM certificados ORDER BY idCertificado DESC`

                    con.query(sql, (err, result, fields) => {
                      
                      if(result.length>0){
                       // outJSON.lastFolio=result[0].idCertificado;
                       f = (result[0].idCertificado+1)+"";
                      
                      }
                      while(f.length<4){
                        f = "0"+f
                      }
                      outJSON.lastFolio=f
                      setResponse(res, outJSON,con)
                    });
                  }
                }else{
                  setResponse(res, outJSON,con)
                }
              })

          

      }
    });
    }catch(e){
      console.log(e)
    }
}

const genFolio = (req, res) => {
    //const {CTAnombre,tipoB,idOrden,tp} = req.body
    let outJSON = {}
    let inJSON = req.body
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    try{
    con.connect((err) => {
      outJSON = {};
      outJSON.error = {};
      //bandF = inJSON.bandF
      //inJSON.idFolio = parseInt(inJSON.idFolio)
      //console.log(bandF)
      if (err) {
        console.log(`Error: ${err}`);
      } else {

        sql = `INSERT INTO certificados(CTA) VALUES ('${inJSON.CTA}')`
        con.query(sql, (err, result) => {
          if(!err){
            if(result !== undefined){
              outJSON.folio = result.insertId
            }
            setResponse(res, outJSON,con)
          }else{
            
              setResponse(res, outJSON,con)
            
          }
          //console.log(err)
          //console.log(err.)
          
        })

      }
    });
    }catch(e){
      console.log(e)
    }
}

const genCerti = (req, res) => {
        try {
            const {CTA,op} = req.body
                   if (CTA) {

                        //_genCerti(req, res);
                    switch(op){
                        case 0:
                            getFolio(req, res);          
                            break;
                        case 1:
                            genFolio(req, res);
                            break;
                        default: break;
                    }

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=genCerti
