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

const padronR = (subqueryB,con,res,inJSON,outJSON) => {
const sql = `SELECT * FROM padronr p, ubipredior u ${subqueryB} ORDER by p.CTA ASC`
con.query(sql, (err, result, fields) => {
  try{
      if (!err) {
        if (result.length > 0) {
          //outJSON.contribuyenter = result
          //outJSON.ubipredior = result
          outJSON.ubipredior = {};
          result.forEach(e => {
            outJSON.ubipredior[`${e.CTA}`] = e
          });
         
        }
      }
      subqueryB = 'WHERE p.CTA < 50'
      //var subqueryN = ''
      if (inJSON.CTAnombre !== '') {
        if (inJSON.tipoB != undefined && inJSON.tipoB === 0) {
            subqueryB = `WHERE p.CTA=${inJSON.CTAnombre}`
        }
        if (inJSON.tipoB != undefined && inJSON.tipoB === 1) {
          subqueryB = `WHERE p.contribuyente LIKE '%${inJSON.CTAnombre}%'`
        }
      }
    }catch(e){
      
    }
      const sql = `SELECT * FROM padronr p ${subqueryB} ORDER by p.CTA ASC`
      con.query(sql, (err, result, fields) => {
        outJSON.contribuyenter = result
        
        setResponse(res, outJSON, con)
      });
})    
}

const padronU = (req, res) => {
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
      outJSON = {};
      outJSON.error = {};
      if (err) {
        console.log(`Err on con: ${err}`);
        
      } else {
        let subqueryB = 'WHERE p.CTA < 50'
        //var subqueryN = ''
        if (inJSON.CTAnombre !== '') {
          if (inJSON.tipoB != undefined && inJSON.tipoB === 0) {
              subqueryB = `WHERE p.CTA=${inJSON.CTAnombre}`
          }
          if (inJSON.tipoB != undefined && inJSON.tipoB === 1) {
            subqueryB = `WHERE p.contribuyente LIKE '%${inJSON.CTAnombre}%'`
          }
        }
        let sql = `SELECT * FROM padronu p ${subqueryB} ORDER by p.CTA ASC`
        
        con.query(sql, (err, result, fields) => {
          
          if (!err) {
            if (result.length > 0) {
              
              outJSON.contribuyenteu = result
              
             /* sql = `SELECT * FROM ubipredio${inJSON.tp} u `
              sql += `WHERE u.CTA=${result[0].CTA} ORDER by u.CTA DESC`
              //console.log(sql)
              con.query(sql, (err, result, fields) => {
                
                if (!err) {
                  if (result.length > 0) {
                    outJSON.ubicacion = result
                    sql = `SELECT * FROM ordenes${inJSON.tp} o `
                    sql += `WHERE o.CTA=${result[0].CTA} ORDER by o.idOrden DESC`
                    con.query(sql, (err, result, fields) => {
                      if (!err) {
                        if (result.length > 0) {
                          outJSON.orden = result[0]
                          sql = `SELECT * FROM predial${inJSON.tp} p `
                          sql += `WHERE p.idOrden=${result[0].idOrden} ORDER by p.idImpuesto ASC`
                          con.query(sql, (err, result, fields) => {
                              if (!err) {
                                if (result.length > 0) {
                                  outJSON.predial = result
                                }
                              }
                              setResponse()
                          });

                        }else{
                          //setResponse()
                        }
                      }
                      setResponse()
                    });
                  } else {
                    outJSON.ubicacion = [{
                      calle: '', numero: 0, colonia: '', cp: 0, municipio: '', localidad: '', basegrav: 0
                    }]
                    setResponse()
                  }
                } else {

                }
                
              });*/
            } else {
              outJSON.error.name = 'error01'
            }
          } else {

          }
          subqueryB = 'WHERE p.CTA < 50 AND u.CTA=p.CTA'
              //var subqueryN = ''
              if (inJSON.CTAnombre !== '') {
                if (inJSON.tipoB != undefined && inJSON.tipoB === 0) {
                    subqueryB = `WHERE p.CTA=${inJSON.CTAnombre} AND u.CTA=p.CTA`
                }
                if (inJSON.tipoB != undefined && inJSON.tipoB === 1) {
                  subqueryB = `WHERE p.contribuyente LIKE '%${inJSON.CTAnombre}%' AND u.CTA=p.CTA`
                }
              }
              sql = `SELECT * FROM padronu p, ubiprediou u ${subqueryB} ORDER by p.CTA ASC`
              con.query(sql, (err, result, fields) => {
                try{
                outJSON.ubiprediou = {};
                if(result){
                  result.forEach(e => {
                    outJSON.ubiprediou[`${e.CTA}`] = e
                  });
                }
              }catch(e){

              }
                padronR(subqueryB,con,res,inJSON,outJSON)
              });
          //padronR(subqueryB)
        });


      }
    });
    }catch(e){
      console.log(e)
    }

}

  const allPadrones = (req, res) => {
    try {
      const {CTAnombre} = req.body
      if (CTAnombre!==undefined) {

          padronU(req, res)

      } else {
          res.end()
      }
            
    } catch (e) {
      console.log(e)
    }
  }

  module.exports=allPadrones
