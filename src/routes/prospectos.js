const express = require('express');
const router = express.Router();
const pool = require('../database');

// Add empresa
router.post('/', async(req, res) => {
    if (!req.body.nombre || !req.body.idEmpresa || !req.body.telefono || !req.body.correo || !req.body.direccion) {
        manejoErrores('Faltan datos', res);
        return
    }

    const db = await pool.query(` INSERT INTO Prospectos(idEmpresa, nombre, telefono, correo, direccion) VALUES ('${req.body.idEmpresa}', '${req.body.nombre}', '${req.body.telefono}', '${req.body.correo}', '${req.body.direccion}') `).catch(e => {
        manejoErrores('Error al insertar', res);
        console.log(e);
    });

    if (db)
        res.json('ok');
});

// Get all empresas
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT * FROM Prospectos WHERE activo = 1 ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar los Prospectos', res);
    });

    if (db)
        res.json(db);
})

// Get 1 empresa
router.get('/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`SELECT * FROM prospectosView WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al buscar el prospecto', res);
        console.log(e);
    });

    if (db.length == 0)
        manejoErrores('El prospecto no existe', res);
    else if (db)
        res.json(db[0]);
})

// Delete 1 empresa
router.put('/activo/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Prospectos SET activo = 0 WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al borrar', res);
        console.log(e);
    })

    if(db.affectedRows > 0)
        res.json('ok');
    else
        manejoErrores('No existe el id a borrar', res);
});

// Update
router.put('/:id', async(req, res) => {
    console.log(req.body);
    const id = req.params.id;


    var contratos = 0;
    var acta = 0;
    var rfc = 0;
    var carta = 0;


    contratos = (req.body.contratos == true) ? 1 : 0;
    acta = (req.body.acta == true) ? 1 : 0;
    rfc = (req.body.rfc == true) ? 1 : 0;
    carta = (req.body.carta == true) ? 1 : 0;


    const db = await pool.query(`UPDATE Prospectos SET contratos = '${contratos}', acta = '${acta}', rfc = '${rfc}', carta = '${carta}' WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    if (db.affectedRows > 0)
        res.json('ok')
    else
        manejoErrores('No existe el id', res);
})

// Editar el prospect
router.put('/editar/:id', async(req, res) => {
    console.log(req.body);
    const id = req.params.id;

    if(!req.body.idEmpresa || !req.body.nombre || !req.body.telefono || !req.body.correo || !req.body.direccion){
        manejoErrores("Faltan datos", res);
        return
    }

    const db = await pool.query(`UPDATE Prospectos SET idEmpresa = '${req.body.idEmpresa}', nombre = '${req.body.nombre}', telefono = '${req.body.telefono}', correo = '${req.body.correo}', direccion = '${req.body.direccion}' WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al actualizar', res);
        console.log(e);
    })

    if (db.affectedRows > 0)
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