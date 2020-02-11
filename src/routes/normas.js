const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if (!req.body.codificacion) {
        manejoErrores('Falta la codificacion de la norma', res);
        return
    }

    const db = await pool.query(` INSERT INTO Normas(codificacion) VALUES ('${req.body.codificacion}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM Normas`).catch(e => {
        manejoErrores('Error al buscar las normas', res);
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