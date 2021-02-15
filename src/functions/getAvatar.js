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

const _getAvatar = (req, res) => {
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
          var sql = `SELECT idUsuario, avatar64 FROM usuarios WHERE idUsuario=${inJSON.idUsuario}`
          con.query(sql, (err, result, fields) => {
          
            if (!err) {
              
              if(result.length>0){
                  outJSON = result
              }else{
                outJSON.error.name='error02'
              }
              setResponse(res, outJSON, con)
            }else{

            }
          });

        }
      });
    }catch(e){
      console.log(e)
    }
}

const getAvatar = (req, res) => {
        try {
            const {idUsuario} = req.body
                   if (idUsuario) {

                        _getAvatar(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=getAvatar
