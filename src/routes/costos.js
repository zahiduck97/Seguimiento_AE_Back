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

    const select = await pool.query(`SELECT * FROM costosView WHERE id = ${db.insertId}`).catch(e => {
        manejoErrores('Error al buscar', res);
        console.log(e);
    })

    console.log(select[0])

    if (select)
        res.json(select[0]);
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM costosView WHERE activoCosto = 1 AND activoNorma = 1 AND activoTipo = 1  ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar', res);
    });

    if (db)
        res.json(db);
})

// Update
router.put('/:id', async(req, res) => {

    const id = req.params.id;

    if(!req.body.idNorma || !req.body.idTipoServicio || !req.body.costo){
        manejoErrores('Faltan Datos', res);
        return
    }

    const db = await pool.query(`UPDATE Costos SET idNorma = '${req.body.idNorma}', idTipoServicio = '${req.body.idTipoServicio}', costo = '${req.body.costo}' WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    if(db.affectedRows > 0){
        const select = await pool.query(`SELECT * FROM costosView WHERE id = ${id}`).catch(e => {
            manejoErrores('Error al buscar', res);
            console.log(e);
        })
        console.log(select[0]);
    if (select)
        res.json(select[0]);

    }
    else
        manejoErrores('No existe el id', res);
});

// Get 1
router.get('/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`SELECT * FROM costosView WHERE id = ${id} ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar', res);
    });

    if (db)
        res.json(db[0]);
})

// Delete 
router.put('/activo/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Costos SET activo = 0 WHERE id = ${id}`).catch(e => {
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
