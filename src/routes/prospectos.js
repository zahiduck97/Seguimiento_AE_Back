const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if(!req.body.nombre || !req.body.idEmpresa || !req.body.telefono || !req.body.correo || !req.body.direccion){
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Prospectos(idEmpresa, nombre, telefono, correo, direccion) VALUES ('${req.body.idEmpresa}', '${req.body.nombre}', '${req.body.telefono}', '${req.body.correo}', '${req.body.direccion}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if(db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM prospectosView`).catch(e => {
        manejoErrores('Error al buscar los Prospectos', res);
    });

    if(db)
        res.json(db);
})

// Get 1 empresa
router.get('/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`SELECT * FROM Prospectos WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al buscar el prospecto', res);
        console.log(e);
    });

    if(db.length == 0)
        manejoErrores('El prospecto no existe', res);
    else if(db)
        res.json(db[0]);
})

// Delete 1 empresa
router.delete('/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`DELETE FROM Prospectos WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al borrar el prospecto', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe el prospecto a borrar', res);
});


// Functions
function manejoErrores(mensaje, res){
    res.status(400).json({
        mensaje
    })
}

module.exports = router;