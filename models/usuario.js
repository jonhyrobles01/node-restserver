const mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Metodo para quitar algun parametro cuando se imprima en json,
// en este caso se omite el password
UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let userOject = user.toObject();
    delete userOject.password;

    return userOject;
}

// Formateo de la validacion de usuario unico de la base de datos
// para que sea generico al de las demas validaciones
UsuarioSchema.plugin(UniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', UsuarioSchema);