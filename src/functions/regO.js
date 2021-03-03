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

insertOrden = (inJSON, outJSON,res, con) => {

if (inJSON.dateUp === '') {
      sql = `INSERT INTO ordenes${inJSON.tp} (CTA,m1,m2,tc,zona,bg,periodo,total,idEmpleado,constancia,otroservicio,certi,obs) VALUES `
      sql += `(${inJSON.CTA},'${inJSON.m1}','${inJSON.m2}',`
      sql += `'${inJSON.tc}','${inJSON.zona}','${inJSON.bg}',`
      sql += `'${inJSON.periodo}','${inJSON.total}','${inJSON.idEmpleado}','${inJSON.labelConsta}','${inJSON.otroservicio}','${inJSON.labelCerti}','${inJSON.obs}')`;
    } else {
      sql = `INSERT INTO ordenes${inJSON.tp} (CTA,m1,m2,tc,zona,bg,periodo,total,idEmpleado,constancia,otroservicio,certi,obs,dateUp) VALUES `
      sql += `(${inJSON.CTA},'${inJSON.m1}','${inJSON.m2}',`
      sql += `'${inJSON.tc}','${inJSON.zona}','${inJSON.bg}',`
      sql += `'${inJSON.periodo}','${inJSON.total}','${inJSON.idEmpleado}','${inJSON.labelConsta}','${inJSON.otroservicio}','${inJSON.labelCerti}','${inJSON.obs}','${inJSON.dateUp}')`;
    }
    con.query(sql, (err, result, fields) => {
      if (!err) {
        sql = `SELECT * FROM ordenes${inJSON.tp} WHERE CTA=${inJSON.CTA} AND periodo='${inJSON.periodo}' ORDER by idOrden DESC`
        con.query(sql, (err, result, fields) => {
          let c = 0;
          outJSON.idOrden = result[0].idOrden
          outJSON.dateUp = result[0].dateUp
          sql = `INSERT INTO folios(idOrden, tp) VALUES (${outJSON.idOrden},'${inJSON.tp}')`
          con.query(sql, (err, result) => {
            outJSON.folio = result.insertId
            if (inJSON.idImpuestos.length === 0) {
              outJSON.exito = 0
              setResponse(res,outJSON,con);
            }
            inJSON.idImpuestos.forEach(element => {
              sql = `INSERT INTO predial${inJSON.tp} (idOrden,idImpuesto,val) VALUES `
              sql += `(${outJSON.idOrden},'${element.id}',`
              sql += `'${element.val}')`
              con.query(sql, (err, result, fields) => {
                if (!err) {
                  //INSERT NEW ORDEN
                  c++;
                  if (inJSON.idImpuestos.length === c) {
                    outJSON.exito = 0
                    setResponse(res,outJSON,con);
                  }

                }
              });

            });

          })

        })
      }
      console.log(err)
    });
}

