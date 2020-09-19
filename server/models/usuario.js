const mongoose = require('mongoose');
const uniqueValor = require('mongoose-unique-validator');



let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'El password es obligatoria'],
    },
    img: {
        type: String,
        required: false, // o puedo sacar si no es requerido
    },
    role: {
        type: String,
        required: false,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        //required: false,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    },
});

// modifica el toJson para que cuando devuelva no muestre el campo password
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObjetct = user.toObject();
    delete userObjetct.password;

    return userObjetct;
}


usuarioSchema.plugin(uniqueValor, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);