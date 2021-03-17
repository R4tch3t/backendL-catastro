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

const getZone = (c) => {
        if (!c) return 1
        c = c.toLowerCase()
        if (c.includes("eucaria apreza")) {
            return 3
        }
}

const _padrones = (req, res) => {
    //const {CTAnombre,tipoB,idOrden,tp} = req.body
    let outJSON = {}
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
                    let subqueryB = ''
                    let subqueryC = ''
                        //var subqueryN = ''
                        //if (inJSON.CTAnombre!==''){
                    if (inJSON.tipoB != undefined && inJSON.tipoB === 0) {
                        subqueryB = `WHERE p.CTA=${inJSON.CTAnombre}`
                    }
                    if (inJSON.tipoB != undefined && inJSON.tipoB === 1) {
                        subqueryB = `WHERE p.contribuyente LIKE '%${inJSON.CTAnombre}%'`
                    }

                    if (inJSON.idOrden != undefined && inJSON.idOrden !== '') {

                        subqueryC = `AND o.idOrden=${inJSON.idOrden}`
                    }

                    //}
                    let sql = `SELECT * FROM padron${inJSON.tp} p ${subqueryB} ORDER by p.CTA DESC`
                    con.query(sql, (err, result, fields) => {
                        if (!err) {
                            if (result.length > 0) {

                                outJSON.contribuyente = result
                                if (outJSON.contribuyente[0].zona === "0" || outJSON.contribuyente[0].zona === "") {
                                    outJSON.contribuyente[0].zona = getZone(outJSON.contribuyente[0].colonia)
                                }
                                //setResponse()
                                sql = `SELECT * FROM ubipredio${inJSON.tp} u `
                                sql += `WHERE u.CTA=${result[0].CTA} ORDER by u.CTA DESC`
                                    //console.log(sql)
                                con.query(sql, (err, result, fields) => {

                                    if (!err) {
                                        if (result.length > 0) {
                                            outJSON.ubicacion = result

                                            sql = `SELECT * FROM ordenes${inJSON.tp} o `
                                            sql += `WHERE o.CTA=${result[0].CTA} ${subqueryC} ORDER by o.idOrden DESC`
                                            con.query(sql, (err, result, fields) => {
                                                if (!err) {
                                                    if (result.length > 0) {
                                                        outJSON.orden = result[0]
                                                        const dO = new Date(outJSON.orden.dateUp)
                                                        dO.setHours(dO.getHours()-6) 
                                                        outJSON.orden.dateUpL = dO.toLocaleString();
                                                        console.log(dO)
                                                        if (outJSON.orden.zona === "0" || outJSON.orden.zona === "") {
                                                            outJSON.orden.zona = getZone(outJSON.orden.colonia)
                                                        }
                                                        /*sql = `SELECT * FROM predial${inJSON.tp} p `
                                                        sql += `WHERE p.idOrden=${result[0].idOrden} ORDER by p.idImpuesto ASC`
                                                        con.query(sql, (err, result, fields) => {
                                                            if (!err) {
                                                              if (result.length > 0) {
                                                                outJSON.predial = result
                                                              }
                                                            }
                                                            setResponse()
                                                        });*/

                                                    } else {
                                                        //setResponse()
                                                    }
                                                }
                                                setResponse(res, outJSON,con)
                                            });
                                        } else {
                                            outJSON.ubicacion = [{
                                                calle: '',
                                                lote: 0,
                                                manzana: '',
                                                numero: 0,
                                                colonia: '',
                                                cp: 0,
                                                municipio: '',
                                                localidad: '',
                                                basegrav: 0
                                            }]
                                            setResponse(res, outJSON,con)
                                        }
                                    } else {

                                    }

                                });
                            } else {
                                outJSON.error.name = 'error01'
                                setResponse(res, outJSON,con)
                            }
                        } else {

                        }
                    });


                }
            });
        } catch (e) {
            console.log(e)
        }
}

const padrones = (req, res) => {
        try {
            const {CTAnombre} = req.body
                   if (CTAnombre) {

                        _padrones(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=padrones
