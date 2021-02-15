var http = require('express'),
    port = 2998,
    // phantom = require('phantom'),
    //tmpdir = require('os').tmpdir(),
    fs = require('fs');


const path = require('path');

function setResponseHeaders(res, filename) {
    res.header('Content-disposition', 'inline; filename=' + filename);
    res.header('Content-type', 'application/pdf');
}
let options = null
try {
    options = {
        key: fs.readFileSync(path.join(__dirname, "cert/server.key")),
        cert: fs.readFileSync(path.join(__dirname, "cert/server.cer"))
    }
} catch (e) {
    //   http = require('http');
    console.log(e)
}
var server = http.createServer(options);

server.get('/expediente/:tp/:CTA/:escritura', function(req, res, next) {
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

server.listen(port, function() {
    console.log("Listening on port %s...", port);
});