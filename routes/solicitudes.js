const express = require('express');
const router = express.Router();
const sql = require('../db/mysql');

function getDateTime() {
    const date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Ruta para obtener todas las solicitudes
router.get('/get', async (req, res) => {
    try {
        console.log('Fetching rows from Solicitudes table...');
        const results = await sql.functions.getRows('Solicitudes');
        console.log('Results get at:', Date() ); // Log para verificar los resultados
        res.json(results);
    } catch (err) {
        console.error('Error fetching rows:', err); // Log para verificar el error
        res.status(500).send(err);
    }
});

// Ruta para actualizar una solicitud
router.put('/update', async (req, res) => {
    const { id, data } = req.body; // Asegúrate de enviar el ID y los datos a actualizar en el cuerpo de la solicitud
    try {
        console.log(`Updating row in Solicitudes table with ID: ${id}`);
        const result = await sql.functions.updateRow('Solicitudes', data, { id });
        console.log('Update result:', result); // Log para verificar el resultado de la actualización
        res.json(result);
    } catch (err) {
        console.error('Error updating row:', err); // Log para verificar el error
        res.status(500).send(err);
    }
});

// Ruta para crear una nueva solicitud
router.post('/create', async (req, res) => {
    try {
        console.log('Request body recibido:', req.body); // Log para verificar `req.body`
        const data = req.body;

        // Validar que `data` no sea null, undefined o vacío
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            console.error('Error: El cuerpo de la solicitud está vacío o no es válido:', data);
            return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío o no es válido.' });
        }

        console.log('Datos validados para insertar:', data); // Log para verificar `data`

        const result = await sql.functions.insertRow('Solicitudes', data);
        console.log('Resultado de la inserción:', result); // Log para verificar el resultado

        res.status(201).json({ message: 'Solicitud creada exitosamente', result });
    } catch (err) {
        console.error('Error creando la fila:', err);
        res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
});


// Ruta para eliminar una solicitud
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la ruta
    try {
        console.log(`Deleting row from Solicitudes table with ID: ${id}`);
        const result = await sql.functions.deleteRow('Solicitudes', { id });
        console.log('Delete result:', result); // Log para verificar el resultado de la eliminación
        res.json(result);
    } catch (err) {
        console.error('Error deleting row:', err); // Log para verificar el error
        res.status(500).send(err);
    }
});

//Ruta para obtener una solicitud por ID
router.get('/get/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la ruta
    try {
        console.log(`Fetching row from Solicitudes table with ID: ${id}`);
        const result = await sql.functions.getRow('Solicitudes', { id });
        console.log('Result get at:', Date() ); // Log para verificar los resultados
        res.json(result);
    } catch (err) {
        console.error('Error fetching row:', err); // Log para verificar el error
        res.status(500).send(err);
    }
});

// Rua para obtenr solicitudes en base a una fecha
router.get('/getByDate/:date', async (req, res) => {
    const { date } = req.params; // Obtener el ID de los parámetros de la ruta
    try {
        console.log(`Fetching row from Solicitudes table with date: ${date}`);
        const result = await sql.functions.getRowsByDate('Solicitudes', date);
        console.log('Result get at:', Date() ); // Log para verificar los resultados
        res.json(result);
    } catch (err) {
        console.error('Error fetching row:', err); // Log para verificar el error
        res.status(500).send(err);
    }
});

module.exports = router;