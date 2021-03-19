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
const round = (num, decimales = 2)=>{
  var signo = (num >= 0 ? 1 : -1);
  num = num * signo;
  if (decimales === 0) //con 0 decimales
    return signo * Math.round(num);
  // round(x * 10 ^ decimales)
  num = num.toString().split('e');
  num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
  // x * 10 ^ (-decimales)
  num = num.toString().split('e');
  return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}
const mes = (i) => {
  switch(i){
    case 0:
      return 'ENERO'
    case 1:
      return 'FEBRERO'
    case 2:
      return 'MARZO'
    case 3:
      return 'ABRIL'
    case 4:
      return 'MAYO'
    case 5:
      return 'JUNIO'
    case 6:
      return 'JULIO'
    case 7:
      return 'AGOSTO'
    case 8:
      return 'SEPTIEMBRE'
    case 9:
      return 'OCTUBRE'
    case 10:
      return 'NOVIEMBRE'
    default:
      return 'DICIEMBRE'
  }
}

const setNames = (res, inJSON, outJSON, con)=>{
    let sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
        sql += `pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        //console.log(sql)
        con.query(sql, (err, result, fields) => {
          //console.log(result)
          if(result){
            result.map((v,i)=>{
              //console.log(v)
              //console.log(i)
              const sql = "UPDATE ordenesu SET nombre='"+v.contribuyente+"' WHERE idOrden="+v.idOrden
              con.query(sql, (err, result, fields) => {
                
              });
            });

          }
        });

        let sql2 = `SELECT * FROM ordenesr o, padronr pa, ubipredior u WHERE `
        sql2 += `pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
       // console.log(sql2)
        con.query(sql2, (err, result, fields) => {
          //console.log(result)
          if(result){
            result.map((v,i)=>{
              //console.log(v)
              //console.log(i)
              const sql2 = "UPDATE ordenesr SET nombre='"+v.contribuyente+"' WHERE idOrden="+v.idOrden
              con.query(sql2, (err, result, fields) => {
                
              });
            });
            
          }
        });
}

