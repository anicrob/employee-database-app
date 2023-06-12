//require mysql2 package
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employeeshw_db'
    });

    db.connect( (err) => {
        if(err) throw err;
    })

//export the db connection
module.exports = db