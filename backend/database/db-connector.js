//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '',
    password        : '',
    database        : ''
})

// Export it for use in our applicaiton
module.exports.pool = pool;
