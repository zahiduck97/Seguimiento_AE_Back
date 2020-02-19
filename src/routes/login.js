const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');

// For Socket
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// Compare password
router.put('/checkUser', async(req, res) => {
    if(!req.body.username || !req.body.password) {
        manejoErrores("Faltan datos", res)
        return
    }

    const db = await pool.query(`SELECT * FROM Usuarios WHERE username = '${req.body.username}'`).catch(e => {
        manejoErrores('Error al buscar', res);
    });

    if (db.length > 0) {
        bcrypt.compare(req.body.password, db[0].password , function(err, comparacion) {
            console.log(req.body.password, db[0].password, comparacion)
            if(err)
                manejoErrores("Error al comparar", res);
            if(comparacion == true){
                console.log({id : db[0].id, rol : db[0].rol})
                res.json({id : db[0].id, rol : db[0].rol});
            }
            else
                manejoErrores("La contraseña no es correcta", res);
        });
    }
    else
        manejoErrores("No existe el usuario en la base de datos", res);
})


// Functions
function manejoErrores(mensaje, res) {
    res.status(400).json({
        mensaje
    })
}

module.exports = router;
