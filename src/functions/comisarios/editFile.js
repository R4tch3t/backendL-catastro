const mysql = require('mysql');
const fs = require('fs');

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

const addData = (inJSON, outJSON, res, con) => {
  //const {CTA, nombre} = inJSON
  
  let subqueryB = ''
  let sql = `INSERT INTO padron( LOCALIDAD, CARGO, NOMBRE, CNOMBRE, CAPELLIDO1, CAPELLIDO2, SEXO, EDAD, `
      sql += `FECHAN, FECHAE, CARGO1, CARGO2, TELEFONO, DOC, OBS) VALUES ('${inJSON.localidad}','${inJSON.cargo}',`
      sql += `'${inJSON.nombre}','','','','${inJSON.sexo}','${inJSON.edad}','${inJSON.fechaN}','${inJSON.fechaE}','','','${inJSON.telefono}','${inJSON.fileName}','${inJSON.obs}')`
  con.query(sql, (err, result, fields) => {
  //const CTA=result.
  if(result !== undefined){
                          outJSON.CTA = result.insertId
  }
  sql = `SELECT * FROM padron p WHERE p.NP=${outJSON.CTA?outJSON.CTA:-3} ORDER by p.NP ASC`

  con.query(sql, (err, result, fields) => {
    outJSON.comisarios = [];
    let i = 0;
    
    result.forEach(e => { 
      e.FECHAN = new Date(e.FECHAN)
     
      e.FECHAE = new Date(e.FECHAE)
     
      try{
        e.FECHAN=e.FECHAN.toLocaleString();
        e.FECHAE=e.FECHAE.toLocaleString();
      }catch(e){

      }
      outJSON.comisarios.push({
        key: e.NP,
        nombre: e.NOMBRE,
        sexo: e.SEXO,
        edad: e.EDAD,
       // nMov: e.idMov===1?"Generar Orden de Pago":(e.idMov===2?"Actualizar Orden de Pago":(e.idMov===3?"Registrar Contribuyente":(e.idMov===4?"Actualizar Contribuyente":""))),
        localidad: e.LOCALIDAD,
        telefono: e.TELEFONO,
        cargo: e.CARGO,
        fechaN: e.FECHAN,
        fechaE: e.FECHAE,
        cargo1: e.CARGO1,
        cargo2: e.CARGO2,
        documento: e.DOC,
        obs:  e.OBS
        //dateIn: new Date(e.dateIn - tzoffset).toISOString().slice(0, -1),
      });

      outJSON.exito=1;
      i++
    });
    setResponse(res,outJSON,con);
  });
});
}

const editData = (inJSON, outJSON, res, con) => {
  let sql = `UPDATE documentos SET descripcion='${inJSON.descripcion}' `
      sql += `WHERE idDoc=${inJSON.idDoc} `
  con.query(sql, (err, result, fields) => {
    //const CTA=result.
    
    setResponse(res,outJSON,con);
  });
}

const deleteData = (inJSON, outJSON, res, con) => {
  let sql = `DELETE FROM documentos `
      sql += `WHERE idDoc=${inJSON.idDoc} `
      console.log(sql)
  con.query(sql, (err, result, fields) => {
    //const CTA=result.
    let subPath = "/var/comisarios/" + inJSON.CTA
    subPath += "/" + inJSON.nombre
    console.log(subPath)
    try{
      fs.unlinkSync(subPath)
    }catch(e){
      console.log(e);
    }
    setResponse(res,outJSON,con);
  });

}

const _editFile = (req, res) => {
    const inJSON = req.body
    let outJSON = {}
    const {bandEdit} = inJSON
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER2,
        password: process.env.NODE_MYSQL_PASS,
        database: "comisarios"
    });
    try {
      con.connect((err) => {
        outJSON = {};
        outJSON.error = {};
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          //getDataHistory
          
          /*if(inJSON.changeN){
            let sql = `UPDATE padron${inJSON.tp} SET contribuyente='${inJSON.contribuyente}' WHERE CTA=${inJSON.CTA}`;
            con.query(sql, (err, result, fields) => {
              checkUbi(inJSON, outJSON, res, con);
            });
          }else{*/
            //process.env.TZ = "America/Mexico_City"
            if(bandEdit){
              editData(inJSON, outJSON, res, con);
            }else{
              deleteData(inJSON, outJSON, res, con);
            }
          //}
          //console.log("Connected!");

        }
      });
    } catch (e) {
      console.log(e)
    }
}

const editFile = (req, res) => {
        try {
          console.log(req.body)
         // console.log(res)
         const {CTA} = req.body;
         if(CTA){ 
            _editFile(req,res)
         }else{
           res.end()
         }

           /* const {s,op} = req.body
                   if (s!==undefined||op!==undefined) {
                    switch(s){
                     case 1:
                       getLength(req, res);
                      break;
                     default:
                       _getMov(req, res)
                      break;
                    }

                    } else {
                        res.end()
                    }*/
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=editFile;
