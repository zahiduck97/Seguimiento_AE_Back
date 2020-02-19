// Requires
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initializations
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Settings
const puerto = process.env.PORT || 3000;
app.set('port', puerto);

// Middlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GLobal Services


// Routes
app.use('/api/Empresas', require('./routes/empresas'));
app.use('/api/Prospectos', require('./routes/prospectos'));
app.use('/api/Normas', require('./routes/normas'));
app.use('/api/TipoServicio', require('./routes/tipo-servicios'));
app.use('/api/Costos', require('./routes/costos'));
app.use('/api/Servicios', require('./routes/servicios'));
app.use('/api/Usuarios', require('./routes/usuarios'));
app.use('/api/Login', require('./routes/login'));
app.use('/api/Movimientos', require('./routes/movimientos'));

// Socket 
io.on('connection', function (socket) {
    socket.emit('navbarStatus', { status: false, rol: 0 });
    socket.on('navbarStatus', function (data) {
        socket.emit('navbarStatus', { status: data.status, rol: data.rol });
    });
});

// Static Fields
app.use(express.static(path.join(__dirname, 'public')));

// Server
http.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});
