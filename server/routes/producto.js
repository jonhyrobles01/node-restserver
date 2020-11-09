const express = require('express');
const { sortBy } = require('underscore');
const _ = require('underscore');

// Middlewares
const { verificaToken } = require('../../middlewares/autenticacion');
const { ADMIN_ROLE } = require('../../middlewares/roles');

// Modelos
const Producto = require('../../models/producto');

const app = express();

// Obtiene el listado de productos
app.get('/productos', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({ err });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

// Obtener producto por id
app.get('/productos/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if (!productoDB) {
                return res.status(400).json({ err: { message: 'Producto no encontrado' } })
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});

// Buscar productos
app.get('/productos/buscar/:termino', verificaToken, function(req, res) {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if (!productoDB) {
                return res.status(400).json({ err: { message: 'Producto no encontrado' } })
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

// Crea un producto con categoria y usuario
app.post('/productos', verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto(body);
    producto.usuario = req.usuario._id;

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// Actualiza Producto
app.put('/productos/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;

    let body = req.body;

    let options = {
        new: true,
        runValidators: true
    }

    Producto.findByIdAndUpdate(id, body, options, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!productoDB) {
            return res.status(400).json({ err: { message: 'Producto no encontrado' } })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// Cambiar el estado de disponible a false
app.delete('/productos/:id', [verificaToken, ADMIN_ROLE], function(req, res) {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (!productoDB) {
            return res.status(400).json({
                err: { message: 'Producto no encontrado' }
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    });
});

module.exports = app;