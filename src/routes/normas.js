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
    const db = await pool.query(`SELECT * FROM Normas WHERE activo = 1 ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar las normas', res);
    });

    if (db)
        res.json(db);
})

// Update
router.put('/:id', async(req, res) => {
    const id = req.params.id;

    if(!req.body.codificacion){
        manejoErrores('Faltan Datos', res);
        return 
    }

    const db = await pool.query(`UPDATE Normas SET codificacion = '${req.body.codificacion}' WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    console.log(db);

    if(db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
});

// Delete 
router.put('/activo/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Normas SET activo = 0 WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al borrar', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe el id a borrar', res);
});

// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;