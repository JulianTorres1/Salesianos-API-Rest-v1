const express = require('express');
const router = express.Router();
const sql = require('../db/mysql');


// Ruta para obtener todas las solicitudes
router.get('/get', async (req, res) => {
    try {
        console.log('Fetching rows from Solicitudes table...');
        const results = await sql.functions.getRows('Solicitudes');
        console.log('Results:', results); // Log para verificar los resultados
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
    const { data } = req.body; // Asegúrate de enviar los datos de la nueva solicitud en el cuerpo de la solicitud
    try {
        console.log('Creating new row in Solicitudes table...');
        const result = await sql.functions.createRow('Solicitudes', data);
        console.log('Create result:', result); // Log para verificar el resultado de la creación
        res.json(result);
    } catch (err) {
        console.error('Error creating row:', err); // Log para verificar el error
        res.status(500).send(err);
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


module.exports = router;