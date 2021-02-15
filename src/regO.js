const mysql = require('mysql');

const registrarO = (servers, servCount, port, hostname) => (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  let inJSON = '';
  var outJSON = {};
  outJSON.error = {};
  var con = mysql.createConnection({
    host: "localhost",
    user: process.env.NODE_MYSQL_USER,
    password: process.env.NODE_MYSQL_PASS,
    database: "dbcatastro"
  });
  //servers[servCount].maxConnections = 1
  //const servCount = servers.length-1
  setResponse = () => {
    outJSON = JSON.stringify(outJSON);
    res.end(`${outJSON}`);
    con.destroy();
    servers[servCount].close();
    servers[servCount].listen(port, hostname);
    //bands[servCount] = false
  }

  insertOrden = () => {

    if (inJSON.dateUp === '') {
      sql = `INSERT INTO ordenes${inJSON.tp} (CTA,m1,m2,tc,zona,bg,periodo,total,idEmpleado,otroservicio) VALUES `
      sql += `(${inJSON.CTA},'${inJSON.m1}','${inJSON.m2}',`
      sql += `'${inJSON.tc}','${inJSON.zona}','${inJSON.bg}',`
      sql += `'${inJSON.periodo}','${inJSON.total}','${inJSON.idEmpleado}','${inJSON.otroservicio}')`;
    } else {
      sql = `INSERT INTO ordenes${inJSON.tp} (CTA,m1,m2,tc,zona,bg,periodo,total,idEmpleado,otroservicio,dateUp) VALUES `
      sql += `(${inJSON.CTA},'${inJSON.m1}','${inJSON.m2}',`
      sql += `'${inJSON.tc}','${inJSON.zona}','${inJSON.bg}',`
      sql += `'${inJSON.periodo}','${inJSON.total}','${inJSON.idEmpleado}','${inJSON.otroservicio}','${inJSON.dateUp}')`;
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
              setResponse()
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
                    setResponse()
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

  registrar = () => {
    try {
      con.connect((err) => {
        outJSON = {};
        outJSON.error = {};
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          let sql = `SELECT * FROM ubipredio${inJSON.tp} WHERE CTA=${inJSON.CTA}`
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

                    insertOrden()

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
                        insertOrden()
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
                          sql += `otroservicio='${inJSON.otroservicio}', dateUp='${inJSON.dateUp}' WHERE idOrden=${idOrden}`
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
                                        setResponse()
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
                                                setResponse()
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
                                                    setResponse()
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
              setResponse()
            }

          })
          console.log("Connected!");

        }
      });
    } catch (e) {
      console.log(e)
    }
  }
  //servers[servers.length - 1].maxConnections=1
  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    inJSON += chunk;
  }).on('end', async () => {

    try {
      inJSON = JSON.parse(inJSON);
      // var base64Data = inJSON.base64.replace(/^data:image\/jpg;base64,/, "");
      outJSON.error.name = 'none';
      outJSON.error.name2 = 'none';

    } catch (e) {
      //console.clear()
      console.log(`error: ${e}`);

      outJSON.error.name = `${e}`;
    }

    if (inJSON.CTA !== undefined) {
      //console.log(inJSON.CTA)
      //console.log(port)
      //if (servers[servers.length - 1].connections < 2) {
        //bands[servCount] = true
        //new Promise((resolve,reject)=>{
        //  console.log(con.state)
          registrar()
          //resolve(1)
        //})
      /*}else{
        let out2JSON = {reload: true};
        out2JSON = JSON.stringify(out2JSON);
        console.log(`out2JSON: ${out2JSON}`)
        res.end(`${out2JSON}`);
        
        servers.push(http.createServer(registrarO));

        servers[servers.length-1].listen(ports, hostname, async () => {
          console.log(`Server running at http://${hostname}:${ports}/`);
          /*const sendUri = `http://localhost:${ports}/`;
          const response = await fetch(sendUri, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyJSON)
          });

        });
      }*/
    } else {
      res.end()
    }
  });
}
exports.regO = registrarO