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

insertForma = (inJSON,outJSON,res,con) => {
    let sql = `INSERT INTO ordenes (nombre,tp,total,idEmpleado) VALUES `
    sql += `('${inJSON.nombre}', '${inJSON.tp}',`
    sql += `'${inJSON.total}','${inJSON.idEmpleado}')`
    con.query(sql, (err, result, fields) => {
      if (!err) { 
          const idOrden = result.insertId
          sql = `SELECT * FROM ordenes WHERE idOrden=${idOrden} ORDER by idOrden DESC`
          con.query(sql, (err, result, fields) => {
            let c = 0;
            outJSON.idOrden = result[0].idOrden
            outJSON.dateUp = result[0].dateUp
            sql = `INSERT INTO folios(idOrden, tp) VALUES (${outJSON.idOrden},'${inJSON.tp}')`
            con.query(sql, (err, result) => {
              outJSON.folio = result.insertId
              if (inJSON.idImpuestos.length === 0) {
                outJSON.exito = 0
                setResponse(res, outJSON,con)
              }
              inJSON.idImpuestos.forEach(element => {
                sql = `INSERT INTO formas (idOrden,idImpuesto,val) VALUES `
                sql += `(${outJSON.idOrden},'${element.id}',`
                sql += `'${element.val}')`
                con.query(sql, (err, result, fields) => {
                  if (!err) {
                    //INSERT NEW ORDEN
                    c++;
                    if(inJSON.idImpuestos.length===c){
                      outJSON.exito = 0
                      setResponse(res, outJSON,con)
                    }
                          
                  }
                });

              });

            })

          })
      }
  });
}

outFolio=(inJSON,outJSON,res,con)=>{
outJSON.idOrden = inJSON.idOrden
outJSON.dateUp = inJSON.dateUp
sql = `SELECT * FROM folios WHERE idOrden=${inJSON.idOrden} AND tp='f'`
con.query(sql, (err, result, fields) => {
  if (result.length > 0) {
    outJSON.folio = result[0].idFolio
  }
  outJSON.exito = 0
  setResponse(res, outJSON,con)
})
}

const _registrarF = (req, res) => {
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
        let sql = `SELECT * FROM ordenes WHERE idOrden=${inJSON.idOrden} ORDER by idOrden DESC`
        
        con.query(sql, (err, result, fields) => {
          if(result.length===0){
            insertForma(inJSON,outJSON,res,con)
          }else{
            sql = `UPDATE ordenes SET nombre='${inJSON.nombre}',total='${inJSON.total}',dateUp='${inJSON.dateUp}' `
            sql += `WHERE idOrden=${inJSON.idOrden} `
            con.query(sql, (err, result, fields) => {
              let c = 0;
              if (inJSON.removI.length === 0) {
                  inJSON.removI = [{id: -1}]
              }
              inJSON.removI.forEach(e => {
                sql = `DELETE FROM formas `
                sql += `WHERE idOrden=${inJSON.idOrden} AND idImpuesto=${e.id} `
                con.query(sql, (err, result, fields) => {
                  c++
                  if (inJSON.removI.length === c) {
                    let c = 0;
                    if (inJSON.idImpuestos.length === 0) {
                      outFolio(inJSON,outJSON,res,con)
                    }
                    inJSON.idImpuestos.forEach(element => {
                      sql = `SELECT * FROM formas `
                      sql += `WHERE idOrden=${inJSON.idOrden} AND idImpuesto=${element.id} `
                      con.query(sql, (err, result, fields) => {
                        if(result.length===0){
                          sql = `INSERT INTO formas (idOrden,idImpuesto,val) VALUES `
                          sql += `(${inJSON.idOrden},'${element.id}',`
                          sql += `'${element.val}')`
                          con.query(sql, (err, result, fields) => {
                            if (!err) {
                              c++;
                              if (inJSON.idImpuestos.length === c) {
                                outFolio(inJSON,outJSON,res,con)
                              }

                            }
                          });

                        }else{

                          sql = `UPDATE formas SET val='${element.val}' WHERE `
                          sql += `idOrden=${inJSON.idOrden} AND idImpuesto='${element.id}'`
                          con.query(sql, (err, result, fields) => {
                            if (!err) {
                              //INSERT NEW ORDEN
                              c++;
                              if (inJSON.idImpuestos.length === c) {
                                outFolio(inJSON,outJSON,res,con)
                              }

                            }
                          });

                        }
                      })
                      


                    });

                  }
                })
              })
            })
          }
        })

      }
    });
    }catch(e){
      console.log(e)
    }
}

const registrarF = (req, res) => {
        try {
            const {nombre} = req.body
                   if (nombre) {

                        _registrarF(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=registrarF