const getOrdenU = (inJSON,outJSON,con,res) =>{
        let dateLast = '';
        let tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const {countPU,nextPU} = inJSON; 
        if(new Date(countPU)<new Date(nextPU)||(inJSON.op>0&&inJSON.op<4)){
        let subquery = '';
        let sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `(o.dateUp>='${countPU}' AND o.dateUp<'${nextPU}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`;
        /*  let sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          */
        switch(inJSON.op){
         case 1: 
          subquery = "o.CTA="+inJSON.CTA+``
          /*sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE ${subquery} AND `
          sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}') `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`*/
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE ${subquery}`
          sql += ` `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        
         break;
         case 2: 
          subquery = "o.nombre LIKE '%"+inJSON.CTA+`%'`
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u WHERE `
          sql += `${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          //setNames(res, inJSON, outJSON, con);
         break;
         case 3: 
          subquery = "f.idFolio="+inJSON.CTA+` AND o.idOrden=f.idOrden`
          sql = `SELECT * FROM ordenesu o, padronu pa, ubiprediou u, folios f WHERE `
          sql += `${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        
         break;
        }
        
        
        con.query(sql, (err, result, fields) => {
          outJSON.countPU = inJSON.countPU
          outJSON.nextPU = inJSON.nextPU
          if (!err) {
            if(result.length>0){
              
             // outJSON.ordenesu = result
              //setResponse()
               result.forEach(e => { 
                e.dateUp = new Date(e.dateUp)
                //e.dateUp = new Date(e.dateUp-tzoffset)
                outJSON.dataTable.push({
                  key: `${e.CTA}${outJSON.i}u`,
                  cta: e.CTA,
                  idOrden: e.idOrden,
                  NOMBRE: e.contribuyente,
                  tp: 'URBANO',
                  fecha: new Date(e.dateUp - tzoffset).toISOString().slice(0, -1),
                  total: e.total,
                  terreno: e.m1,
                  construccion: e.m2
                })
                outJSON.i++;
              });
              getOrdenR(inJSON,outJSON,con,res)   
            }else{
              outJSON.error.name='error01';
              outJSON.ordenesu = [];
              inJSON.countPU=new Date(inJSON.countPU)
              inJSON.countPU.setDate(inJSON.countPU.getDate()+7);
              inJSON.nextPU = new Date(inJSON.countPU);
              inJSON.nextPU.setDate(inJSON.nextPU.getDate()+7);
              inJSON.countPU.setHours(0,0,0,0)
              inJSON.nextPU.setHours(0,0,0,0)
    //this.countPU.setHours(0,0,0,0)
    //this.nextPU.setHours(0,0,0,0)
              inJSON.countPU=inJSON.countPU.toISOString();
              inJSON.nextPU=inJSON.nextPU.toISOString();
              if((new Date(inJSON.nextPU))<(new Date(inJSON.ff))){
                getOrdenU(inJSON,outJSON,con,res)
              } else if ((new Date(inJSON.nextPU))>(new Date(inJSON.ff))) {
           //     inJSON.countPU=new Date(inJSON.countPU)
         //       inJSON.countPU.setDate(inJSON.countPU.getDate()-8);
                inJSON.nextPU = new Date(inJSON.ff);
                inJSON.nextPU=inJSON.nextPU.toISOString();
             //   inJSON.countPU=inJSON.countPU.toISOString();
                if ((new Date(inJSON.countPU))<(new Date(inJSON.ff))) {
                  getOrdenU(inJSON,outJSON,con,res)
                }else{
                  getOrdenR(inJSON,outJSON,con,res)
                }
                  
              }else{
                getOrdenR(inJSON,outJSON,con,res)
              }   
            } 
           
          }else{

          }
        });
      }else{
        getOrdenR(inJSON,outJSON,con,res)
      }
      
}

const getOrdenR = (inJSON,outJSON,con,res) =>{
        let dateLast = '';
        let tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const {countPR,nextPR} = inJSON; 
        if(new Date(countPR)<new Date(nextPR)||(inJSON.op>0&&inJSON.op<4)){
        let subquery = '';
        let sql = `SELECT * FROM ordenesr o, padronr pa, ubipredior u WHERE `
          sql += `(o.dateUp>='${countPR}' AND o.dateUp<'${nextPR}') ${subquery} `
          sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
        switch(inJSON.op){
          case 1: 
            subquery = "o.CTA="+inJSON.CTA
            sql = `SELECT * FROM ordenesr o, padronr pa, ubipredior u WHERE ${subquery}`
            sql += ` `
            sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          
          break;
          case 2: 
            subquery = "o.nombre LIKE '%"+inJSON.CTA+`%'`
            sql = `SELECT * FROM ordenesr o, padronr pa, ubipredior u WHERE `
            sql += ` ${subquery} `
            sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          
          break;
          case 3: 
            subquery = "f.idFolio="+inJSON.CTA+` AND o.idOrden=f.idOrden`
            sql = `SELECT * FROM ordenesr o, padronr pa, ubipredior u, folios f WHERE `
            sql += ` ${subquery} `
            sql += `AND pa.CTA=o.CTA AND u.CTA=o.CTA ORDER by o.dateUp ASC`
          
          break;
          }
              
            con.query(sql, (err, result, fields) => {
              outJSON.countPR = inJSON.countPR
              outJSON.nextPR = inJSON.nextPR
              if (!err) {
                if (result.length > 0) {
                  
                 // outJSON.ordenesr = result
                  result.forEach(e => {
                    e.dateUp = new Date(e.dateUp)
                    //e.dateUp = new Date(e.dateUp - tzoffset)
                    outJSON.dataTable.push({
                      key: `${e.CTA}${outJSON.i}r`,
                      cta: e.CTA,
                      idOrden: e.idOrden,
                      NOMBRE: e.contribuyente,
                      tp: 'RUSTICO',
                      fecha: new Date(e.dateUp - tzoffset).toISOString().slice(0, -1),
                      total: e.total,
                      terreno: e.m1,
                      construccion: e.m2
                    });
                    
                    if (e.dateUp.getDate() < 10) {
                      e.dateUp = `0${e.dateUp.toLocaleDateString()}`
                    } else {
                      e.dateUp = e.dateUp.toLocaleDateString()
                    }
                    outJSON.i++
                    if ((dateLast !== '' && e.dateUp !== dateLast) || outJSON.i === result.length) {
                      if (outJSON.i === result.length){
                        outJSON.totalD += parseInt(e.total);
                      }
                      
                      if (outJSON.objects[`${dateLast}`]) {
                        outJSON.objects[`${dateLast}`] += outJSON.totalD
                      }else{
                        outJSON.objects[`${dateLast}`] = outJSON.totalD
                      }
                      outJSON.totalD = 0
                    }
                    dateLast = e.dateUp
                    outJSON.total += parseInt(e.total); 
                    outJSON.totalD += parseInt(e.total);
              });
                setResponse(res, outJSON,con)
                } else {
                  outJSON.error.name = 'error02';
                  outJSON.ordenesr = []
                  inJSON.countPR=new Date(inJSON.countPR)
                  inJSON.countPR.setDate(inJSON.countPR.getDate()+7);
                  inJSON.nextPR = new Date(inJSON.countPR);
                  inJSON.nextPR.setDate(inJSON.nextPR.getDate()+7);
                  inJSON.countPR.setHours(0,0,0,0)
                  inJSON.nextPR.setHours(0,0,0,0)
                  inJSON.countPR=inJSON.countPR.toISOString();
                  inJSON.nextPR=inJSON.nextPR.toISOString();
                  if((new Date(inJSON.nextPR))<(new Date(inJSON.ff))){
                    getOrdenR(inJSON,outJSON,con,res)
                  } else if ((new Date(inJSON.nextPR))>(new Date(inJSON.ff))) {
              //     inJSON.countPU=new Date(inJSON.countPU)
            //       inJSON.countPU.setDate(inJSON.countPU.getDate()-8);
                    inJSON.nextPR = new Date(inJSON.ff);
                    inJSON.nextPR=inJSON.nextPR.toISOString();
                //   inJSON.countPU=inJSON.countPU.toISOString();
                    if ((new Date(inJSON.countPR))<(new Date(inJSON.ff))) {
                      getOrdenR(inJSON,outJSON,con,res)
                    }else{
                      setResponse(res, outJSON,con)
                    }
                      
                  }else{
                    setResponse(res, outJSON,con)
                  }  
                }
          

              } else {
              }
              
            });
          }else{
            setResponse(res, outJSON,con)
          }

      
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
      outJSON.i=0;
      outJSON.total=0;
      outJSON.totalD=0;
      outJSON.high = 0;
      outJSON.porcentaje=0;
      outJSON.porcentaje2 = 0;
      outJSON.dataTable = []
      outJSON.objects = {}
      outJSON.labels = []
      outJSON.totales = []
      
      
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        
        getOrdenU(inJSON,outJSON,con,res)
      }
    });
    }catch(e){
      console.log(e)
    }
}

