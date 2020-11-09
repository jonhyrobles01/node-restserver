const express = require('express');
const _ = require('underscore');

// Middlewares
const { verificaToken } = require('../../middlewares/autenticacion');
const { ADMIN_ROLE } = require('../../middlewares/roles');

// Modelos
const Categoria = require('../../models/categoria');

const app = express();

// Obtiene el listado de categorias
app.get('/categorias', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({ err });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

// Obtener categoria por id
app.get('/categorias/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ err: { message: 'Categoria no encontrada' } })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Crea una categoria para el usuario login
app.post('/categorias', verificaToken, function(req, res) {
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualiza Categorias
app.put('/categorias/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;

    let body = {
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    };

    let options = {
        new: true,
        runValidators: true
    }

    Categoria.findByIdAndUpdate(id, body, options, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ err: { message: 'Categoria no encontrada' } })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Borrar categoria
app.delete('/categorias/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({ err: { message: 'Categoria no encontrada' } });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;