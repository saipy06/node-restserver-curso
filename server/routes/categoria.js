const express = require('express');

let { verificaToken } = require('../middelwares/autenticacion');
const { verificaAdmin_Role } = require('../middelwares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//************************* */
//    Mostrar todas las categorías
//****************************** */
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // trae de la tabla usuario el nombe y emial
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                categorias
            });




        });

});





//************************* */
//  Mostrar una categoria por ID
//****************************** */
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messagge: 'Categoría no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoriaDB
        });




    });






});





//************************* */
//  Crear una nueva categoría  
//****************************** */
app.post('/categoria', verificaToken, (req, res) => {
    // regresa una nueva categoría
    // req.usurio.id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        //si no se creo la categoría
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaBD
        });





    });
});

//************************* */
//  PUT actualiza la categoria 
//****************************** */
app.put('/categoria/:id', verificaToken, (req, res) => {
    // regresa una nueva categoría
    // req.usurio.id

    let id = req.params.id;

    //con esto se especifica que solo estos campos sean modificables
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };



    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//************************* */
//  Borrar la categoría
//****************************** */

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // sol un administrador puede borrar la categoría
    // Categoría.findByIdAndRemove

    let id = req.params.id;


    Categoria.findByIdAndUpdate(id, { new: true }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (categoriaBD === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    messagge: 'Categoría no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaBD,
            messagge: 'Categoría Borrada..'

        });






    });
});

module.exports = app;