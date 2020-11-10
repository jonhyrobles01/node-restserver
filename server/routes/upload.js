const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            err: { message: 'No se ha seleccionado ningun archivo' }
        });
    }

    // Valida tipo
    ValidaTipo(tipo, res);

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    ValidaExtesion(extension, res);

    // Cambiar nombre del archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
        if (err) {
            return res.status(500).json({ err });
        }

        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

const ValidaTipo = (tipo, res) => {
    let tipoValidos = ['usuarios', 'productos'];

    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            err: {
                message: `Los tipos permitidos son: ${tipoValidos.join(', ')}`
            }
        });
    }
};

const ValidaExtesion = (extension, res) => {
    //Extensiones validas
    let extensionesValidas = ['jpg', 'jpeg', 'gif', 'png'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            err: {
                message: `Las extensiones permitidas son: ${extensionesValidas.join(', ')}`,
                ext: extension
            }
        });
    }
};

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({ err });
        }

        if (!usuarioDB) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({ err: { message: 'Usuario no encontrado' } })
        }

        BorrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            return res.json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
};

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({ err });
        }

        if (!productoDB) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({ err: { message: 'producto no encontrado' } })
        }

        BorrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            return res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
};

const BorrarArchivo = (img, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};

module.exports = app;