require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// app.use(function(req, res) {
//     res.setHeader('Content-Type', 'text/plain')
//     res.write('you posted:\n')
//     res.end(JSON.stringify(req.body, null, 2))
// })





app.get('/usuario', function(req, res) {
    res.json('GET Usuario')
});


app.post('/usuario', function(req, res) {
    let body = req.body;

    //res.end(JSON.stringify(body, null, 2))


    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });


    } else {

        res.json({
            persona: body
        })
    }

});


app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id,
    })
});


app.delete('/usuario', function(req, res) {
    res.json('DELETE Usuario')
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});