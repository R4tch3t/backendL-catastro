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

const getLength = (req, res) => {
  try{
    let outJSON = {}
    let inJSON = req.body
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER2,
        password: process.env.NODE_MYSQL_PASS,
        database: "comisarios"
    });
    con.connect((err) => {
      if(!err){
        inJSON.fi=new Date(inJSON.fi);
        inJSON.ff=new Date(inJSON.ff);
        let splitD = (inJSON.fi+"").split("GMT");
        if(splitD.length>1){
          splitD = splitD[1].split("+").join("");
          if(splitD[0]==='-'){
            splitD = splitD[0]+""+splitD[1]+""+splitD[2];
          }else{
            splitD = splitD[0]+""+splitD[1];
          }
          splitD = parseInt(splitD);
        }
        inJSON.fi.setHours(inJSON.fi.getHours()+splitD);
        
        splitD = (inJSON.ff+"").split("GMT");
        if(splitD.length>1){
          splitD = splitD[1].split("+").join("");
          if(splitD[0]==='-'){
            splitD = splitD[0]+""+splitD[1]+""+splitD[2];
          }else{
            splitD = splitD[0]+""+splitD[1];
          }
          splitD = parseInt(splitD);
        }
        inJSON.ff.setHours(inJSON.ff.getHours()+splitD);
        inJSON.fi=inJSON.fi.toISOString()
        inJSON.ff=inJSON.ff.toISOString()
        let sql = `SELECT * FROM history WHERE dateIn>'${inJSON.fi}' AND dateIn<='${inJSON.ff}' ORDER BY idHistory DESC`;

        switch(inJSON.op){
          case 1:
              sql = `SELECT * FROM history WHERE CTA=${inJSON.CTA} ORDER BY idHistory DESC`;
          break;
          case 2:
              sql = `SELECT * FROM history h, movs m WHERE m.mov LIKE '%${inJSON.CTA}%' AND h.idMov=m.idMov ORDER BY h.idHistory DESC`;
          break;
          case 3:
              sql = `SELECT * FROM history WHERE folio=${inJSON.CTA} ORDER BY idHistory DESC`;
          break;
        }
        console.log(sql)
        con.query(sql, (err, result, fields) => {
          if(result&&result.length>0){
            outJSON.lengthH = result.length;
            outJSON.countP = result[result.length-1].idHistory-1;
            outJSON.nextP = outJSON.countP + 50;
            outJSON.lengthHID=result[0].idHistory
            if(outJSON.nextP>result[0].idHistory){
              outJSON.nextP=result[0].idHistory
            }
          }
          setResponse(res,outJSON,con);
        });
      }
    });
  } catch(e){
    console.log(e)
  }
}

/*getLength2 = (inJSON, outJSON,res, con) => {
  let sql = `SELECT * FROM history WHERE dateIn>'${inJSON.fi}' AND dateIn<='${inJSON.ff}' ORDER BY idHistory DESC`;

  con.query(sql, (err, result, fields) => {
    outJSON.lHistory = result.length;
    outJSON.countP = result[result.length-1].idHistory;
    outJSON.nextP = outJSON.countP + 50;
    if(outJSON.nextP>result[0].idHistory){
      outJSON.nextP=result[0].idHistory
    }
    setResponse(res,outJSON,con);
  });
}*/

const getData = (inJSON, outJSON, res, con) => {
  const {comi, tipoB} = inJSON
  let subqueryB = ''

  if (comi !== '') {
    if (tipoB === 0) {
      subqueryB = `WHERE p.NP=${comi?comi:0}`
    }
    if (tipoB === 1) {
      subqueryB = `WHERE p.NOMBRE LIKE '%${comi}%'`
    }
  }

  let sql = `SELECT * FROM padron p ${subqueryB} ORDER by p.NP ASC`
  console.log(sql)
  con.query(sql, (err, result, fields) => {
    outJSON.comisarios = [];
    let i = 0;
    if(result){
    result.forEach(e => { 
      e.FECHAN = new Date(e.FECHAN)
     /* let splitD = (e.FECHAN+"").split("GMT");
      if(splitD.length>1){
        splitD = splitD[1].split("+").join("");
        if(splitD[0]==='-'){
          splitD = splitD[0]+""+splitD[1]+""+splitD[2];
        }else{
          splitD = splitD[0]+""+splitD[1];
        }
        splitD = parseInt(splitD);
      }
      e.FECHAN.setHours(e.FECHAN.getHours()+splitD);*/
      
      e.FECHAE = new Date(e.FECHAE)
      /*splitD = (e.FECHAE+"").split("GMT");
      if(splitD.length>1){
        splitD = splitD[1].split("+").join("");
        if(splitD[0]==='-'){
          splitD = splitD[0]+""+splitD[1]+""+splitD[2];
        }else{
          splitD = splitD[0]+""+splitD[1];
        }
        splitD = parseInt(splitD);
      }
      e.FECHAE.setHours(e.FECHAE.getHours()+splitD);*/

      try{
        /*e.FECHAN=e.FECHAN.toISOString()
        e.FECHAE=e.FECHAE.toISOString()*/
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
      i++
    });
  }

    setResponse(res,outJSON,con);
  });
}

const _getComisarios = (req, res) => {
    const inJSON = req.body
    let outJSON = {}
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
            
            getData(inJSON, outJSON, res, con);
          //}
          //console.log("Connected!");

        }
      });
    } catch (e) {
      console.log(e)
    }
}

const getComisarios = (req, res) => {
        try {
          _getComisarios(req,res)
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
 
module.exports=getComisarios;
