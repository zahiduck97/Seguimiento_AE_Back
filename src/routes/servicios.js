const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if (!req.body.idNorma || !req.body.tipoServicio || !req.body.idProspecto) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Servicios(idNorma, tipoServicio, idProspecto, status) VALUES ('${req.body.idNorma}', '${req.body.tipoServicio}', '${req.body.idProspecto}', '1') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    const select = await pool.query(`SELECT * FROM serviciosView WHERE id = ${db.insertId}`).catch(e => {
        manejoErrores('Error al buscar', res);
        console.log(e);
    })

    console.log(select[0])

    if (select)
        res.json(select[0]);
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM serviciosView ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar las normas', res);
    });

    if (db)
        res.json(db);
})

// Estatus Uno
router.put('/estatusUno/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Servicios SET contratos = '${req.body.contratos}', idUsuario = '${req.body.idUsuario}', status = '2' WHERE id = ${id} `).catch( e => {
        manejoErrores('Error al actualizar', res);
        console.log(e)
    })

    if(db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
})

// Estatus Dos
router.put('/estatusDos/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Servicios SET ingresado = '${req.body.ingresado}', referencia = '${req.body.referencia}', facturado = '${req.body.facturado}', status = '3' WHERE id = ${id} `).catch( e => {
        manejoErrores('Error al actualizar', res);
        console.log(e)
    })

    if(db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
})

// Estatus Tres
router.put('/estatusTres/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Servicios SET comunicado = '${req.body.comunicado}', status = '4' WHERE id = ${id} `).catch( e => {
        manejoErrores('Error al actualizar', res);
        console.log(e)
    })

    if(db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
})



// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;