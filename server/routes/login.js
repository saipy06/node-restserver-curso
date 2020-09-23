const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;


    // condicion           error  , usuario que devuelve
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contrasenia incorrectos'
                }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasenia) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // expira en 30 dias (60 seg*60min*24hs*30d) 

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});


//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }


}
//verify().catch(console.error);


app.post('/google', async(req, res) => {

    let token = req.body.idtoken; // se toma el token

    let googleUser = await verify(token) // se llama a verificar el token
        .catch(e => { // no se ejecuta si hay error
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // si todo va bien se busca en la base de datos un usuario con el correo
    // tomado del token
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) { // si hay error retorna status 500 erro interno del server
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (usuarioDB) { // encuentra el usuario 
            if (usuarioDB.google === false) { // significa que puso su usuario y contrasenia y no el de google
                return res.status(500).json({ // entonces se envia un error
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion Normal'
                    },
                });

            } else { // si ingresa con el usuario de google
                let token = jwt.sign({ // renueva el token
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }

        } else {
            // si el usuario no existe en nuestra de base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save((err, usuarioDB) => { // graba en la BD
                if (err) { // en el caso de error
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                };
                let token = jwt.sign({ // renueva el token
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ //retorno el usuarios
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            });

        };


        // res.json({
        //     usuario: googleUser
        //         //token
        // });

    });
});






module.exports = app;