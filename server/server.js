require('./config/config');
const express = require('express')
    // Using Node.js `require()`
const mongoose = require('mongoose');
//const mongoClient = require('mongodb').MongoClient;

const app = express()
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(require('./routes/usuario'));


//{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },

//conexión a la base de datos

//const client = new MongoClient(process.env.URLDB, { userNewUrlParser: true});

console.log(process.env.URLDB);


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    function(err, rest) {

        if (err)
            throw err;

        console.log('Base de datos ONLINE');

        // useNewUrlParser: true;
        // useUnifiedTopology: true;
        // useFindAndModify: false;
        // useCreateIndex: true;
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});