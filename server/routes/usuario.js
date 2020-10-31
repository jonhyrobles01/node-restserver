const express = require('express');
const app = express();

app.get('/usuarios', function(req, res) {
    res.json('get Usuario');
});

app.post('/usuarios', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }

    res.json({ persona: body });
});

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json({ id });
});

app.delete('/usuarios', function(req, res) {
    res.json('delete Usuario');
});

module.exports = app;