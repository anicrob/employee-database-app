const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employeeshw_db'
    });

    db.connect( (err) => {
        if(err) throw err;
    })

    module.exports = db