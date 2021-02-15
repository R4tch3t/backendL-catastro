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

_informeG = (inJSON,outJSON,con,res) => {
        try {

            let sql = `SELECT * FROM ordenesu o, padronu pa, predialu pr WHERE `
            sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') `
            sql += `AND pa.CTA=o.CTA AND pr.idOrden=o.idOrden ORDER by o.dateUp ASC, o.idOrden ASC`

            con.query(sql, (err, result, fields) => {
                if (!err) {
                    if (result.length > 0) {
                        outJSON.ordenesu = result


                    } else {
                        outJSON.error.name = 'error01';
                        outJSON.ordenesu = []
                    }
                    sql = `SELECT * FROM ordenesr o, padronr pa, predialr pr WHERE `
                    sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') `
                    sql += `AND pa.CTA=o.CTA AND pr.idOrden=o.idOrden ORDER by o.dateUp ASC, o.idOrden ASC`

                    con.query(sql, (err, result, fields) => {
                        if (!err) {
                            if (result.length > 0) {
                                outJSON.ordenesr = result
                                    /*result.forEach(e => {
                                      outJSON.ordenes.push(e)
                                    })*/
                                    //setResponse()

                            } else {
                                outJSON.error.name = 'error02';
                                outJSON.ordenesr = []
                            }

                        } else {}
                        sql = `SELECT * FROM padronu`
                        con.query(sql, (err, result, fields) => {
                            if (!err) {
                                outJSON.lengthU = result.length
                            }
                            sql = `SELECT * FROM padronr`
                            con.query(sql, (err, result, fields) => {
                                if (!err) {
                                    outJSON.lengthR = result.length
                                }
                                if (inJSON.bandG) {
                                    sql = `SELECT * FROM ordenes o WHERE `
                                    sql += `o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}'`
                                    sql += ` ORDER by o.dateUp ASC, o.idOrden ASC`

                                    con.query(sql, (err, result, fields) => {
                                        if (!err) {
                                            if (result.length > 0) {
                                                outJSON.ordenes = result

                                            } else {
                                                outJSON.error.name = 'error02';
                                                outJSON.ordenes = []
                                            }
                                        }
                                        setResponse(res, outJSON,con)
                                    });
                                } else {
                                    setResponse(res, outJSON,con)
                                }
                            })

                        })
                    });
                } else {

                }
            });


        } catch (e) {
            console.log(e)
        }

    }

const getCounts = (req, res) => {
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
                let sql = `SELECT * FROM ordenesu`
                    //sql += ``
                con.query(sql, (err, result, fields) => {
                    if (!err) {
                        outJSON.countU = result.length
                        let sql = `SELECT * FROM ordenesr`
                            //sql += ``
                        con.query(sql, (err, result, fields) => {
                            if (!err) {
                                outJSON.countR = result.length
                                _informeG(inJSON,outJSON,con,res)
                            }
                        });
                    }
                })
            }
        });
    }catch(e){
      console.log(e)
    }
}

const informeG = (req, res) => {
        try {
            const {fi} = req.body
                   if (fi) {

                        getCounts(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=informeG
