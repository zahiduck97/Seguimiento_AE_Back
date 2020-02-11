// Requires
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initializations
const app = express();

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

// Static Fields
app.use(express.static(path.join(__dirname, 'public')));

// Server
app.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});