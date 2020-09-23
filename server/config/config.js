//================================
//          puerto
//===============================

process.env.PORT = process.env.PORT || 3000;

//================================
//          Entorno
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//          Vencimiento del TOKEN
//===============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30;


//================================
//         seed DE AUTENTICACION
//===============================
process.env.SEED = process.env.SEED || 'este-es-el-sed-desarrollo';


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


//================================
//  Google Client ID
//===============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '988119387719-uttdp11uq272anbr8sslvvno2uilng6r.apps.googleusercontent.com';