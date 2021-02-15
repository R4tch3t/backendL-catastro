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

const _genFolio = (req, res) => {
   // const {idOrden, idFolio, tp} = req.body
    let outJSON = {}
    //let inJSON = {idOrden,idFolio,tp}
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
      bandF = inJSON.bandF
      inJSON.idFolio = parseInt(inJSON.idFolio)
      //console.log(bandF)
      if (err) {
        console.log(`Error: ${err}`);
      } else {

        sql = `INSERT INTO folios(idFolio, idOrden, tp) VALUES (${inJSON.idFolio},${inJSON.idOrden},'${inJSON.tp}')`
        con.query(sql, (err, result) => {
          if(!err){
            if(result !== undefined){
              outJSON.idFolio = result.insertId
            }
            setResponse(res, outJSON,con)
          }else{
            outJSON.idFolio = inJSON.idFolio
            if (err.errno === 1062 /*&& !bandF*/) {
              sql = `SELECT * FROM folios WHERE idOrden='${inJSON.idOrden}' ORDER BY idFolio DESC`
             // console.log(sql)
              con.query(sql, (err, result, fields) => {
                if (!err) {
                  if(result.length>0){
                    let bandIn = true
                    result.map((val, key) =>{
                      if(val.tp===inJSON.tp){
                        bandIn=false
                        outJSON.idFolio = val.idFolio
                        setResponse(res, outJSON,con);
                      }
                    })
                    if (bandIn) {
                      sql = `INSERT INTO folios(idFolio, idOrden, tp) VALUES (null,${inJSON.idOrden},'${inJSON.tp}')`
                      con.query(sql, (err, result) => {
                        if(result !== undefined){
                          outJSON.idFolio = result.insertId
                        }
                        setResponse(res, outJSON,con);
                      });
                    }
                      //console.log(result.idOrden)
                      //console.log(inJSON.idOrden)
                      /*inJSON.idFolio+=1
                      con.destroy();
                      con = mysql.createConnection({
                        host: "localhost",
                        user: process.env.NODE_MYSQL_USER,
                        password: process.env.NODE_MYSQL_PASS,
                        database: "dbcatastro"
                      });
                      //server.close();
                      //server.listen(port, hostname);                      
                      folio()*/
                    /*}else{
                      outJSON.idFolio=parseInt(result[0].idFolio)
                      outJSON.idFolio+=1
                      setResponse()
                      setResponse()
                    }*/
                    
                  }else{
                    
                      sql = `INSERT INTO folios(idFolio, idOrden, tp) VALUES (${inJSON.idFolio},${inJSON.idOrden},'${inJSON.tp}')`
                      con.query(sql, (err, result) => {
                        if(result !== undefined){
                          outJSON.idFolio = result.insertId
                        }
                        setResponse(res, outJSON,con);
                      });
                  }
                }else{
                  setResponse(res, outJSON,con)
                }
              })

            }else{
              setResponse(res, outJSON,con)
            }
          }
          //console.log(err)
          //console.log(err.)
          
        })

      }
    });
    }catch(e){
      //console.log(e)
    }
}

const genFolio = (req, res) => {
        try {
            const {idOrden} = req.body
                   if (idOrden) {

                        _genFolio(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=genFolio
