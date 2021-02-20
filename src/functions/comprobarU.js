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

const _comprobarU = (req, res) => {
    const {idUsuario, pass, nombre, correo, edad, idRol} = req.body
    let outJSON = {}
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    con.connect((err) => {
        outJSON = {};
        outJSON.error = {};
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            let sql = `SELECT idUsuario, nombre, correo, edad, pass, idRol FROM usuarios WHERE idUsuario=${idUsuario}`
            
            con.query(sql, (err, result, fields) => {
                if (!err) {
                    if (result.length > 0) {
                        if (result[0].pass === pass&&!nombre) {
                            outJSON = result
                        } else if(!nombre) {
                            outJSON.error.name = 'error01'
                        }else if (result[0].nombre+"" !== nombre+"" || result[0].correo+"" !== correo+"" || result[0].edad+"" !== edad+"" || result[0].idRol+"" !== idRol+"" ) {
                            console.log(result[0].nombre+" !== "+nombre)
                            console.log(result[0].correo+" !== "+correo)
                            console.log(result[0].edad+" !== "+edad)
                            console.log(result[0].idRol+" !== "+idRol)
                            outJSON.error.name = 'errorH'
                            outJSON.rsecury = 1
                        } 
                    } else {
                        outJSON.error.name = 'error02'
                    }
                    
                } else {

                }
                setResponse(res,outJSON,con);
            });

        }
    });
}

const comprobarU = (req, res) => {
        try {
            const {idUsuario} = req.body
                   if (idUsuario) {

                        _comprobarU(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=comprobarU
