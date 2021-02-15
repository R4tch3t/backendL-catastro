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

const _getPredial = (req, res) => {
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
        
            let sql = `SELECT * FROM predial${inJSON.tp} p `
            sql += `WHERE p.idOrden=${inJSON.idOrden} ORDER by p.idImpuesto ASC`
            con.query(sql, (err, result, fields) => {
                if (!err) {
                  if (result.length > 0) {
                    outJSON.predial = result
                  }
                }
                sql = `SELECT * FROM loca${inJSON.tp} p `
                sql += `WHERE p.CTA=${inJSON.CTA}`
                con.query(sql, (err, result, fields) => {
                  if (!err) {
                    if (result.length > 0) {
                      outJSON.loca = result
                    }
                  }
                  sql = `SELECT * FROM pc${inJSON.tp} p `
                  sql += `WHERE p.CTA=${inJSON.CTA}`
                  con.query(sql, (err, result, fields) => {
                    if (!err) {
                      if (result.length > 0) {
                        outJSON.pc = result
                      }
                    }
                    sql = `SELECT * FROM pt${inJSON.tp} p `
                    sql += `WHERE p.CTA=${inJSON.CTA}`
                    con.query(sql, (err, result, fields) => {
                      if (!err) {
                        if (result.length > 0) {
                          outJSON.pt = result
                        }
                      }
                      setResponse(res, outJSON,con)
                    });
                  });
                });
            });

            

      }
    });
    }catch(e){
      console.log(e)
    }
}

const getPredial = (req, res) => {
        try {
            const {idOrden} = req.body
                   if (idOrden) {

                        _getPredial(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=getPredial