const getLength = (req, res) => {
  try{
    let outJSON = {}
    let inJSON = req.body
    let dateLabel = null;
    let dateLast = '';
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let con = mysql.createConnection({
        host: "localhost",
        user: process.env.NODE_MYSQL_USER,
        password: process.env.NODE_MYSQL_PASS,
        database: "dbcatastro"
    });
    con.connect((err) => {
      outJSON = {};
      outJSON.error = {};
      outJSON.i=0;
      outJSON.total=0;
      outJSON.totalD=0;
      outJSON.high = 0;
      outJSON.porcentaje=0;
      outJSON.porcentaje2 = 0;
      outJSON.objects = {}
      outJSON.labels = []
      outJSON.totales = []
      if (err) {
        console.log(`Err on con: ${err}`);
        
      } else {
        //let sql = `SELECT * FROM padronu pu WHERE pu.contribuyente NOT LIKE '%LIBRE%' AND pu.contribuyente!='' ORDER by pu.CTA DESC`
        let sql = `SELECT * FROM ordenesu o WHERE `
        let subquery = ``;
        sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}')`
        sql += ` ORDER by o.dateUp ASC`;

        switch(inJSON.op){
          case 1: 
            subquery = "o.CTA="+inJSON.CTA
            sql = `SELECT * FROM ordenesu o WHERE ${subquery}`
            sql += ` `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          case 2: 
            subquery = "o.nombre LIKE '%"+inJSON.CTA+`%'`
            sql = `SELECT * FROM ordenesu o WHERE `
            sql += ` ${subquery} `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          case 3: 
            subquery = "f.idFolio="+inJSON.CTA+` AND o.idOrden=f.idOrden`
            sql = `SELECT * FROM ordenesu o, folios f WHERE `
            sql += ` ${subquery} `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          }
          
        con.query(sql, (err, result, fields) => {
          if(result&&result.length>0){
            outJSON.lengthU = result.length
          //  outJSON.countPU = result[0].dateUp
         //   outJSON.nextPU = result[result.length<50?(result.length-1):50].dateUp
           // outJSON.ordenesu = result

            result.forEach(e => { 
                  e.dateUp = new Date(e.dateUp)
                  
                  outJSON.i++
                  if (e.dateUp.getDate() < 10) {
                    e.dateUp = `${e.dateUp.toLocaleDateString()}`
                  } else {
                    e.dateUp = e.dateUp.toLocaleDateString()
                  }

                  if ((dateLast!==''&&e.dateUp !== dateLast) || outJSON.i === result.length) {
                    if (outJSON.i === result.length) {
                      outJSON.totalD += parseInt(e.total);
                    }
                    outJSON.objects[`${dateLast}`] = outJSON.totalD
                    outJSON.totalD=0
                  }
                  dateLast = e.dateUp
                  outJSON.total += parseInt(e.total); 
                  outJSON.totalD += parseInt(e.total);
            });
          }  
      //      console.log(result)
          
            sql = `SELECT * FROM ordenesr o WHERE `
            sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<='${inJSON.ff}')`
            sql += ` ORDER by o.dateUp ASC`;
            switch(inJSON.op){
          case 1: 
            subquery = "o.CTA="+inJSON.CTA
            sql = `SELECT * FROM ordenesr o WHERE ${subquery}`
            sql += ` `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          case 2: 
            subquery = "o.nombre LIKE '%"+inJSON.CTA+`%'`
            sql = `SELECT * FROM ordenesr o WHERE `
            sql += ` ${subquery} `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          case 3: 
            subquery = "f.idFolio="+inJSON.CTA+` AND o.idOrden=f.idOrden`
            sql = `SELECT * FROM ordenesr o, folios f WHERE `
            sql += ` ${subquery} `
            sql += `ORDER by o.dateUp ASC`
          
          break;
          }
            outJSON.i=0
            outJSON.totalD=0
            dateLast = ''
            con.query(sql, (err, result, fields) => {
              if(result&&result.length>0){
                outJSON.lengthR = result.length;
  //              outJSON.countPR = result[0].dateUp;
//                outJSON.nextPR = result[result.length<50?(result.length-1):50].dateUp
                result.forEach(e => {
                    e.dateUp = new Date(e.dateUp)
                    
                    if (e.dateUp.getDate() < 10) {
                      e.dateUp = `${e.dateUp.toLocaleDateString()}`
                    } else {
                      e.dateUp = e.dateUp.toLocaleDateString()
                    }
                    outJSON.i++
                    if ((dateLast !== '' && e.dateUp !== dateLast) || outJSON.i === result.length) {
                      if (outJSON.i === result.length){
                        outJSON.totalD += parseInt(e.total);
                      }
                      
                      if (outJSON.objects[`${dateLast}`]) {
                        outJSON.objects[`${dateLast}`] += outJSON.totalD
                      }else{
                        outJSON.objects[`${dateLast}`] = outJSON.totalD
                      }
                      outJSON.totalD = 0
                    }
                    dateLast = e.dateUp
                    outJSON.total += parseInt(e.total); 
                    outJSON.totalD += parseInt(e.total);
              });
              }
              
              const objects = Object.entries(outJSON.objects)//.sort();
             // console.log(objects)
              
              if (objects.length<16){
                for (let [key, value] of objects) {
                  outJSON.labels.push(key)
                  outJSON.totales.push(value)
                  if(value>outJSON.high){
                    outJSON.high=value
                  }
                  outJSON.porcentaje++
                }
              }else if(objects.length<30&&objects.length>15){
                let semC = 0
                dateLabel = new Date(inJSON.fi)
                dateLabel.setDate(dateLabel.getDate() + 7)
                outJSON.totalD = 0
                outJSON.i=0
                
                for (let [key, value] of objects) {
                  const keyDate = new Date(key)
                  //const arrKey = key.split("/")
                  //keyDate.setFullYear(arrKey[2], arrKey[1]-1, arrKey[0])
                 // console.log(keyDate);
                  outJSON.i++
                  if (keyDate > dateLabel || outJSON.i === objects.length) {
                    if (outJSON.i === objects.length){
                        outJSON.totalD += value
                        if (outJSON.totalD > outJSON.high) {
                          outJSON.high = outJSON.totalD
                        }
                       }
                      semC++
                      outJSON.labels.push(`SEMANA ${semC}`)
                      outJSON.totales.push(outJSON.totalD)
                      outJSON.totalD=0
                      dateLabel = new Date(keyDate)
                      dateLabel.setDate(dateLabel.getDate() + 7)
                   

                    outJSON.porcentaje++
                  }
                  outJSON.totalD+=value
                  if (outJSON.totalD > outJSON.high) {
                    outJSON.high = outJSON.totalD
                  }
                  
                }
                //console.log(data)
              } else {
                dateLabel = new Date(inJSON.fi)
                dateLabel.setMonth(dateLabel.getMonth() + 1)
                outJSON.totalD = 0
                outJSON.i = 0
               // console.log(dateLabel)
                for (let [key, value] of objects) {
                  const keyDate = new Date(key)
                 // const arrKey = key.split("/")
                 // keyDate.setFullYear(arrKey[2], arrKey[1] - 1, arrKey[0])
                  //console.log(key);
              //    console.log(keyDate);
                  outJSON.i++
                  if (keyDate > dateLabel || outJSON.i === objects.length) {
                    if (outJSON.i === objects.length) {
                      outJSON.totalD += value
                      if (outJSON.totalD > outJSON.high) {
                        outJSON.high = outJSON.totalD
                      }
                    }
                    outJSON.labels.push(mes(dateLabel.getMonth()-1))
                    outJSON.totales.push(outJSON.totalD)
                    outJSON.totalD = 0
                    dateLabel = new Date(keyDate)
                    dateLabel.setMonth(dateLabel.getMonth() + 1)
                    

                    outJSON.porcentaje++
                  }
                  outJSON.totalD += value
                  if (outJSON.totalD > outJSON.high) {
                    outJSON.high = outJSON.totalD
                  }

                }
                
              }
              outJSON.lengthUR = outJSON.lengthU + outJSON.lengthR;
              const media = outJSON.total/outJSON.lengthUR
              outJSON.porcentaje2 = outJSON.total / outJSON.porcentaje
              outJSON.porcentaje2 = (outJSON.porcentaje2 / outJSON.total) * 100
              outJSON.porcentaje = ((media) / outJSON.total)*100
              if (isNaN(outJSON.porcentaje)){
                outJSON.porcentaje = 0
                outJSON.totales = [1]
                
              }else{
                const arrPor = outJSON.porcentaje.toString().split(".")
                outJSON.porcentaje = round(outJSON.porcentaje, 4)
              
              }
              
              setResponse(res, outJSON, con);
              
            });
          
        });

      }
    });
  }catch(e){
    console.log(e);
  }
}

const obtenerOF = (req, res) => {
try {
    const {fi,s} = req.body
    
    switch(s){
      case 1: 
        getLength(req, res);
      break;
      case 2: 
         break;
      default:
        
        if (fi) {
          
            _obtenerOF(req, res)

        } else {
            res.end()
        }
            break;
    }
            
    
} catch (e) {
    console.log(e)
}
}
 
module.exports=obtenerOF
