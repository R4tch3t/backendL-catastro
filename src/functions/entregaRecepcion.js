const ExcelJS = require('exceljs');
const mysql = require('mysql');
let fs = require('fs');

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

const buildPadron = (inJSON, outJSON, con, res)=>{
        outJSON = {};
        outJSON.error = {};
        let resultAux = []

        let sql = `SELECT * FROM ordenesu o WHERE `
            //sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<'${inJSON.ff}') `
        sql += `o.total>0 AND o.nombre NOT LIKE '%libre%' AND o.nombre!='' ORDER by o.CTA DESC, o.dateUp ASC`;
            
        con.query(sql, async (err, result, fields) => {
            if (!err) {
                console.log('NO ERROR '+err);
                let rowPerPage = 18
                let nPage = 1;
                let tPage = 0;
                let lastCTA = 0;
                let countResult = 0;
                
                
                if(result){
                    let totalP = 0
                    while(result.length>0){
                        const r = result.pop()
                        if(lastCTA!==r.CTA){
                            
                            lastCTA=r.CTA;
                            const n = resultAux.length;
                            const CTA = r.CTA;
                            const nombre = r.nombre;
                            const td = 'Digital';
                            const bg = r.bg;
                            const tp = 'URBANO';
                            const ia = r.total;
                            const d = new Date(r.dateUp);
                            const y = d.getFullYear()
                            const obs = r.obs
                            if(n>0){
                                //resultAux[n-1].total = r.total    
                                resultAux[n-1].total = totalP    
                            }
                            resultAux.push({n: (n+1), CTA, nombre, td, bg, tp, ia, y, obs})
                            totalP = r.total
                        }else{
                            totalP += r.total;
                        }
                    }
                   // result=resultAux
                   // tPage=parseInt(resultAux.length/rowPerPage)
                   //tPage=100
                   lastCTA=0;
                }

                sql = `SELECT * FROM ordenesr o WHERE `
                //sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<'${inJSON.ff}') `
                sql += `o.total>0 AND o.nombre NOT LIKE '%libre%' AND o.nombre!='' ORDER by o.CTA DESC, o.dateUp ASC`;
                console.log(sql)
                con.query(sql, async (err, result, fields) => {
                
                if(result){
                    let totalP = 0
                  //  resultAux=[]
                    while(result.length>0){
                        const r = result.pop()
                        if(lastCTA!==r.CTA){
                            
                            lastCTA=r.CTA;
                            const n = resultAux.length;
                            const CTA = r.CTA;
                            const nombre = r.nombre;
                            const td = 'Digital';
                            const bg = r.bg;
                            const tp = 'RÚSTICO';
                            const ia = r.total;
                            const d = new Date(r.dateUp);
                            const y = d.getFullYear()
                            const obs = r.obs
                            if(n>0){
                                //resultAux[n-1].total = r.total    
                                resultAux[n-1].total = totalP    
                            }
                            resultAux.push({n: (n+1), CTA, nombre, td, bg, tp, ia, y, obs})
                            totalP = r.total
                        }else{
                            totalP += r.total;
                        }
                    }
                   // result=resultAux
                    tPage=parseInt(resultAux.length/rowPerPage)
                   //tPage=50
                }

                console.log('NO ERROR '+tPage);
                
                var subPath = "/var/padron"
                if (!fs.existsSync(subPath)) {
                    fs.mkdirSync(subPath, { recursive: true });
                }
                const filename = "Padron_EntregaRecepcion_2021.xlsx"
                subPath+="/"+filename
                const workbook = new ExcelJS.Workbook();
                //const workbook = createAndFillWorkbook();
                workbook.creator = 'CATASTRO MUNICIPAL DE CHILAPA DE ÁLVAREZ';
                workbook.lastModifiedBy = 'Sistema de pago predial';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.lastPrinted = new Date();
                workbook.properties.date1904 = true;
                workbook.calcProperties.fullCalcOnLoad = true;
                workbook.views = [
                {
                    x: 0, y: 0, width: 10000, height: 20000,
                    firstSheet: 0, activeTab: 1, visibility: 'visible'
                }
                ]
                const worksheet =  workbook.addWorksheet('PADRÓN', {
                    //  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"},
                    pageSetup:{paperSize: undefined, orientation:'landscape'}
                });
                worksheet.pageSetup.margins = {
                    left: 0.2, right: 0.2,
                    top: 0.3, bottom: 0.3,
                    header: 0.3, footer: 0.3
                }
                //worksheet.headerFooter.oddFooter = "Page &P of &N";
                const fillBG = {
                    type: 'pattern',
                    pattern:'solid',
                    bgColor:{argb:'F2F2F2'}
                } 
                let rowCount = 0;
                
                

                //while
                
            while(nPage<=tPage){

                let rowWhile=7
                rowCount+=rowWhile;

                const imageId1 = workbook.addImage({
                    filename: './src/functions/chilapa.jpg',
                    extension: 'jpeg',
                });

                worksheet.addImage(imageId1,('A'+(rowCount-6)+":O"+(rowCount)))

                /*   const imageId2 = workbook.addImage({
                    buffer: fs.readFileSync('./src/functions/chilapa.jpg'),
                    extension: 'jpg',
                },{
            tl: { col: 0, row: 0 },
            ext: { width: 500, height: 200 }
            });*/

                /*workbook.addImage({
                    buffer: fs.readFileSync('./src/functions/chilapa.jpg'),
                    extension: 'jpg',
                },('A'+(rowCount-6)+":O"+(rowCount)))*/
                
                let cell = worksheet.getCell('A'+rowCount);
                cell.font = {
                    // name: 'Comic Sans MS',
                    // family: 4,
                    size: 14,
                    //  underline: true,
                    bold: true
                }
                cell.value='Ayuntamiento de Chilapa de Álvarez, Guerrero'
                
                rowWhile+=2
                rowCount+=2

                cell = worksheet.getCell('A'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    left: {style:'thick'}
                }};
                // cell.fill=fillBG
                cell = worksheet.getCell('O'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};
                //cell.fill=fillBG
                cell = worksheet.getCell('A'+(rowCount+5));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    left: {style:'thick'}
                }};
                //cell.fill=fillBG
                cell = worksheet.getCell('O'+(rowCount+5));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};
                //cell.fill=fillBG
                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:O${(rowCount+5)}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {
                            fill: fillBG
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `B${rowCount}:N${rowCount}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount+1}:A${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            left: {style:'thick'},                    
                        }},
                    }
                    ]
                });
                worksheet.addConditionalFormatting({
                    ref: `B${rowCount+5}:N${rowCount+5}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            bottom: {style:'thick'},
                            
                        }},
                    }
                    ]
                });
                worksheet.addConditionalFormatting({
                    ref: `O${rowCount+1}:O${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            right: {style:'thick'},
                            
                        }},
                    }
                    ]
                });
                cell = worksheet.getCell(`A${rowCount}`);
                //cell.value="Anexo ";
                let txtAux = 'del acta de entrega-recepción de la administración pública municipal 2018-2021 a la 2021-2024.'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'Anexo '},
                        {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': '55 '},
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`A${rowCount+1}`);
                //cell.value="Anexo ";
                txtAux = 'LOML_42_FIX'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'Clave: '},
                        {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`D${rowCount+2}`);
                //cell.value="Anexo ";
                txtAux = 'PADRÓN DE CONTRIBUYENTES DEL IMPUESTO PREDIAL'
                cell.value = {
                    'richText': [
                        {'font': {'bold': true,'size': 14,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`F${rowCount+3}`);
                //cell.value="Anexo ";
                txtAux = 'al 29 de septiembre de 2021'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`A${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = 'Unidad administrativa:'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`E${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = 'CATASTRO'
                cell.value = {
                    'richText': [
                        {'font': {'bold': true, 'italic': true, 'size': 14,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`N${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = `Página ${nPage} de ${tPage}`
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };
                
                rowCount+=7
                rowWhile+=7;
                //build DataTable

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:O${(rowCount+4)}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {
                            fill: fillBG
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('C'+rowCount); 
                // cell.value = "N°"
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('B'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    // right: {style:'thick'}
                }};

                /*worksheet.addConditionalFormatting({
                    ref: `B${rowCount}:N${rowCount}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount+1}:A${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {left: {style:'thick'},right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('A'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    left: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('A'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    left: {style:'thick'},
                    right: {style:'thick'}
                }};
                
                worksheet.addConditionalFormatting({
                    ref: `C${rowCount+1}:C${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('C'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('B'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};
                
                /*worksheet.addConditionalFormatting({
                    ref: `B${rowCount+4}:N${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {bottom: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `O${rowCount+1}:O${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('O'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('O'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};
                
                cell = worksheet.getCell('C'+rowCount); 
                // cell.value = "N°"
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('D'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                }};

                cell = worksheet.getCell('E'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('D'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};

                cell = worksheet.getCell('E'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('F'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('F'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('G'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('G'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('H'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                }};

                cell = worksheet.getCell('I'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('H'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};

                cell = worksheet.getCell('I'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('J'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('J'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('K'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('K'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('L'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'}
                }};

                cell = worksheet.getCell('L'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'}
                }};

                cell = worksheet.getCell('M'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('M'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('N'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                }};

                cell = worksheet.getCell('N'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};

                worksheet.addConditionalFormatting({
                    ref: `E${rowCount+1}:E${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `F${rowCount+1}:F${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `G${rowCount+1}:G${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `I${rowCount+1}:I${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `J${rowCount+1}:J${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `K${rowCount+1}:K${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `M${rowCount+1}:M${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                
                
                cell = worksheet.getCell('A'+(rowCount+2)); 
                cell.font={bold: true}
                cell.value = "N°"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                
                worksheet.mergeCells(`B${rowCount+1}:C${rowCount+1}`);
                cell = worksheet.getCell('B'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Clave"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`B${rowCount+2}:C${rowCount+2}`);
                cell = worksheet.getCell('B'+(rowCount+2));
                cell.font={bold: true}
                cell.value="catastral"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`D${rowCount+1}:E${rowCount+1}`);
                cell = worksheet.getCell('D'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Nombre del"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`D${rowCount+2}:E${rowCount+2}`);
                cell = worksheet.getCell('D'+(rowCount+2));
                cell.font={bold: true}
                cell.value="contribuyente"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                //  worksheet.mergeCells(`D${rowCount+1}:E${rowCount+1}`);
                cell = worksheet.getCell('F'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Impresa o"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('F'+(rowCount+2));
                cell.font={bold: true}
                cell.value="dígital"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('G'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Base"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('G'+(rowCount+2));
                cell.font={bold: true}
                cell.value="gravable"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`H${rowCount+1}:I${rowCount+1}`);
                cell = worksheet.getCell('H'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Tipo de"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`H${rowCount+2}:I${rowCount+2}`);
                cell = worksheet.getCell('H'+(rowCount+2));
                cell.font={bold: true}
                cell.value="predio"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('J'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Impuesto"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('J'+(rowCount+2));
                cell.font={bold: true}
                cell.value="anual"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('K'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Saldo por"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('K'+(rowCount+2));
                cell.font={bold: true}
                cell.value="recaudar"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`L${rowCount+1}:M${rowCount+1}`);
                cell = worksheet.getCell('L'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Último año"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                
                worksheet.mergeCells(`L${rowCount+2}:M${rowCount+2}`);
                cell = worksheet.getCell('L'+(rowCount+2));
                cell.font={bold: true}
                cell.value="pagado"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`N${rowCount+2}:O${rowCount+2}`);
                cell = worksheet.getCell('N'+(rowCount+2));
                cell.font={bold: true}
                cell.value="Observaciones"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                rowCount+=5
                rowWhile+=5

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:A${rowCount+17}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}},
                        }
                    },
                    /*{
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {alignment: { vertical: 'middle', horizontal: 'center' }
                        }
                    }*/
                    ]
                });

                let mergeC = rowCount
                let fileT = 0; 
                //last page
                if(nPage===tPage){
                    //mergeC-=5
                }
                
                while(fileT<18&&countResult<resultAux.length){
                    const r = resultAux[countResult];
                    cell = worksheet.getCell('A'+(mergeC));
                    cell.value=r.n;
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }

                    worksheet.mergeCells(`B${mergeC}:C${mergeC}`);
                    cell = worksheet.getCell('B'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.CTA;

                    worksheet.mergeCells(`D${mergeC}:E${mergeC}`);
                    cell = worksheet.getCell('D'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}  
                    cell.value=r.nombre;

                    cell = worksheet.getCell('F'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.td;

                    cell = worksheet.getCell('G'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.value=r.bg;

                    worksheet.mergeCells(`H${mergeC}:I${mergeC}`);

                    cell = worksheet.getCell('H'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.tp;

                    cell = worksheet.getCell('J'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.value=r.ia;

                    cell = worksheet.getCell('K'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.value=r.total;

                    worksheet.mergeCells(`L${mergeC}:M${mergeC}`);

                    cell = worksheet.getCell('L'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.y;

                    worksheet.mergeCells(`N${mergeC}:O${mergeC}`);

                    cell = worksheet.getCell('N'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.value=r.obs;

                    mergeC++
                    fileT++
                    countResult++;
                }

                console.log('NO ERROR padron '+nPage);
                
                rowCount += 17
                nPage++
                }   
            
                console.log('Finish '+subPath);

                await workbook.xlsx.writeFile(subPath);
                outJSON={filename}
                //setResponse(res,outJSON,con);
                buildRezago(inJSON, outJSON, con, res);
            });
         }
    });
}

