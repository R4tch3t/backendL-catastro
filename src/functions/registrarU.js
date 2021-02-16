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

const _registrarU = (req, res) => {
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
                    /*
                    var sql = `SELECT * FROM empleados WHERE CVE_ID=${inJSON.idUsuario}`
                    con.query(sql, (err, result, fields) => {
                        if (!err) {
                          if(result.length>0){
                            */
                    let sql = `SELECT * FROM usuarios WHERE idUsuario=${inJSON.idUsuario}`
                    con.query(sql, (err, result, fields) => {
                        if (!err) {

                            if (result[0]) {
                                outJSON.error.name = 'error01';
                                setResponse(res, outJSON,con)
                            } else {
                                sql = `INSERT INTO usuarios (idUsuario,nombre,correo,edad,avatar64,pass,idRol) VALUES `
                                sql += `(${inJSON.idUsuario},'${inJSON.nombre}',`
                                sql += `'${inJSON.correo}',${inJSON.edad},`
                                sql += `${inJSON.avatar64},'${inJSON.pass}',`;
                                sql += `${inJSON.idRol})`;
                                con.query(sql, function(err, result) {
                                    if (err) {
                                        console.log(`Error en la consulta: ${err}`);
                                    } else {

                                        sql = `SELECT * FROM usuarios WHERE idUsuario=${inJSON.idUsuario}`
                                        con.query(sql, (err, result, fields) => {
                                            if (!err) {
                                                outJSON = result
                                                setResponse(res, outJSON,con)
                                            }
                                        })
                                        
                                    }

                                });
                            }
                        }
                    });
                    /*
              }else{
                outJSON.error.name="error02"
                setResponse()
              }
            }else{
              outJSON.error.name = "error03"
              setResponse()
            }
        })*/
                    

                }
    });
    }catch(e){
      console.log(e)
    }
}

const registrarU = (req, res) => {
        try {
            const {correo} = req.body
                   if (correo) {

                        _registrarU(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=registrarU
