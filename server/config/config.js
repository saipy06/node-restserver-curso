//================================
//          puerto
//===============================

process.env.PORT = process.env.PORT || 3000;

//================================
//          Entorno
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//================================
//          Entorno
//===============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = process.env.MONGO_URI;
}

/*
para ello se ejecutaron las siguiente lineas
heroku config 				// para ver las variables de heroku

heroku config:set  MONGO_URI="mongodb+srv://ysapy:kqYjgqTez8iHRSqW@cluster0.ktbxh.mongodb.net/cafe?retryWrites=true&w=majority"

heroku config:get nombre				// trae el contenido de la variable



*/


//urlDB = 'mongodb+srv://ysapy:kqYjgqTez8iHRSqW@cluster0.ktbxh.mongodb.net/cafe?retryWrites=true&w=majority';
process.env.URLDB = urlDB;