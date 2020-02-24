const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if(!req.body.nombre){
        manejoErrores('Falta el nombre de la empresa', res);
        return
    }

    const empresadb = await pool.query(` INSERT INTO Empresas(nombre) VALUES ('${req.body.nombre}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if(empresadb)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const empresadb = await pool.query(`SELECT * FROM Empresas WHERE activo = 1`).catch(e => {
        manejoErrores('Error al buscar las empresas', res);
    });

    if(empresadb)
        res.json(empresadb);
})

// Get 1 empresa
router.get('/:id', async(req, res) => {
    const id = req.params.id;

    const empresadb = await pool.query(`SELECT * FROM Empresas WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al buscar la empresa', res);
        console.log(e);
    });

    if(empresadb.length == 0)
        manejoErrores('La empresa no existe', res);
    else if(empresadb)
        res.json(empresadb[0]);
})

// Delete 1 empresa
router.put('/activo/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Empresas SET activo = 0 WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al borrar la empresa', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe la empresa a borrar', res);
});

// put 1 Empresa
router.put('/:id', async(req, res) => {
    const id = req.params.id;

    if(!req.body.nombre){
        manejoErrores('Faltan Datos', res);
        return 
    }

    const db = await pool.query(`UPDATE Empresas SET nombre = '${req.body.nombre}' WHERE id = ${id}`).catch(e => {
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
function manejoErrores(mensaje, res){
    res.status(400).json({
        mensaje
    })
}

module.exports = router;