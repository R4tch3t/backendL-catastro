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

getSubDataNoCTA=(result,idOrden,outJSON,res,con)=>{
  outJSON.ubicacion = [{
    calle: '', lote: 0, manzana:'', numero: 0, colonia: '', cp: 0, municipio: '', localidad: '', basegrav: 0
  }];
  outJSON.orden = result
  sql = `SELECT * FROM formas f `
  sql += `WHERE f.idOrden=${idOrden} ORDER by f.idForma DESC`
  con.query(sql, (err, result, fields) => {
    if (result.length > 0) {
      outJSON.formas = result
    }
    setResponse(res, outJSON, con)
  });
}

getSubData=(tp,idOrden,con,outJSON,res)=>{
  let sql = `SELECT * FROM ordenes${tp} o `
  sql += `WHERE o.idOrden=${idOrden} ORDER by o.idOrden DESC`
  console.log(sql)
  con.query(sql, (err, result, fields) => {
    if (!err) {
      if (result.length > 0) {
        outJSON.orden = result[0]
        sql = `SELECT * FROM padron${tp} p WHERE p.CTA=${outJSON.orden.CTA} ORDER by p.CTA DESC`
        console.log(sql)
        con.query(sql, (err, result, fields) => {
              if (!err) {
                if (result.length > 0) {
                  outJSON.contribuyente = result
                  sql = `SELECT * FROM ubipredio${tp} u `
                  sql += `WHERE u.CTA=${result[0].CTA} ORDER by u.CTA DESC`
                  //console.log(sql)
                  con.query(sql, (err, result, fields) => {

                        if (!err) {
                          if (result.length > 0) {
                            outJSON.ubicacion = result
                          }else {
                            outJSON.ubicacion = [{
                              calle: '', lote: 0, manzana:'', numero: 0, colonia: '', cp: 0, municipio: '', localidad: '', basegrav: 0
                            }]
                          }
                          setResponse(res, outJSON,con)
                        }
                  })        
                }
              }
            })
      } else {
        setResponse(res, outJSON,con)
      }
    }
  });
  
}

const _byFolio = (req, res) => {
    //const {CTA, idOrden, dateUp, calle, lote, manzana, tp, numero, colonia, cp, municipio, localidad, m1, m2, bg, zona, tc, total, periodo, otroservicio} = req.body
    //const inJSON = {CTA, idOrden, dateUp, calle, tp, lote, manzana, numero, colonia, cp, municipio, localidad, m1, m2, bg, zona, tc, total, periodo, otroservicio}
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
        let sql = `SELECT * FROM folios f WHERE f.idFolio=${inJSON.idFolio} ORDER by f.idOrden DESC`
        con.query(sql, (err, result, fields) => {
          if(result.length>0){
           outJSON.folio = result[0]
           const tp = result[0].tp
           const idOrden = result[0].idOrden
           sql = `SELECT * FROM ordenes o `
           sql += `WHERE o.idOrden=${idOrden} AND o.tp='${tp}' ORDER by o.idOrden DESC`
           con.query(sql, (err, result, fields) => {
             if(result.length>0){
                getSubDataNoCTA(result,idOrden,outJSON,res,con)
             }else{
                getSubData(tp[0],idOrden,con,outJSON,res)
             }
           })
          }else{
            setResponse(res, outJSON,con)
          }
        })

      }
    });
    } catch (e) {
      console.log(e)
    }
}

const byFolio = (req, res) => {
        try {
            const {idFolio} = req.body
                   if (idFolio) {

                      _byFolio(req, res)

                  } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=byFolio;
