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

const _obtenerOF = (req, res) => {
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
        let subquery = '';
        let sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        switch(inJSON.op){
         case 1: 
          subquery = " AND o.CTA="+inJSON.CTA
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        
         break;
         case 2: 
          subquery = " AND pa.contribuyente LIKE '%"+inJSON.CTA+"%'"
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        
         break;
         case 3: 
          subquery = " AND f.idFolio="+inJSON.CTA+" AND o.idOrden=f.idOrden"
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u, folios f WHERE `
          sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        
         break;
        }
        //console.log(sql)
       // console.log(inJSON)
        con.query(sql, (err, result, fields) => {
          if (!err) {
            if(result.length>0){
              outJSON.ordenesu = result
              //setResponse()
              
            }else{
              outJSON.error.name='error01';
              outJSON.ordenesu = []
            } 
            sql = `SELECT * FROM ordenesr o, padronr pa, ubipredior u WHERE `
            sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') `
            sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          
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
                
              } else {
              }
              setResponse(res, outJSON,con)
            });
          }else{

          }
        });

      }
    });
    }catch(e){
      console.log(e)
    }
}

const obtenerOF = (req, res) => {
        try {
            const {fi} = req.body
                   if (fi) {

                        _obtenerOF(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=obtenerOF
