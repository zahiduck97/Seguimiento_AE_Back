const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add movement
router.post('/', async(req, res) => {
    if (!req.body.idUsuario || !req.body.tipo || !req.body.descripcion) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Movimientos(idUsuario, tipo, descripcion) VALUES ('${req.body.idUsuario}', '${req.body.tipo}', '${req.body.descripcion}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all movements
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM movimientosView ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar los datos', res);
    });

    if (db)
        res.json(db);
})

// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;