const buildRezago = (inJSON, outJSON, con, res)=>{
        outJSON = {};
        outJSON.error = {};
        let resultAux = []
        let n = 1;
        //resDate = rezDate.toISOString()
        let sql = `SELECT * FROM ordenesu o WHERE `
            //sql += `(o.dateUp>='${inJSON.fi}' AND o.dateUp<'${inJSON.ff}') `
        sql += `o.total>0 AND o.nombre NOT LIKE '%libre%' AND o.nombre!='' `;
        //sql += `AND o.dateUp<'${rezDate.toISOString()}' ORDER by o.CTA DESC, o.dateUp DESC`
        sql += `ORDER by o.CTA ASC, o.dateUp ASC`
        console.log(sql)

        con.query(sql, async (err, result, fields) => {
            if (!err) {
                console.log('NO ERROR '+err);
                let rowPerPage = 18
                let nPage = 1;
                let tPage = 0;
                let lastCTA = 0;
                let countResult = 0;
               // let whiteList = await noAdeudos(con);
                //console.log("whiteList");
                //console.log(whiteList);

                if(result){
                    let totalP = 0
                    let arrU = []
                    while(result.length>0){
                        const r = result.pop()
                        if(lastCTA!==r.CTA){
                            
                            lastCTA=r.CTA;
                            
                            const CTA = r.CTA;
                            const nombre = r.nombre;
                            const td = 'Digital';
                            const bg = r.bg;
                            const tp = 'URBANO';
                            const ia = r.total;
                            const localidad = 'CHILAPA DE ÁLVAREZ';
                            const lastDate = new Date(r.dateUp);
                            const y = lastDate.getFullYear()
                            const obs = r.obs
                            if(arrU.length>1){
                                arrU[arrU.length-1].total = totalP    
                            }

                            if(parseInt(y)<2021){
                                arrU.push({n, localidad, CTA, nombre, td, bg, tp, ia, y, lastDate, obs});
                                n++;
                            }

                            totalP = r.total
                        }else{
                            totalP += r.total;
                        }
                    }
                    arrU=arrU.reverse()
                    resultAux=resultAux.concat(arrU)
                   // result=resultAux
                   // tPage=parseInt(resultAux.length/rowPerPage)
                   //tPage=100
                   lastCTA=0;
                }

                sql = `SELECT * FROM ordenesr o, ubipredior ur WHERE `
                sql += `ur.CTA=o.CTA AND o.total>0 AND o.nombre NOT LIKE '%libre%' AND o.nombre!='' `;
                sql += `ORDER by o.CTA ASC, o.dateUp ASC`
            
                con.query(sql, async (err, result, fields) => {
                
                if(result){
                    let totalP = 0
                    let arrR = [];
                    while(result.length>0){
                        const r = result.pop()
                        if(lastCTA!==r.CTA){
                            
                            lastCTA=r.CTA;
                            //const n = resultAux.length;
                            const CTA = r.CTA;
                            const nombre = r.nombre;
                            const td = 'Digital';
                            const bg = r.bg;
                            const tp = 'RÚSTICO';
                            const ia = r.total;
                            const localidad = r.localidad;
                            const lastDate = new Date(r.dateUp);
                            const y = lastDate.getFullYear()
                           // const y = d.getFullYear()
                            const obs = r.obs
                            if(arrR.length>0){
                               // resultAux[n-1].total = r.total    
                               arrR[arrR.length-1].total = totalP    
                            }
                            
                            if(parseInt(y)<2021){
                                arrR.push({n, CTA, nombre, lastDate, localidad, td, bg, tp, ia, y, obs})
                                n++;
                            }

                            totalP = r.total
                        }else{
                            totalP += r.total;
                        }
                    }
                    arrR=arrR.reverse()
                    resultAux=resultAux.concat(arrR)
                    //resultAux=resultAux.reverse()
                   // result=resultAux
                    tPage=parseInt(resultAux.length/rowPerPage)
                   //tPage=50
                }

                console.log('NO ERROR '+tPage);
                
                var subPath = "/var/padron"
                if (!fs.existsSync(subPath)) {
                    fs.mkdirSync(subPath, { recursive: true });
                }
                const filename = "Rezago_EntregaRecepcion_2021.xlsx"
                subPath+="/"+filename
                const workbook = new ExcelJS.Workbook();
                //const workbook = createAndFillWorkbook();
                workbook.creator = 'CATASTRO MUNICIPAL DE CHILAPA DE ÁLVAREZ';
                workbook.lastModifiedBy = 'Sistema de pago predial';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.lastPrinted = new Date();
                workbook.properties.date1904 = true;
                workbook.calcProperties.fullCalcOnLoad = true;
                workbook.views = [
                {
                    x: 0, y: 0, width: 10000, height: 20000,
                    firstSheet: 0, activeTab: 1, visibility: 'visible'
                }
                ]
                const worksheet =  workbook.addWorksheet('REZAGO', {
                    //  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"},
                    pageSetup:{paperSize: undefined, orientation:'landscape'}
                });
                worksheet.pageSetup.margins = {
                    left: 0.2, right: 0.2,
                    top: 0.3, bottom: 0.3,
                    header: 0.3, footer: 0.3
                }
                //worksheet.headerFooter.oddFooter = "Page &P of &N";
                const fillBG = {
                    type: 'pattern',
                    pattern:'solid',
                    bgColor:{argb:'F2F2F2'}
                } 
                let rowCount = 0;
                
                

                //while
                
            while(nPage<=tPage){

                let rowWhile=7
                rowCount+=rowWhile;

                const imageId1 = workbook.addImage({
                    filename: './src/functions/chilapa.jpg',
                    extension: 'jpeg',
                });

                worksheet.addImage(imageId1,('A'+(rowCount-6)+":O"+(rowCount)))

                /*   const imageId2 = workbook.addImage({
                    buffer: fs.readFileSync('./src/functions/chilapa.jpg'),
                    extension: 'jpg',
                },{
            tl: { col: 0, row: 0 },
            ext: { width: 500, height: 200 }
            });*/

                /*workbook.addImage({
                    buffer: fs.readFileSync('./src/functions/chilapa.jpg'),
                    extension: 'jpg',
                },('A'+(rowCount-6)+":O"+(rowCount)))*/
                
                let cell = worksheet.getCell('A'+rowCount);
                cell.font = {
                    // name: 'Comic Sans MS',
                    // family: 4,
                    size: 14,
                    //  underline: true,
                    bold: true
                }
                cell.value='Ayuntamiento de Chilapa de Álvarez, Guerrero'
                
                rowWhile+=2
                rowCount+=2

                cell = worksheet.getCell('A'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    left: {style:'thick'}
                }};
                // cell.fill=fillBG
                cell = worksheet.getCell('O'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};
                //cell.fill=fillBG
                cell = worksheet.getCell('A'+(rowCount+5));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    left: {style:'thick'}
                }};
                //cell.fill=fillBG
                cell = worksheet.getCell('O'+(rowCount+5));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};
                //cell.fill=fillBG
                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:O${(rowCount+5)}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {
                            fill: fillBG
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `B${rowCount}:N${rowCount}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount+1}:A${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            left: {style:'thick'},                    
                        }},
                    }
                    ]
                });
                worksheet.addConditionalFormatting({
                    ref: `B${rowCount+5}:N${rowCount+5}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            bottom: {style:'thick'},
                            
                        }},
                    }
                    ]
                });
                worksheet.addConditionalFormatting({
                    ref: `O${rowCount+1}:O${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {
                            right: {style:'thick'},
                            
                        }},
                    }
                    ]
                });
                cell = worksheet.getCell(`A${rowCount}`);
                //cell.value="Anexo ";
                let txtAux = 'del acta de entrega-recepción de la administración pública municipal 2018-2021 a la 2021-2024.'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'Anexo '},
                        {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': '62 '},
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`A${rowCount+1}`);
                //cell.value="Anexo ";
                txtAux = 'LOML-E4'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'Clave: '},
                        {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`D${rowCount+2}`);
                //cell.value="Anexo ";
                txtAux = 'RELACIÓN DE CONTRIBUYENTES CON REZAGO EM EL PAGO DE IMPUESTO PREDIAL'
                cell.value = {
                    'richText': [
                        {'font': {'bold': true,'size': 14,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`F${rowCount+3}`);
                //cell.value="Anexo ";
                txtAux = 'al 29 de septiembre de 2021'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`A${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = 'Unidad administrativa:'
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`E${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = 'CATASTRO'
                cell.value = {
                    'richText': [
                        {'font': {'bold': true, 'italic': true, 'size': 14,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };

                cell = worksheet.getCell(`N${rowCount+5}`);
                //cell.value="Anexo ";
                txtAux = `Página ${nPage} de ${tPage}`
                cell.value = {
                    'richText': [
                        {'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                        //{'font': {'size': 12,'name': 'Calibri','family': 2,'scheme': 'minor'},'text': txtAux},
                    ]
                };
                
                rowCount+=7
                rowWhile+=7;
                //build DataTable

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:O${(rowCount+4)}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {
                            fill: fillBG
                        }
                    }
                    ]
                });

                /*cell = worksheet.getCell('C'+rowCount); 
                // cell.value = "N°"
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};*/

                cell = worksheet.getCell('B'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    // right: {style:'thick'}
                }};

                cell = worksheet.getCell('C'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    // right: {style:'thick'}
                }};

                /*worksheet.addConditionalFormatting({
                    ref: `B${rowCount}:N${rowCount}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount+1}:A${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {left: {style:'thick'},right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('A'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    left: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('A'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    left: {style:'thick'},
                    right: {style:'thick'}
                }};
                
                worksheet.addConditionalFormatting({
                    ref: `D${rowCount+1}:D${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('D'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('B'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};
                
                /*worksheet.addConditionalFormatting({
                    ref: `B${rowCount+4}:N${rowCount+4}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {bottom: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `O${rowCount+1}:O${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                cell = worksheet.getCell('O'+rowCount);
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('O'+(rowCount+4));
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};
                
                cell = worksheet.getCell('D'+rowCount); 
                // cell.value = "N°"
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                /*cell = worksheet.getCell('E'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                }};*/

                cell = worksheet.getCell('E'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                   // right: {style:'thick'}
                }};

                cell = worksheet.getCell('D'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                /*cell = worksheet.getCell('E'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};*/

                cell = worksheet.getCell('F'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('F'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('G'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                 //   right: {style:'thick'}
                }};

                cell = worksheet.getCell('H'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('H'+rowCount); 
                cell.style = {border: {
                    right: {style:'thick'},
                    top: {style:'thick'},
                }};

                cell = worksheet.getCell('I'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('I'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('J'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                 //   right: {style:'thick'}
                }};

                cell = worksheet.getCell('J'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                   // right: {style:'thick'}
                }};

                cell = worksheet.getCell('K'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('K'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('L'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'}
                }};

                cell = worksheet.getCell('L'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'}
                }};

                cell = worksheet.getCell('M'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('M'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                    right: {style:'thick'}
                }};

                cell = worksheet.getCell('N'+rowCount); 
                cell.style = {border: {
                    top: {style:'thick'},
                }};

                cell = worksheet.getCell('N'+(rowCount+4)); 
                cell.style = {border: {
                    bottom: {style:'thick'},
                }};

                /*worksheet.addConditionalFormatting({
                    ref: `E${rowCount+1}:E${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `F${rowCount+1}:F${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `H${rowCount+1}:H${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `I${rowCount+1}:I${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                /*worksheet.addConditionalFormatting({
                    ref: `J${rowCount+1}:J${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });*/

                worksheet.addConditionalFormatting({
                    ref: `K${rowCount+1}:K${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });

                worksheet.addConditionalFormatting({
                    ref: `M${rowCount+1}:M${rowCount+3}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {right: {style:'thick'}},
                        }
                    }
                    ]
                });
                
                
                cell = worksheet.getCell('A'+(rowCount+2)); 
                cell.font={bold: true}
                cell.value = "N°"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                
                worksheet.mergeCells(`B${rowCount+2}:D${rowCount+2}`);
                cell = worksheet.getCell('B'+(rowCount+2));
                cell.font={bold: true}
                cell.value="Nombre del contribuyente"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                /*worksheet.mergeCells(`B${rowCount+2}:D${rowCount+2}`);
                cell = worksheet.getCell('B'+(rowCount+2));
                cell.font={bold: true}
                cell.value="catastral"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };*/

                worksheet.mergeCells(`E${rowCount+2}:F${rowCount+2}`);
                cell = worksheet.getCell('E'+(rowCount+2));
                cell.font={bold: true}
                cell.value="Localidad"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`G${rowCount+1}:H${rowCount+1}`);
                cell = worksheet.getCell('G'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Denominación de"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`G${rowCount+2}:H${rowCount+2}`);
                cell = worksheet.getCell('G'+(rowCount+2));
                cell.font={bold: true}
                cell.value="la contribución"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`G${rowCount+3}:H${rowCount+3}`);
                cell = worksheet.getCell('G'+(rowCount+3));
                cell.font={bold: true}
                cell.value="por cobrar"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('I'+(rowCount+1)); 
                cell.font={bold: true}
                cell.value = "Número"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                cell = worksheet.getCell('I'+(rowCount+2)); 
                cell.font={bold: true}
                cell.value = "de cuenta"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`J${rowCount+2}:K${rowCount+2}`);
                cell = worksheet.getCell('J'+(rowCount+2));
                cell.font={bold: true}
                cell.value="Base gravable"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`L${rowCount+1}:M${rowCount+1}`);
                cell = worksheet.getCell('L'+(rowCount+1));
                cell.font={bold: true}
                cell.value="Fecha del"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`L${rowCount+2}:M${rowCount+2}`);
                cell = worksheet.getCell('L'+(rowCount+2));
                cell.font={bold: true}
                cell.value="adeudo"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.mergeCells(`N${rowCount+2}:O${rowCount+2}`);
                cell = worksheet.getCell('N'+(rowCount+2));
                cell.font={bold: true}
                cell.value="Monto del adeudo"
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                rowCount+=5
                rowWhile+=5

                worksheet.addConditionalFormatting({
                    ref: `A${rowCount}:A${rowCount+17}`,
                    rules: [
                    {
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {border: {top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}},
                        }
                    },
                    /*{
                        type: 'expression',
                        formulae: ['0=0'],
                        style: {alignment: { vertical: 'middle', horizontal: 'center' }
                        }
                    }*/
                    ]
                });

                let mergeC = rowCount
                let fileT = 0; 
                //last page
                if(nPage===tPage){
                    //mergeC-=5
                }
                
                while(fileT<18&&countResult<resultAux.length){
                    const r = resultAux[countResult];
                    cell = worksheet.getCell('A'+(mergeC));
                    cell.value=(countResult+1);
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }

                    worksheet.mergeCells(`B${mergeC}:D${mergeC}`);
                    cell = worksheet.getCell('B'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    //cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.nombre;

                    worksheet.mergeCells(`E${mergeC}:F${mergeC}`);
                    cell = worksheet.getCell('E'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}  
                    cell.value=r.localidad;

                    worksheet.mergeCells(`G${mergeC}:H${mergeC}`);
                    cell = worksheet.getCell('G'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.ia;

                    cell = worksheet.getCell('I'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.CTA;

                    worksheet.mergeCells(`J${mergeC}:K${mergeC}`);

                    cell = worksheet.getCell('J'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.bg;

                    worksheet.mergeCells(`L${mergeC}:M${mergeC}`);
                    cell = worksheet.getCell('L'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.lastDate;

                    worksheet.mergeCells(`N${mergeC}:O${mergeC}`);
                    cell = worksheet.getCell('N'+(mergeC));
                    cell.border={top: {style:'thick'},right: {style:'thick'},
                                        bottom: {style:'thick'},left: {style:'thick'}}
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                    cell.value=r.ia;

                    mergeC++
                    fileT++
                    countResult++;
                }

                console.log('NO ERROR rezago '+nPage);
                
                rowCount += 17
                nPage++
                }   
            
                console.log('Finish '+subPath);

                await workbook.xlsx.writeFile(subPath);
                outJSON={filename}
                setResponse(res,outJSON,con);
            });
         }
    });
}

const genExcel = (req, res) => {
let outJSON = {}
let inJSON = req.body
let con = mysql.createConnection({
    host: "localhost",
    user: process.env.NODE_MYSQL_USER,
    password: process.env.NODE_MYSQL_PASS,
    database: "dbcatastro"
});
try{
    con.connect( (err) => {
        
        buildPadron(inJSON, outJSON, con, res);
        
    });
}catch(e){
    console.log(e)
}
}

const entregaRecepcion = (req, res) => {
        try {
            const {op} = req.body
                   if (op) {

                        genExcel(req, res)

                    } else {
                        res.end()
                    }
            
        } catch (e) {
            console.log(e)
        }
}
 
module.exports=entregaRecepcion