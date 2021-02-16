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

const _registrarC = (req, res) => {
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
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        let sql = `SELECT * FROM padron${inJSON.tp} WHERE CTA=${inJSON.CTA}`
        con.query(sql, (err, result, fields) => {

            if (!err) {
              if(result.length===0){
                sql = `INSERT INTO padron${inJSON.tp}(CTA, contribuyente, ubicacion, m1, m2, tc, zona, bg, observaciones, periodo) `
                sql += `VALUES (${inJSON.CTA},'${inJSON.nombre}','',${inJSON.m1},${inJSON.m2},${inJSON.tc},${inJSON.zona},${inJSON.bg},`
                sql += `'${inJSON.obs}','${inJSON.periodo}')`
                con.query(sql, (err, result, fields) => {
                  if (!err) {
                    outJSON.contribuyente = result
                    sql = `INSERT INTO ubipredio${inJSON.tp}(CTA, calle, lote, manzana, numero, colonia, cp, municipio, localidad) `
                    sql += `VALUES (${inJSON.CTA},'${inJSON.calle}','${inJSON.lote}','${inJSON.manzana}', `
                    sql += `'${inJSON.numCalle}','${inJSON.colonia}','${inJSON.cp}', '${inJSON.municipio}', '${inJSON.localidad}')`
                    
                    con.query(sql, (err, result, fields) => {
                          if (!err) {
                            setResponse(res, outJSON, con)
                          }
                    })
                  }
                  
                });
              }else{
                outJSON.error.name = "error01"
                setResponse(res, outJSON, con)
              }

            }else{
              outJSON.error.name = "error03"
              setResponse(res, outJSON,con)
            }
            

        })

      }
    });
    }catch(e){
      console.log(e)
    }
}

const registrarC = (req, res) => {
        try {
            const {CTA} = req.body
                   if (CTA) {

                        _registrarC(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=registrarC
