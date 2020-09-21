// app.use(function(req, res) {
//     res.setHeader('Content-Type', 'text/plain')
//     res.write('you posted:\n')
//     res.end(JSON.stringify(req.body, null, 2))
// })

const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
//const usuario = require('../models/usuario');

const { verificaToken } = require('../middelwares/autenticacion');
const { verificaAdmin_Role } = require('../middelwares/autenticacion');

const app = express();



//************** G E T ******************** */

//    midelware
app.get('/usuario', verificaToken, (req, res) => {


    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.nombre,
    //     email: req.email,
    // })


    let desde = req.query.desde || 0;
    let limite = req.query.limit || 5;

    desde = Number(desde);
    limite = Number(limite);

    // estado true solo me trae los activos
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)

    .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        //estado true me cuenta solo los que estan activos
        Usuario.count({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo,
            });

        });

    });




    //res.json('GET Usuario Local')
});



//************** P O S T ******************** */
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

    //res.end(JSON.stringify(body, null, 2))


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });


    // } else {

    //     res.json({
    //         persona: body
    //     })
    // }

});


//************** P U T ******************** */

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    //con esto se especifica que solo estos campos sean modificables
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });



    });

});

//************** D E L E T E ******************** */
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    //*******************Borra definitivamente de la base de datos
    /*  let id = req.params.id;

      Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

          if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              });
          };
          if (usuarioBorrado === null) {
              return res.status(400).json({
                  ok: false,
                  err: {
                      messagge: 'Usuario no encontrado'
                  }
              });
          };

          res.json({
              ok: true,
              usuario: usuarioBorrado

          });
          */

    // solo cambia el estado
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    messagge: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado

        });






    });


});



module.exports = app;