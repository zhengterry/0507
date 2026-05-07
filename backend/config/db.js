const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '10.7.76.116',
  user: 'ztocc_tms_operates_rw',
  password: 'Wfdsg2140HZ_26UvMwb8l8k#',
  database: 'ztocc_tms_operates',
  port: 3306,
  connectionLimit: 10
});

module.exports = pool;