let fs = require('fs');
let https = require('https');
let express = require('express');
const httport = 80;
const httpsort = 443;
const path = require('path');
//const cors = require('cors');
const {
    comprobarU,regO,genFolio,saveDataL,allPadrones,padrones,getPredial,byFolio,
    getZone,registrarF,informeG,genCerti,actualizarC,obtenerOF,actualizarU,actualizarP,registrarC,
    getAvatar
} = require('./functions');
let app = express();
let options = null;
try {
    options = {
        key: fs.readFileSync(path.join(__dirname, "cert/server.key")),
        cert: fs.readFileSync(path.join(__dirname, "cert/server.cer"))
    }
} catch (e) {
    https = require('http');
    console.log(e)
}

function setResponseHeaders(res, filename) {
    res.header('Content-disposition', 'inline; filename=' + filename);
    res.header('Content-type', 'application/pdf');
}

function setResponseHeadersJSON(res) {
    res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'catastro')));
app.use("/orden",express.static(path.join(__dirname, 'catastro-pdf')));

https.createServer(options, app).listen(httport, ()=> {
    console.log("My https server listening on port " + httport + "...");
});

https.createServer(options, app).listen(httpsort, ()=> {
    console.log("My https server listening on port " + httpsort + "...");
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'catastro', 'index.html'));
});

app.get('/orden/:u', function (req, res) {
    const user = req.params.u; 
    switch(user){
        case "admin":
        case "usuario":
            res.sendFile(path.join(__dirname, 'catastro-pdf', 'index.html'));
            break;

    }
    
});

app.get('/expedientes/:tp/:CTA/:escritura', function(req, res){
    try {
        var filename = "/var/expedientes/" + req.params.tp + "/" + req.params.CTA
        filename += "/" + req.params.escritura
            //filename = path.join(__dirname, filename)
            // console.log(filename)
            // file = tmpdir + filename;
        setResponseHeaders(res, req.params.escritura);
        //fs.createReadStream(path.join(__dirname, filename)).pipe(res);
        fs.createReadStream(filename).pipe(res);
        
        /*
        //To Create in the fly pdf
        (async function() {
            const instance = await phantom.create();
            const page = await instance.createPage();

            await page.property('viewportSize', { width: 1024, height: 600 });
            const status = await page.open(path.join(__dirname, filename));
            console.log(`Page opened with status [${status}].`);
            console.log(path.join(__dirname, filename))
            await page.render(req.params.escritura);
            console.log(`File created at [./stackoverflow.pdf]`);
            fs.createReadStream(path.join(__dirname, filename)).pipe(res);
            await instance.exit();
        })();*/

    } catch (e) {
        console.log(e)
    }
});

app.all('/predial/login', (req, res) => {
    try {
        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            comprobarU(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/regO', (req, res) => {
    try {
        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            regO(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/genFolio', (req, res) => {
    try {
        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            genFolio(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/saveDataL', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            saveDataL(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/padrones', (req, res) => {
    try {
        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            padrones(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/allPadrones', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            allPadrones(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/getPredial', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            getPredial(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/byFolio', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            byFolio(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/getZone', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            getZone(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/registrarF', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            registrarF(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/informeG', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            informeG(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/genCerti', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            genCerti(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/actualizarC', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            actualizarC(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/obtenerOF', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            obtenerOF(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/actualizarU', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            actualizarU(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/actualizarP', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            actualizarP(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/registrarC', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            registrarC(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});

app.all('/getAvatar', (req, res) => {
    try {

        //console.log(res)
        //let filename = ["Acceso.js"]
       //import('./comprobarU.js').then(({comprobarU})=>{
            setResponseHeadersJSON(res);

            getAvatar(req,res)
       // })
        //res.send(filename)

    } catch (e) {
        console.log(e)
    }
});