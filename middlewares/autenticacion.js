const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: { message: err.message } });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

/**
 * [Verifica Token Imagen]
 */
let VerificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: { message: err.message } });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    VerificaTokenImg
}