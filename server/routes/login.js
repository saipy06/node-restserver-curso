const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const _ = require('underscore');
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

















module.exports = app;