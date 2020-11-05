const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../../models/usuario');
const { verificaToken } = require('../../middlewares/autenticacion');
const { ADMIN_ROLE } = require('../../middlewares/roles');

const app = express();

// Obtiene el listado de usuarios activos
app.get('/usuarios', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email google estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({ err });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

// Crea un usuario en la base de datos
app.post('/usuarios', [verificaToken, ADMIN_ROLE], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Actualiza Usuario
app.put('/usuarios/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    let options = {
        new: true,
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!usuarioDB) {
            return res.status(400).json({ err: { message: 'Usuario no encontrado' } })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Actualiza el estado del usuario a falso 
app.delete('/usuarios/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({ err: { message: 'Usuario no encontrado' } });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;