const mysql = require('mysql');

const setResponse = (res, outJSON, con) => {
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

const _actualizarU = (req, res) => {                                              
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
       /* var sql = `SELECT * FROM empleados WHERE CVE_ID=${inJSON.idUsuario}`
        con.query(sql, (err, result, fields) => {
            if (!err) {
              if (result.length > 0) {
                */
                  let sql = `SELECT * FROM usuarios WHERE idUsuario=${inJSON.idUsuario}`
                  con.query(sql, (err, result, fields) => {
                    if (!err) {
                      
                      if (result[0] !== undefined && `${result[0].idUsuario}` === `${inJSON.idUsuario}`) {
                        sql = `UPDATE usuarios SET nombre='${inJSON.nombre}', `;
                        sql += `correo='${inJSON.correo}', `
                        sql += `edad=${inJSON.edad}`
                        if(inJSON.avatar64!==null){
                          sql += `, avatar64=${inJSON.avatar64}`
                        }
                        /*if (`${inJSON.pass}`!==`${""}`){
                          sql += `, pass='${inJSON.pass}'`
                        }*/
                        sql += ` WHERE idUsuario=${inJSON.idUsuario} `
                        //sql += `idRol=${inJSON.idRol}, `
                        con.query(sql, function (err, result) {
                          if (err) {
                            console.log(`Error en la consulta: ${err}`);
                          } else {

                            sql = `SELECT * FROM usuarios WHERE idUsuario=${inJSON.idUsuario}`
                            con.query(sql, (err, result, fields) => {
                                if (!err) {
                                  outJSON = result
                                  setResponse(res, outJSON, con);
                                }
                            })
                            
                          }

                        });
                      }
                    }
                  });
              /*}else{
                outJSON.error.name="error01"
                setResponse()
              }

            }else{
              outJSON.error.name = "error01"
              setResponse()
            }
        })*/
        

      }
    });
    }catch(e){
      console.log(e)
    }
}

const actualizarU = (req, res) => {
        try {
            const {correo} = req.body
                   if (correo) {

                        _actualizarU(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=actualizarU
