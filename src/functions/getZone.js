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

const _getZone = (req, res) => {
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
        let sql = `SELECT * FROM zonac WHERE calle LIKE '%${inJSON.street}%' AND colonia LIKE '%${inJSON.barr}%' `
        //sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') `
        //sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA`
        con.query(sql, (err, result, fields) => {
          if (!err) {
            if(result.length>0){
              outJSON.zona = result
              
            }else{
              outJSON.error.name='error01';
              outJSON.ordenes = [];
            }
            setResponse(res, outJSON,con)
          }else{

          }
        });

      }
    });
    }catch(e){
      console.log(e)
    }
}

const getZone = (req, res) => {
        try {
            const {street} = req.body
                   if (street) {

                        _getZone(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=getZone
