const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if (!req.body.idNorma || !req.body.idTipoServicio || !req.body.costo) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Costos(idNorma, idTipoServicio, costo) VALUES ('${req.body.idNorma}', '${req.body.idTipoServicio}', '${req.body.costo}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM costosView`).catch(e => {
        manejoErrores('Error al buscar', res);
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