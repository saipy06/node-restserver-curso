const express = require('express');

let { verificaToken } = require('../middelwares/autenticacion');
//const { verificaAdmin_Role } = require('../middelwares/autenticacion');

let app = express();

let Producto = require('../models/producto');




//****************************** */
//    Mostrar todos los Productos
//****************************** */
app.get('/producto', verificaToken, (req, res) => {

    //trae todos los productos
    // populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    let limite = req.query.limit || 5;

    desde = Number(desde);
    limite = Number(limite);



    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email') // trae de la tabla usuario el nombe y emial
        .populate('categoria', 'descripcion') // trae de la tabla usuario el nombe y emial
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});





//************************* */
//  Mostrar un Producto por ID
//****************************** */
app.get('/producto/:id', verificaToken, (req, res) => {



    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email') // trae de la tabla usuario el nombe y emial
        .populate('categoria', 'descripcion') // trae de la tabla usuari
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        messagge: 'Categoría no encontrada'
                    }
                });
            };

            res.json({
                ok: true,
                productoDB
            });

        });

});

//************************* */
//  Buscar Productos  
//****************************** */
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // se genera una expresión para que sea de forma generica

    Producto.find({ nombre: regex }) // aqui se pueden agregar mas campos
        //  {nombre: regex, disponible: true} en este caso traería los que tienen de nombre 
        // en algun lado regex y los que están disponible true 
        .populate('categoria', 'descripcion') // trae de la tabla usuari
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productoDB
            });




        })



});




//************************* */
//  Crear un nuevo Producto  
//****************************** */
app.post('/producto', verificaToken, (req, res) => {

    // grabar la categoría y el usuario que lo carga
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        //si no se creo la categoría
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

//************************* */
//  PUT actualiza el producto 
//****************************** */
app.put('/producto/:id', verificaToken, (req, res) => {
    // regresa una nueva categoría
    // req.usurio.id

    let id = req.params.id;
    //con esto se especifica que solo estos campos sean modificables
    let body = req.body;
    // let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    // let descCategoria = {
    //     descripcion: body.descripcion
    // };

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});


//************************* */
//  Borrar un producto
//****************************** */

app.delete('/producto/:id', verificaToken, (req, res) => {
    // se borra en forma logica
    // disponible = false;

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBD) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (productoBD === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    messagge: 'Producto no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoBD,
            messagge: 'Producto Borrado..'

        });

    });
});

module.exports = app;