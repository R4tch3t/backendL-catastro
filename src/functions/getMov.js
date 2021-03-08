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

getLength = (inJSON, outJSON,res, con) => {
  let sql = `SELECT * FROM history ORDER BY idHistory DESC`;
  con.query(sql, (err, result, fields) => {
    outJSON.lHistory = result[0].idHistory;
    setResponse(res,outJSON,con);
  });
}

const getData = (inJSON, outJSON, res, con) => {
  let {count} = inJSON;
  let nextPage = count + 50; 
  outJSON.count = nextPage; 
  let sql = `SELECT * FROM history h, datahistory dh, movs m WHERE h.idHistory>${count} AND h.idHistory<=${nextPage} AND dh.idDataHistory=h.idDataHistory AND m.idMov=h.idMov ORDER BY h.idHistory ASC`;
  con.query(sql, (err, result, fields) => {
    outJSON.history = result;
    setResponse(res,outJSON,con);
  });
}

const _getMov = (req, res) => {
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
          //getDataHistory
          
          /*if(inJSON.changeN){
            let sql = `UPDATE padron${inJSON.tp} SET contribuyente='${inJSON.contribuyente}' WHERE CTA=${inJSON.CTA}`;
            con.query(sql, (err, result, fields) => {
              checkUbi(inJSON, outJSON, res, con);
            });
          }else{*/
            console.log(new Date())
            getData(inJSON, outJSON, res, con);
          //}
          //console.log("Connected!");

        }
      });
    } catch (e) {
      console.log(e)
    }
}

const getMov = (req, res) => {
        try {
            const {op} = req.body
                   if (op) {
                    switch(op){
                     case 1:
                       _getMov(req, res)
                      break;
                     case 2:
                       getLength()
                      break;
                    }

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=getMov;
