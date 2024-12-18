const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const logger = require('./logger');

// Routes import
const userRoutes = require('./routes/users');
const logRoutes = require('./routes/log');
const validationRoutes = require('./routes/validation');
const routes = require('./routes');
const solicitudes = require('./routes/solicitudes');
const User = require('./routes/users');

// Middlewares import
const authenticate = require('./middlewares/authenticate');
const disabled = require('./middlewares/disabled');

// Application
const app = express();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root url
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'operational',
        message: 'Welcome to the SCP-API!',
        features: [
            '🔄 Routes handling',
            '🔐 User authentication with JWT',
            '💾 MySQL2 / Postgres basic functions',
            '📧 Nodemailer included',
            '🔧 Configuration with DotEnv',
            '📝 Winston logging',
            '📡 CORS enabled',
            '🚫 Rate limiting',
            '🔍 Joi validation',
            '🛡️ Middleware ready',
            '📦 Modular structure',
            '🔒 Disabled route middleware',
            '🚀 Works out of the box!'
        ]
    });
});

// Those routes are only examples routes to inspire you or to get you started faster.
// You are not forced to use them, and can erase all routes in order to make your own.
// Nested routes (routes are stored in the routes folder)
app.use('/users', userRoutes);
app.use('/api', authenticate, routes); // '/api' routes are protected with the 'authenticate' middleware
app.use('/log', logRoutes);
app.use('/validation', validationRoutes);
app.use('/solicitudes', solicitudes);
app.use('/users', User);

// Root routes
// curl -X GET http://localhost:5005/welcome
app.get('/welcome', (req, res) => {
    res.json({ message: 'Welcome' });
});

// curl -X GET http://localhost:5005/disabled
// This route is disabled by the middleware
app.get('/disabled', disabled, (req, res) => {
    res.json({ message: 'This route is disabled, you cannot see this message.' });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // logger.info(`Server is running on port ${PORT}`); Use this line if you want to log the startup
});
