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
  const d = new Date();
  //d.setHours(d.getHours()-6);
  let splitD = (d+"").split("GMT");
  if(splitD.length>1){
    splitD = splitD[1].split("+").join("");
    if(splitD[0]==='-'){
      splitD = splitD[0]+""+splitD[1]+""+splitD[2];
    }else{
      splitD = splitD[0]+""+splitD[1];
    }
    splitD = parseInt(splitD);
  }
  d.setHours(d.getHours()+splitD);
  let sql = `INSERT INTO history (idMov,idUsuario,CTA,idOrden,folio,idDataHistory,dateIn) VALUES `
  sql += `('${inJSON.idMov}','${inJSON.idEmpleado}','${inJSON.CTA}',`
  sql += `'${inJSON.idOrden}','${inJSON.folio}','${outJSON.idDataHistory}','${d.toISOString()}')`
  con.query(sql, (err, result, fields) => {

      outJSON.exito = 1
      setResponse(res,outJSON,con);

  });

}

const setData = (inJSON, outJSON, res, con) => {
  //if(!inJSON.contribuyenteOld.ubicacion)
  let sql = `INSERT INTO datahistory (contribuyenteOld,contribuyente,tpOld,tp,calleOld,calle,numeroOld,numero,loteOld,lote,manzanaOld,manzana,colOld,col,cpOld,cp, `
  sql+= `municipioOld,municipio,localidadOld,localidad,obsOld,obs,m1Old,m1,m2Old,m2,tcOld,tc,zonaOld,zona,bgOld,bg) VALUES`
  sql += `('${inJSON.contribuyenteOld.contribuyente.contribuyente}','${inJSON.contribuyente.contribuyente}','${inJSON.tp}','${inJSON.tp}',`
  sql += `'${inJSON.contribuyenteOld.ubicacion.calle}', '${inJSON.calle}', '${inJSON.contribuyenteOld.ubicacion.numero}', '${inJSON.numero}', '${inJSON.contribuyenteOld.ubicacion.lote}','${inJSON.lote}',`
  sql += `'${inJSON.contribuyenteOld.ubicacion.manzana}', '${inJSON.manzana}', '${inJSON.contribuyenteOld.ubicacion.colonia}','${inJSON.colonia}',`;
  sql += `'${inJSON.contribuyenteOld.ubicacion.cp}','${inJSON.cp}', '${inJSON.contribuyenteOld.ubicacion.municipio}', '${inJSON.municipio}', '${inJSON.contribuyenteOld.ubicacion.localidad}','${inJSON.localidad}',`;
  sql += `'${inJSON.contribuyenteOld.contribuyente.observaciones}','${inJSON.obs}','${inJSON.contribuyenteOld.contribuyente.m1}','${inJSON.m1}','${inJSON.contribuyenteOld.contribuyente.m2}','${inJSON.m2}',`;
  sql += `'${inJSON.contribuyenteOld.contribuyente.tc}','${inJSON.tc}','${inJSON.contribuyenteOld.contribuyente.zona}','${inJSON.zona}','${inJSON.contribuyenteOld.contribuyente.bg}','${inJSON.bg}')`
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