const checkUbi = (inJSON, outJSON, res, con) => {
  let sql = `SELECT * FROM ubipredio${inJSON.tp} WHERE CTA=${inJSON.CTA}`;
          con.query(sql, (err, result, fields) => {

            if (!err) {
              if (result.length === 0) {

                sql = `INSERT INTO ubipredio${inJSON.tp} (CTA,calle,lote,manzana,numero,colonia,cp,municipio,localidad) VALUES `
                sql += `(${inJSON.CTA},'${inJSON.calle}','${inJSON.lote}',`
                sql += `'${inJSON.manzana}','${inJSON.numero}','${inJSON.colonia}',`
                sql += `'${inJSON.cp}','${inJSON.municipio}',`;
                sql += `'${inJSON.localidad}')`;
                con.query(sql, (err, result, fields) => {

                  if (!err) {

                    insertOrden(inJSON, outJSON,res,con)

                  }
                });

              } else {
                sql = `UPDATE ubipredio${inJSON.tp} SET calle='${inJSON.calle}', lote='${inJSON.lote}', `
                sql += `manzana='${inJSON.manzana}', numero='${inJSON.numero}', colonia='${inJSON.colonia}', `
                sql += `cp='${inJSON.cp}', municipio='${inJSON.municipio}', `;
                sql += `localidad='${inJSON.localidad}' WHERE CTA=${inJSON.CTA}`;
                con.query(sql, (err, result, fields) => {
                  sql = `SELECT * FROM ordenes${inJSON.tp} WHERE idOrden=${inJSON.idOrden} ORDER by idOrden DESC`
                  con.query(sql, (err, result, fields) => {
                    if (!err) {
                      if (result.length === 0) {
                        insertOrden(inJSON, outJSON,res,con)
                        /*let c = 0;
                        inJSON.idImpuestos.forEach(element => {
                          sql = `INSERT INTO predial${inJSON.tp} (idOrden,idImpuesto,val) VALUES `
                          sql += `(${result[0].idOrden},'${element.id}',`
                          sql += `'${element.val}')`
                          con.query(sql, (err, result, fields) => {
                            if (!err) {
                              //INSERT NEW ORDEN
                              c++;
                              if (inJSON.idImpuestos.length === c) {
                                outJSON.exito = 0
                                setResponse()
                              }

                            }
                          });
                        });*/

                      } else {
                        let idOrden = result[0].idOrden
                        outJSON.idOrden = idOrden
                        outJSON.dateUp = inJSON.dateUp
                        sql = `SELECT * FROM folios WHERE idOrden=${idOrden} AND tp='${inJSON.tp}'`
                        con.query(sql, (err, result, fields) => {
                          outJSON.folio = result[0].idFolio
                          sql = `UPDATE ordenes${inJSON.tp} SET m1='${inJSON.m1}', m2='${inJSON.m2}', tc='${inJSON.tc}', `
                          sql += `zona='${inJSON.zona}', bg='${inJSON.bg}', total='${inJSON.total}', periodo='${inJSON.periodo}', `
                          sql += `constancia='${inJSON.labelConsta}', certi='${inJSON.labelCerti}',`
                          sql += `otroservicio='${inJSON.otroservicio}', obs='${inJSON.obs}', dateUp='${inJSON.dateUp}' WHERE idOrden=${idOrden}`
                          con.query(sql, (err, result, fields) => {
                            if (!err) {
                              let c = 0;
                              if (inJSON.removI.length === 0) {
                                inJSON.removI = [{
                                  id: -1
                                }]
                              }
                              inJSON.removI.forEach(e => {
                                sql = `DELETE FROM predial${inJSON.tp} `
                                sql += `WHERE idOrden=${idOrden} AND idImpuesto=${e.id} `
                                con.query(sql, (err, result, fields) => {

                                  if (!err) {
                                    c++;
                                    if (inJSON.removI.length === c) {
                                      c = 0;
                                      if (inJSON.idImpuestos.length === 0) {
                                        outJSON.exito = 0
                                        setResponse(res,outJSON,con);
                                      }
                                      inJSON.idImpuestos.forEach(element => {
                                        sql = `UPDATE predial${inJSON.tp} SET val='${element.val}' `
                                        sql += `WHERE idOrden=${idOrden} AND idImpuesto=${element.id} `
                                        con.query(sql, (err, result, fields) => {
                                          if (!err) {

                                            if (result.affectedRows > 0) {
                                              c++;
                                              if (inJSON.idImpuestos.length === c) {
                                                outJSON.exito = 0
                                                setResponse(res,outJSON,con);
                                              }
                                            } else {
                                              sql = `INSERT INTO predial${inJSON.tp} (idOrden,idImpuesto,val) VALUES `
                                              sql += `(${idOrden},'${element.id}',`
                                              sql += `'${element.val}')`
                                              con.query(sql, (err, result, fields) => {
                                                if (!err) {
                                                  c++;
                                                  if (inJSON.idImpuestos.length === c) {
                                                    outJSON.exito = 0
                                                    setResponse(res,outJSON,con);
                                                  }

                                                }
                                              });
                                            }
                                          }
                                        });
                                      });
                                    }
                                  }
                                });
                              });
                            }

                          });

                        })
                      }

                    }
                  });
                });
              }

            } else {
              outJSON.error.name = "error03"
              setResponse(res,outJSON,con);
            }

          })
}

const _regO = (req, res) => {
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
          if(inJSON.changeN){
            let sql = `UPDATE padron${inJSON.tp} SET contribuyente='${inJSON.contribuyente}' WHERE CTA=${inJSON.CTA}`;
            con.query(sql, (err, result, fields) => {
              checkUbi(inJSON, outJSON, res, con);
            });
          }else{
            checkUbi(inJSON, outJSON, res, con);
          }
          //console.log("Connected!");

        }
      });
    } catch (e) {
      console.log(e)
    }
}

const regO = (req, res) => {
        try {
            const {CTA} = req.body
                   if (CTA) {

                        _regO(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=regO;
