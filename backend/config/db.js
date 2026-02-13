require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: true, // true for Azure
    trustServerCertificate: true, // for local dev / self-signed certs
  },
};

let pool; // singleton pool

async function getPool() {
  if (pool) return pool; // return existing pool if already connected
  try {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('Connected to MSSQL');
    return pool;
  } catch (err) {
    console.error('Database Connection Failed!', err);
    throw err; // throw so calls using getPool() fail fast
  }
}

module.exports = { sql, getPool };