const jwt = require('jsonwebtoken');


//************************* */
//  Verificar Token
//****************************** */


let verificaToken = (req, res, next) => {

    let token = req.get('token');

    // res.json({
    //     token: token
    // });

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    messagge: 'Token Inválido'
                },
            });
        }
        req.usuario = decoded.usuario;
        next(); //si no se ejecuta esto no muestra el resto del get, puto o lo que llame al middelwares


    })


};


//************************* */
//  Verificar Admin Role
//****************************** */


let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                messagge: 'El usuario no es administrador'
            },
        });
    }





}






module.exports = {
    verificaToken,
    verificaAdmin_Role
}