const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add Cotizacion
router.post('/', async(req, res) => {
    if (!req.body.idProspecto || !req.body.idCosto || !req.body.comentario || !req.body.total) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Cotizaciones(idProspecto, idCosto, comentario, total) VALUES ('${req.body.idProspecto}', '${req.body.idCosto[0]}', '${req.body.comentario}', '${req.body.total}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM cotizacionesView WHERE activo = 1 ORDER BY fecha DESC`).catch(e => {
        manejoErrores('Error al buscar los servicios', res);
    });

    if (db)
        res.json(db);
})

// Update
router.put('/:id', async(req, res) => {
    console.log(req.body, req.params.id)
    const id = req.params.id;

    if (!req.body.idProspecto || !req.body.idCosto || !req.body.comentario || !req.body.total) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(`UPDATE Cotizaciones SET idProspecto = '${req.body.idProspecto}', idCosto = '${req.body.idCosto}', comentario = '${req.body.comentario}',
     total = '${req.body.total}' WHERE id = ${id}`).catch(e => {
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
router.put('/activo/:id/:estado', async(req, res) => {
    const id = req.params.id;
    const estado = req.params.estado;

    const db = await pool.query(`UPDATE Cotizaciones SET activo = ${estado} WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al borrar', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe el id a borrar', res);
});

// Enviado
router.put('/enviado/:id/:estado', async(req, res) => {
    const id = req.params.id;
    const estado = req.params.estado;

    const db = await pool.query(`UPDATE Cotizaciones SET enviado = ${estado} WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe el id a borrar ', res);
});

// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;
