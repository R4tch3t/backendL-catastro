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

insertMov = (inJSON, outJSON,res, con) => {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const dateIn = new Date(new Date() - tzoffset*2).toISOString()
  sql = `INSERT INTO history (idMov,idUsuario,CTA,idOrden,folio,idDataHistory,dateIn) VALUES `
  sql += `('${inJSON.idMov}','${inJSON.idEmpleado}','${inJSON.CTA}',`
  sql += `'${inJSON.idOrden}','${inJSON.folio}','${outJSON.idDataHistory}','${dateIn}')`
  con.query(sql, (err, result, fields) => {

      outJSON.exito = 1
      setResponse(res,outJSON,con);

  });

}

const setData = (inJSON, outJSON, res, con) => {

  sql = `INSERT INTO datahistory (contribuyente,tp,calle,numero,lote,manzana,col,cp,municipio,localidad,obs,m1,m2,tc,zona,bg) VALUES `
  sql += `('${inJSON.contribuyente.contribuyente}','${inJSON.tp}','${inJSON.calle}',`
  sql += `'${inJSON.numero}','${inJSON.lote}','${inJSON.manzana}',`
  sql += `'${inJSON.colonia}','${inJSON.cp}','${inJSON.municipio}','${inJSON.localidad}',`;
  sql += `'${inJSON.obs}','${inJSON.m1}','${inJSON.m2}','${inJSON.tc}','${inJSON.zona}',`;
  sql += `'${inJSON.bg}')`;
  con.query(sql, (err, result, fields) => {

    if (result) {
      outJSON.idDataHistory = result.insertId;
      insertMov(inJSON, outJSON,res,con)

    }
  });
}

const _setMov = (req, res) => {
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
        outJSON = {};
        outJSON.error = {};
        if (err) {
          console.log(`Error: ${err}`);
        } else {
            setData(inJSON, outJSON, res, con);
        }
      });
    } catch (e) {
      console.log(e)
    }
}

const setMov = (req, res) => {
        try {
            const {idEmpleado} = req.body
                   if (idEmpleado) {

                        _setMov(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=setMov;
