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

const _actualizarC = (req, res) => {
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
                    let sql = `SELECT * FROM padron${inJSON.tp} WHERE CTA=${inJSON.CTA}`
                    con.query(sql, (err, result, fields) => {
                        if (result.length !== 0) {
                            sql = `UPDATE padron${inJSON.tp} SET contribuyente='${inJSON.nombre}', ubicacion='${inJSON.calle}', `
                            sql += `m1='${inJSON.m1}', m2='${inJSON.m2}', tc='${inJSON.tc}', `
                            sql += `zona='${inJSON.zona}', bg='${inJSON.bg}', observaciones='${inJSON.obs}', `
                            sql += `periodo='${inJSON.periodo}' WHERE CTA=${inJSON.CTA}`
                            con.query(sql, (err, result, fields) => {

                                if (!err) {
                                    outJSON.contribuyente = result
                                    sql = `UPDATE ubipredio${inJSON.tp} SET calle='${inJSON.calle}', `
                                    sql += `lote='${inJSON.lote}', manzana='${inJSON.manzana}', numero='${inJSON.numCalle}', `
                                    sql += `colonia='${inJSON.colonia}', cp='${inJSON.cp}', municipio='${inJSON.municipio}', `
                                    sql += `localidad='${inJSON.localidad}' `
                                    sql += `WHERE CTA=${inJSON.CTA}`
                                    con.query(sql, (err, result, fields) => {
                                        if (result.affectedRows === 0) {

                                            sql = `INSERT INTO ubipredio${inJSON.tp} (CTA,calle,lote,manzana,numero,colonia,cp,municipio,localidad) VALUES `
                                            sql += `(${inJSON.CTA},'${inJSON.calle}','${inJSON.lote}',`
                                            sql += `'${inJSON.manzana}','${inJSON.numCalle}','${inJSON.colonia}',`
                                            sql += `'${inJSON.cp}','${inJSON.municipio}',`;
                                            sql += `'${inJSON.localidad}')`;

                                            con.query(sql, (err, result, fields) => {

                                                outJSON.ubipredio = result
                                                setResponse(res, outJSON,con)

                                            });
                                        } else {
                                            outJSON.ubipredio = result
                                            setResponse(res, outJSON,con)
                                        }
                                    })

                                } else {
                                    outJSON.error.name = "error03"
                                        //setResponse()
                                }

                            })
                        } else {
                            outJSON.error.name = "error01"
                            setResponse(res, outJSON,con)
                        }
                        
                    })

                }
            });
    }catch(e){
      console.log(e)
    }
}

const actualizarC = (req, res) => {
        try {
            const {CTA} = req.body
                   if (CTA) {

                        _actualizarC(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=actualizarC
