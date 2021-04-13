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
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
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
  let {countP,nextP} = inJSON;
  //let nextP = countP + 50; 
  //outJSON.count = nextPage; 
  let sql = `SELECT * FROM history h, datahistory dh, movs m WHERE h.idHistory>${countP} AND h.idHistory<=${nextP} AND dh.idDataHistory=h.idDataHistory AND m.idMov=h.idMov ORDER BY h.idHistory ASC`;
  switch(inJSON.op){
          case 1:
              sql = `SELECT * FROM history h, datahistory dh, movs m WHERE h.CTA=${inJSON.CTA} AND dh.idDataHistory=h.idDataHistory AND m.idMov=h.idMov ORDER BY idHistory DESC`;
          break;
          case 2:
              sql = `SELECT * FROM history h, datahistory dh, movs m WHERE m.mov LIKE '%${inJSON.CTA}%' AND h.idMov=m.idMov AND dh.idDataHistory=h.idDataHistory ORDER BY h.idHistory DESC`;
          break;
          case 3:
              sql = `SELECT * FROM history h, datahistory dh, movs m WHERE h.folio=${inJSON.CTA} AND dh.idDataHistory=h.idDataHistory AND m.idMov=h.idMov ORDER BY h.idHistory DESC`;
          break;
        }
  con.query(sql, (err, result, fields) => {
    outJSON.history = [];
    let i = 0;
    result.forEach(e => { 
      e.dateIn = new Date(e.dateIn)
      let splitD = (e.dateIn+"").split("GMT");
      if(splitD.length>1){
        splitD = splitD[1].split("+").join("");
        if(splitD[0]==='-'){
          splitD = splitD[0]+""+splitD[1]+""+splitD[2];
        }else{
          splitD = splitD[0]+""+splitD[1];
        }
        splitD = parseInt(splitD);
      }
      e.dateIn.setHours(e.dateIn.getHours()+splitD);
      outJSON.history.push({
        key: `${e.CTA}${i}`,
        idHistory: e.idHistory,
       // nMov: e.idMov===1?"Generar Orden de Pago":(e.idMov===2?"Actualizar Orden de Pago":(e.idMov===3?"Registrar Contribuyente":(e.idMov===4?"Actualizar Contribuyente":""))),
        mov: e.mov,
        nombre: e.contribuyente,
        nombreOld: e.contribuyenteOld,
        tpOld: e.tpOld,
        tp: e.tp,
        calleOld: e.calleOld,
        calle: e.calle,
        numeroOld: e.numeroOld,
        numero: e.numero,
        loteOld: e.loteOld,
        lote: e.lote,
        manzana: e.manzana,
        manzanaOld: e.manzanaOld,
        colOld: e.colOld,
        col: e.col,
        cpOld: e.cpOld,
        cp: e.cp,
        municipioOld: e.municipioOld,
        municipio: e.municipio,
        localidadOld: e.localidadOld,
        localidad: e.localidad,
        obsOld: e.obsOld,
        obs: e.obs,
        m1Old: e.m1Old,
        m1: e.m1,
        m2Old: e.m2Old,
        m2: e.m2,
        zonaOld: e.zonaOld,
        zona: e.zona,
        tcOld: e.tcOld,
        tc: e.tc,
        bgOld: e.bgOld,
        bg: e.bg,
        idUsuario: e.idUsuario,
        CTA: e.CTA,
        idOrden: e.idOrden,
        folio: e.folio,
        dateIn: e.dateIn.toISOString()
        //dateIn: new Date(e.dateIn - tzoffset).toISOString().slice(0, -1),
      })
      i++
    });
    setResponse(res,outJSON,con);
  });
}

const _getMov = (req, res) => {
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

const getMov = (req, res) => {
        try {
            const {s,op} = req.body
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
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=getMov;
