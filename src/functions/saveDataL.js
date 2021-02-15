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

const insertLoca = (inJSON,outJSON,res,con) => {
    let i = 0
    let sql = `DELETE FROM loca${inJSON.tp} WHERE CTA=${inJSON.CTA}`
    con.query(sql, (err, result, fields) => {
        if (!err) {
            if (inJSON.mInfo.length === i) {
                setResponse(res, outJSON, con)
            }
            inJSON.mInfo.forEach(e => {
                sql = `INSERT INTO loca${inJSON.tp}(CTA, lat, lng) VALUES `
                sql += `(${inJSON.CTA},'${e.lat}','${e.lng}')`
                
                con.query(sql, (err, result, fields) => {
                    if (!err) {
                        i++;
                        if (inJSON.mInfo.length === i) {
                            setResponse(res, outJSON, con)
                        }
                    } else {
                        outJSON.error.name = 'error05';
                    }
                    // setResponse()
                });

            });

        }
    })
}

const insertPT = (inJSON,outJSON,res,con) => {
        let i = 0
        let sql = `DELETE FROM pt${inJSON.tp} WHERE CTA=${inJSON.CTA}`
        con.query(sql, (err, result, fields) => {
            if (!err) {
                if (inJSON.pt.length === i) {
                    insertLoca(inJSON,outJSON,res,con)
                }
                inJSON.pt.forEach(e => {
                    sql = `INSERT INTO pt${inJSON.tp}(CTA, latT, lngT) VALUES `
                    sql += `(${inJSON.CTA},'${e.lat}','${e.lng}')`
                    
                    con.query(sql, (err, result, fields) => {
                        if (!err) {
                            i++;
                            if (inJSON.pt.length === i) {
                                insertLoca(inJSON,outJSON,res,con)
                            }
                        } else {
                            outJSON.error.name = 'error04';
                        }
                        // setResponse()
                    });

                });
            }
        })
}

const _saveDataL = (req, res) => {
    //const {CTA, street, barr, zona, tp} = req.body
    let outJSON = {}
    //let inJSON = {CTA,street,barr,zona,tp}
    let inJSON = req.body
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

                    if (inJSON.saveZone === 1) {
                        const sql = `INSERT INTO zonac(calle, colonia, valor) VALUES ('${inJSON.street}','${inJSON.barr}','${inJSON.zona}')`
                        
                        con.query(sql, (err, result, fields) => {
                            if (!err) {

                            } else {
                                outJSON.error.name = 'error01';
                            }
                        });
                    }
                    //setResponse()

                    let i = 0;
                    let sql = `DELETE FROM pc${inJSON.tp} WHERE CTA=${inJSON.CTA}`
                    con.query(sql, (err, result, fields) => {
                        if (!err) {
                            if (inJSON.pc.length === i) {
                                insertPT(inJSON,outJSON,res,con)
                            }
                            inJSON.pc.forEach(e => {
                                sql = `INSERT INTO pc${inJSON.tp}(CTA, latC, lngC) VALUES `
                                sql += `(${inJSON.CTA},'${e.lat}','${e.lng}')`
                                
                                con.query(sql, (err, result, fields) => {
                                    if (!err) {
                                        i++;
                                        if (inJSON.pc.length === i) {
                                            insertPT(inJSON,outJSON,res,con)
                                        }
                                    } else {
                                        outJSON.error.name = 'error02';
                                    }
                                    // setResponse()
                                });

                            });

                        } else {
                            outJSON.error.name = 'error03';
                        }
                    });



                }
            });
        } catch (e) {
            console.log(e)
        }
}

const saveDataL = (req, res) => {
        try {
            const {street} = req.body
                   if (street) {

                        _saveDataL(req, res)

                    } else {
                        res.send({exito: 0, m: 'No Street'});
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=saveDataL
