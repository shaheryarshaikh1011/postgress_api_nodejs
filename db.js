const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "root",
    database: "empdept",
    host: "localhost",
    port: "5432"
})


module.exports = pool;