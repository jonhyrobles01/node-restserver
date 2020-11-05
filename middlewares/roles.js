const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */
let ADMIN_ROLE = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({ err: { message: 'Usuario sin Permisos' } });
    }

    next();
};

module.exports = {
    ADMIN_ROLE
}