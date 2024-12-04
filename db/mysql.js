const { getRounds } = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const sql = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the connection
async function isConnected() {
    try {
        await sql.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

console.log('Database connection status:', isConnected() ? 'OK' : 'ERROR');

const functions = {
    /**
     * Get all rows from a specified table.
     * @param {string} table - The name of the table to query.
     * @returns {Promise<Array>} - A promise that resolves to an array of rows.
     * @example
     * const users = await sql.functions.getRows('users');
     */
    async getRows(table) {
        const [rows] = await sql.query(`SELECT * FROM ${table}`);
        console.log(rows);
        return rows;
    },

    /**
     * Get a specific row from a specified table using a selector.
     * @param {string} table - The name of the table to query.
     * @param {Object} selector - An object representing the selection criteria.
     * @returns {Promise<Object>} - A promise that resolves to a single row.
     * @example
     * const user = await sql.functions.getRow('users', { id: 1 });
     */
    async getRow(table, selector) {
        const [rows] = await sql.query(`SELECT * FROM ${table} WHERE ?`, selector);
        return rows[0];
    },

    /**
     * Update a row in a specified table using a selector.
     * @param {string} table - The name of the table to update.
     * @param {Object} data - An object representing the data to update.
     * @param {Object} selector - An object representing the selection criteria.
     * @returns {Promise<Object>} - A promise that resolves to the result of the update operation.
     * @example
     * const result = await sql.functions.updateRow('users', { name: 'John Doe' }, { id: 1 });
     */
    async updateRow(table, data, selector) {
        const [result] = await sql.query(`UPDATE ${table} SET ? WHERE ?`, [data, selector]);
        return result;
    },

    /**
     * Insert a row in a specified table
     * @param {string} table
     * @param {Object} data
     * @returns {Promise<Object>}
     * @example
     * const result = await sql.functions.insertRow('users', { name: 'John Doe',  id: 1 });
     */
    
    async insertRow(table, data) {
        console.log('Datos recibidos en insertRow:', data);
    
        if (!data || typeof data !== 'object') {
            console.error('Error: Los datos proporcionados a insertRow son inválidos:', data);
            throw new Error('Los datos proporcionados a insertRow son inválidos.');
        }
    
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(key => data[key]);
    
        try {
            const [result] = await sql.query(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, values);
            return result;
        } catch (error) {
            console.error('Error ejecutando la consulta:', error);
            throw error;
        }
    },
    

    async deleteRow(table, selector) {
        const [result] = await sql.query(`DELETE FROM ${table} WHERE ?`, [selector]);
        return result;
    }
}



// monkey patch the pool with the functions object
// not the best practice but it works for now
sql.functions = functions;

module.exports = sql;
