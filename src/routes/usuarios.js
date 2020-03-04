const express = require('express');
const router = express.Router();
const pool = require('../database');
var bcrypt = require('bcryptjs');

// Add usuario
router.post('/', async(req, res) => {
    if (!req.body.nombre || !req.body.password || !req.body.username || !req.body.rol) {
        manejoErrores('Faltan datos', res);
        return
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
            if(err)
                manejoErrores('Error al encriptar', res);
            else {
                const db = await pool.query(` INSERT INTO Usuarios(nombre, password, username, rol) VALUES ('${req.body.nombre}', '${hash}', '${req.body.username}', '${req.body.rol}') `).catch(e => {
                    manejoErrores('Error al insertar', res);
                    console.log(e);
                });

                if (db)
                    res.json('ok');
            }
        });
    });


});

// Get all usuario
router.get('/', async(req, res) => {
    const db = await pool.query(`SELECT id, nombre, username, rol FROM Usuarios WHERE rol != 3 AND activo = 1 ORDER BY id DESC`).catch(e => {
        manejoErrores('Error al buscar', res);
    });

    if (db)
        res.json(db);
})

// Get 1 usuario
router.get('/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`SELECT * FROM Usuarios WHERE id = ${id}`).catch(e => {
        manejoErrores('Error al buscar', res);
        console.log(e);
    });

    if (db.length == 0)
        manejoErrores('El id no existe', res);
    else if (db)
        res.json(db[0]);
})

// Delete 
router.put('/activo/:id', async(req, res) => {
    const id = req.params.id;

    const db = await pool.query(`UPDATE Usuarios SET activo = 0 WHERE id = ${id}`).catch(e => {
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
    const id = req.params.id;

    if(!req.body.nombre || !req.body.username || !req.body.rol){
        manejoErrores('Faltan Datos', res);
        return 
    }

    const db = await pool.query(`UPDATE Usuarios SET nombre = '${req.body.nombre}', username = '${req.body.username}', rol = '${req.body.rol}' WHERE id = ${id}`).catch(e => {
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
