const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add Cotizacion
router.post('/', async(req, res) => {
    if (!req.body.idProspecto || !req.body.idCosto || !req.body.comentario || !req.body.total) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Cotizaciones(idProspecto, idCosto, comentario, total) VALUES ('${req.body.idProspecto}', '${req.body.idCosto}', '${req.body.comentario}', '${req.body.total}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM cotizacionesView ORDER BY fecha DESC`).catch(e => {
        manejoErrores('Error al buscar los servicios', res);
    });

    if (db)
        res.json(db);
})

// Update
router.put('/:id', async(req, res) => {
    const id = req.params.id;

    if(!req.body.nombre){
        manejoErrores('Faltan Datos', res);
        return 
    }

    const db = await pool.query(`UPDATE TipoServicio SET nombre = '${req.body.nombre}' WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    console.log(db);

    if(db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
});

// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;
