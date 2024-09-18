//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 7100;                 // Set a port number at the top so it's easy to change in the future

// handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set("views", "./views");
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES 
*/

// RENDER INDEX PAGE
app.get('/', function(req, res)
    {  
        return res.render('index');
    });                                                         


// UNITS READ OPERATION
app.get('/units', function(req, res)
{  
    // Query to extract existing units entries from the database
    let queryDisplayUnits = "SELECT unitID AS Unit, isVacant AS Vacancy_Status, rent AS Rent_Price, roomCount AS Bedrooms, bathCount AS Bathrooms, sqft AS SQFT FROM Units;";
    db.pool.query(queryDisplayUnits, function(error, rows, fields){   

        return res.render('units', {data: rows});  // send the query results as a JS object in the HTTP response
            
    })
});                                                        

// UNITS INSERT OPERATION  
app.post('/add-unit-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the Add Units query and run it on the database
    queryAddUnit1 = `INSERT INTO Units (unitID, isVacant, rent, roomCount, bathCount, sqft) VALUES ('${data.Unit}', '${data.Vacancy_Status}', '${data.Rent_Price}', '${data.Bedrooms}', '${data.Bathrooms}', '${data.SQFT}');`;
    db.pool.query(queryAddUnit1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform Display Units query
            queryAddUnit2 = "SELECT unitID AS Unit, isVacant AS Vacancy_Status, rent AS Rent_Price, roomCount AS Bedrooms, bathCount AS Bathrooms, sqft AS SQFT FROM Units;";
            db.pool.query(queryAddUnit2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);     // send the query results as a JS object in the HTTP response
                }
            })
        }
    })
});

// UNIT UPDATE OPERATION
app.put('/put-unit-ajax', function(req,res,next){
    let data = req.body;
  
    // SQL queries to extra existing entries for the display, and to update a given unit's attributes with the user input
    let queryUpdateUnit = `UPDATE Units SET isVacant = IF('${data.Vacancy_Status}'='', isVacant, '${data.Vacancy_Status}'), rent = IF('${data.Rent_Price}'='', rent, '${data.Rent_Price}'), roomCount = IF('${data.Bedrooms}'='', roomCount, '${data.Bedrooms}'), bathCount = IF('${data.Bathrooms}'='', bathCount, '${data.Bathrooms}'), sqft = IF('${data.SQFT}'='', sqft, '${data.SQFT}') WHERE unitID = '${data.Unit}';`;
    let selectUnit = `SELECT unitID AS Unit, isVacant AS Vacancy_Status, rent AS Rent_Price, roomCount AS Bedrooms, bathCount AS Bathrooms, sqft AS SQFT FROM Units WHERE unitID='${data.Unit}';`;
    
          // Run the 1st query
          db.pool.query(queryUpdateUnit, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectUnit, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);       // send the query results as a JS object in the HTTP response
                      }
                  })
              }
  })});


// RESIDENTS READ OPERATION
app.get('/residents', function(req, res)
{  
    
    // Queries to extra existing Resident data from the database, and to extract specific attribute values for dropdown menus
    let queryDisplayResidents = "SELECT residentID, unitID AS Unit, lastName AS Last_Name, firstName AS First_Name, isActive AS Active_Status, phone AS Phone, email AS Email, leaseStart AS Lease_Start_Date, leaseEnd AS Lease_End_Date, licensePlate AS License_Plate, pet AS Has_Pets FROM Residents;";               // Define our query
    let queryGetUnitIDs = "SELECT unitID FROM Units;";
    let queryGetResidentNames = "SELECT residentID, CONCAT(firstName, ' ', lastName) AS Full_Name, unitID FROM Residents;";
    db.pool.query(queryDisplayResidents, function(error, rows, fields){    // Execute the query
        let residents = rows;
        db.pool.query(queryGetUnitIDs, (error, rows, fields) => {
        
            // Save the units for a dropdown menu
            let units = rows;

            db.pool.query(queryGetResidentNames, function(error, rows, fields){

                // Save the resident full names for a dropdown menu
                let residentNames = rows;

                return res.render('residents', {data: residents, units: units, residentNames: residentNames});      // send the query results as a JS object in the HTTP response
            })
        })
    })
});                                                         


// RESIDENTS INSERT OPERATION  
app.post('/add-resident-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let Active_Status = parseInt(data.Active_Status);
    let Has_Pets = parseInt(data.Has_Pets);

    let Unit = data.Unit;  
    if (isNaN(Unit))
    {
        Unit = 'NULL'
    }

    // Create the Add Resident query and run it on the database
    queryAddResident1 = `INSERT INTO Residents (unitID, lastName, firstName, isActive, phone, email, leaseStart, leaseEnd, licensePlate, pet) VALUES (IF('${data.Unit}'='NULL', null, '${data.Unit}'), '${data.Last_Name}', '${data.First_Name}', ${Active_Status}, '${data.Phone}', '${data.Email}', '${data.Lease_Start_Date}', '${data.Lease_End_Date}', '${data.License_Plate}', ${Has_Pets});`;
    db.pool.query(queryAddResident1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform the Display Residents Query
            queryAddResident2 = `SELECT residentID, unitID AS Unit, lastName AS Last_Name, firstName AS First_Name, isActive AS Active_Status, phone AS Phone, email AS Email, leaseStart AS Lease_Start_Date, leaseEnd AS Lease_End_Date, licensePlate AS License_Plate, pet AS Has_Pets FROM Residents;`;
            db.pool.query(queryAddResident2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
}); 


// RESIDENT UPDATE OPERATION
app.put('/put-resident-ajax', function(req,res,next){
    let data = req.body;

    let residentID = parseInt(data.fullname);
    let hasPets = parseInt(data.hasPets);
    let isActive = parseInt(data.isActive);
  
    // SQL queries to extract existing entries for the display, and to update a given Resident's attributes with the user input
    let queryUpdateResident = `UPDATE Residents SET unitID = IF('${data.unit}'='NULL', null, IF('${data.unit}'='', unitID, '${data.unit}')), isActive = IF(${isActive} = '2', isActive, ${isActive}), phone = IF('${data.phone}'='', phone, '${data.phone}'), email = IF('${data.email}'='', email, '${data.email}'), leaseStart = IF('${data.leaseStart}'='', leaseStart, '${data.leaseStart}'), leaseEnd = IF('${data.leaseEnd}'='', leaseEnd, '${data.leaseEnd}'), licensePlate = '${data.licensePlate}', pet = IF(${hasPets} = 2, pet, ${hasPets}) WHERE residentID=${residentID}`;
    let selectResident = `SELECT residentID, unitID AS Unit, lastName AS Last_Name, firstName AS First_Name, isActive AS Active_Status, phone AS Phone, email AS Email, leaseStart AS Lease_Start_Date, leaseEnd AS Lease_End_Date, licensePlate AS License_Plate, pet AS Has_Pets FROM Residents WHERE residentID=${residentID}`
  
          // Run the Update Resident query
          db.pool.query(queryUpdateResident, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the Residents table on the webpage
              else
              {
                  // Run the second query
                  db.pool.query(selectResident, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);       // send the query results as a JS object in the HTTP response
                      }
                  })
              }
  })});



// RESIDENT DELETE OPERATION
app.delete('/delete-resident-ajax', function(req,res,next){
    let data = req.body;
    let residentID = parseInt(data.id);

    // Query to delete a resident by PK from the database
    let queryDeleteResident = `DELETE FROM Residents WHERE residentID = '${residentID}';`;
  
  
          // Run the Delete Resident query
          db.pool.query(queryDeleteResident, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});



// RENT TRANSACTIONS READ OPERATION
app.get('/rent_transactions', function(req, res)
{  

    // Queries that extract all Rent Transaction entries from the database, and certain attribute information for dropdown menus 
    let queryDisplayRentTransactions = `SELECT RentTransactions.rentTransactionID AS Transaction_ID, RentTransactions.residentID AS Resident_ID, Residents.lastName AS Resident_Last_Name, Residents.firstName AS Resident_First_Name, \
    RentTransactions.unitID as Unit, RentTransactions.date AS Date, RentTransactions.amount AS Amount, RentTransactions.paymentType AS Payment_Type FROM RentTransactions \
    INNER JOIN Residents ON RentTransactions.residentID = Residents.residentID ORDER BY Transaction_ID;`;
    
    let queryGetResidentNames = `SELECT residentID, CONCAT(firstName, ' ', lastName) AS Full_Name FROM Residents WHERE isActive = 1;`;
    let queryGetPaymentTypes = `SELECT paymentTypeID AS Payment_Types FROM PaymentTypes;`;

    db.pool.query(queryDisplayRentTransactions, function(error, rows, fields){    
        let transactions = rows;
        
        db.pool.query(queryGetResidentNames, (error, rows, fields) => {
            let residentNames = rows

            db.pool.query(queryGetPaymentTypes, (error, rows, fields) => {
                let paymentTypes = rows
        
                return res.render('rent_transactions', {data: transactions, residentNames: residentNames, paymentTypes: paymentTypes});     // send the query results as a JS object in the HTTP response
            })
        })
    })
});                                                         

// RENT TRANSACTIONS INSERT OPERATION  
app.post('/add-rent-transaction-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the Add Rent Transaction query and run it on the database
    queryAddRentTransaction1 = `INSERT INTO RentTransactions (residentID, unitID, date, amount, paymentType) VALUES ('${data.Resident_ID}', (SELECT unitID from Residents WHERE residentID = '${data.Resident_ID}'), '${data.Date}', '${data.Amount}', '${data.Payment_Type}');`
    db.pool.query(queryAddRentTransaction1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform the Display Rent Transactions query
            queryAddRentTransaction2 = `SELECT RentTransactions.rentTransactionID AS Transaction_ID, RentTransactions.residentID AS Resident_ID, Residents.lastName AS Resident_Last_Name, Residents.firstName AS Resident_First_Name, \
            RentTransactions.unitID as Unit, RentTransactions.date AS Date, RentTransactions.amount AS Amount, RentTransactions.paymentType AS Payment_Type FROM RentTransactions \
            INNER JOIN Residents ON RentTransactions.residentID = Residents.residentID ORDER BY Transaction_ID;`;
            db.pool.query(queryAddRentTransaction2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// PAYMENT TYPES READ OPERATION
app.get('/payment_types', function(req, res)
{  

    // Query to extract all existing PaymentType entries for a display table
    let queryDisplayPaymentTypes = "SELECT paymentTypeID AS Payment_Type, description AS Description FROM PaymentTypes";               
    db.pool.query(queryDisplayPaymentTypes, function(error, rows, fields){    

        res.render('payment_types', {data: rows});                  
    })                                                      
}); 


// PAYMENT TYPES INSERT OPERATION
app.post('/add-payment-type-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the Add Payment Type query and run it on the database
    let queryAddPaymentType1 = `INSERT INTO PaymentTypes (paymentTypeID, description) VALUES ('${data.Payment_Type}', '${data.Description}')`;
    db.pool.query(queryAddPaymentType1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform Display PaymentTypes query
            let queryAddPaymentType2 = `SELECT paymentTypeID AS Payment_Type, description AS Description FROM PaymentTypes;`;
            db.pool.query(queryAddPaymentType2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// EMPLOYEES READ OPERATION
app.get('/employees', function(req, res)
{  
    
    // Queries to extract existing Employees entries for a display table, and employee names for a dropdown menu
    let queryDisplayEmployees = "SELECT employeeID AS Employee_ID, lastName AS Last_Name, firstName as First_Name, isActive AS Active_Status, phone as Phone, email as Email FROM MaintenanceEmployees;";               // Define our query
    let queryGetEmployeeNames = "SELECT employeeID, CONCAT(firstName, ' ', lastName) AS Full_Name FROM MaintenanceEmployees;";
    
    db.pool.query(queryDisplayEmployees, function(error, rows, fields){ 
        let employees = rows

        db.pool.query(queryGetEmployeeNames, function(error, rows, fields){

            return res.render('employees', {data: employees, employeeNames: rows});     // send the query results as a JS object in the HTTP response
        
        })
    })
})       


// EMPLOYEES INSERT OPERATION  
app.post('/add-employee-ajax', function(req, res) 
{   
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the Add Employee query and run it on the database
    let queryAddEmployee1 = `INSERT INTO MaintenanceEmployees (lastName, firstName, isActive, phone, email) VALUES ('${data.Last_Name}', '${data.First_Name}', ${data.Active_Status}, '${data.Phone}', '${data.Email}');`
    db.pool.query(queryAddEmployee1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform the display Employees query
            queryAddEmployee2 = `SELECT employeeID AS Employee_ID, lastName AS Last_Name, firstName as First_Name, isActive AS Active_Status, phone as Phone, email as Email FROM MaintenanceEmployees;`
            db.pool.query(queryAddEmployee2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
}); 


// EMPLOYEES UPDATE OPERATION
app.put('/put-employee-ajax', function(req,res,next){
    let data = req.body;
  
    // SQL queries to extra existing entries for the display, and to update a given Employee's attributes with the user input
    let queryUpdateEmployee = `UPDATE MaintenanceEmployees SET lastName = IF('${data.Last_Name}'='', lastName, '${data.Last_Name}'), firstName = IF('${data.First_Name}'='', firstName, '${data.First_Name}'), isActive = IF('${data.Active_Status}'='', isActive, '${data.Active_Status}'), phone = IF('${data.Phone}'='', phone, '${data.Phone}'), email = IF('${data.Email}'='', email, '${data.Email}') WHERE employeeID = '${data.Employee_ID}';`;
    let selectEmployee = `SELECT residentID, unitID AS Unit, lastName AS Last_Name, firstName AS First_Name, isActive AS Active_Status, phone AS Phone, email AS Email, leaseStart AS Lease_Start_Date, leaseEnd AS Lease_End_Date, licensePlate AS License_Plate, pet AS Has_Pets FROM Residents WHERE residentID='${data.Emmployee_ID}'`
  
          // Run the update Employees query
          db.pool.query(queryUpdateEmployee, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our display Employees query and return that data so we can use it to update the Employee's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectEmployee, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);       // send the query results as a JS object in the HTTP response
                      }
                  })
              }
  })});



// EMPLOYEES DELETE OPERATION
app.delete('/delete-employee-ajax', function(req,res,next){
    
    // Query to delete an employee given the employeeID (PK)
    let data = req.body;
    let queryDeleteEmployee = `DELETE FROM MaintenanceEmployees WHERE employeeID = '${data.Employee_ID}';`;
  
  
          // Run the 1st query
          db.pool.query(queryDeleteEmployee, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});

// WORK ORDERS READ OPERATION
app.get('/work_orders', function(req, res)
{  

    // Queries to extract all work order entries for a display table, and to extra unit IDs and work order identifiers for dropdown menus
    let queryDisplayWorkOrders = "SELECT workOrderID AS Work_Order_ID, unitID AS Unit, description AS Description, submissionDate AS Submission_Date, completionDate AS Completion_Date, isCompleted AS Completion_Status FROM WorkOrders;";               // Define our query
    let queryGetUnitIDs = "SELECT unitID FROM Units;";
    let queryGetOpenWorkOrders = "SELECT workOrderID AS Work_Order_ID FROM WorkOrders WHERE isCompleted = 0;";               
    
    db.pool.query(queryDisplayWorkOrders, function(error, rows, fields){   
        let workOrders = rows

        db.pool.query(queryGetUnitIDs, function(error, rows, fields){ 
            let units = rows

            db.pool.query(queryGetOpenWorkOrders, function(error, rows, fields){
                return res.render('work_orders', {data: workOrders, units: units, openWorkOrders: rows});       // send the query results as a JS object in the HTTP response

            })
        })
            
    })
});                                                        

// WORK ORDERS INSERT OPERATION  
app.post('/add-work-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the Add Work Order query and run it on the database
    queryAddWorkOrder1 = `INSERT INTO WorkOrders (unitID, description, submissionDate, completionDate, isCompleted) VALUES (IF('${data.Unit}'='NULL', null, '${data.Unit}'), '${data.Description}', '${data.Submission_Date}', null, '${data.Completion_Status}');`;
    db.pool.query(queryAddWorkOrder1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform the display Work Orders query
            queryAddWorkOrder2 = "SELECT workOrderID AS Work_Order_ID, unitID AS Unit, description AS Description, submissionDate AS Submission_Date, completionDate AS Completion_Date, isCompleted AS Completion_Status FROM WorkOrders;";
            db.pool.query(queryAddWorkOrder2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// WORK ORDERS UPDATE OPERATION
app.put('/put-work-order-ajax', function(req,res,next){
    let data = req.body;

    // SQL queries to extra existing entries for the display, and to update a given Work Order's attributes with the user input
    let queryUpdateWorkOrder = `UPDATE WorkOrders SET description = IF('${data.Description}'='', description, '${data.Description}'), unitID = IF('${data.Unit}'='NULL', null, IF('${data.Unit}'='', unitID, '${data.Unit}')), completionDate = '${data.Completion_Date}', isCompleted = '${data.Completion_Status}' WHERE workOrderID = '${data.Work_Order_ID}';`
    let selectWorkOrder = `SELECT workOrderID AS Work_Order_ID, unitID AS Unit, description AS Description, submissionDate AS Submission_Date, completionDate AS Completion_Date, isCompleted AS Completion_Status FROM WorkOrders WHERE workOrderID='${data.Work_Order_ID}';`;
          
        // Run the Update Work Order query
          db.pool.query(queryUpdateWorkOrder, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the Work Orders
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectWorkOrder, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);       // send the query results as a JS object in the HTTP response    
                      }
                  })
              }
  })});


// WORK ASSIGNMENTS READ OPERATION
app.get('/work_assignments', function(req, res)
    {  
        let queryDisplayWorkAssignments = "SELECT workAssignmentID, MaintenanceEmployees.lastName AS Employee_Last_Name, MaintenanceEmployees.firstName AS Employee_First_Name, WorkOrders.unitID AS Unit, WorkOrders.submissionDate AS Date, WorkOrders.description AS Description, WorkOrders.isCompleted AS Completion_Status FROM EmployeeHasWorkOrders INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID;";

        // Query for Work Assignments with incomplete work orders
        let queryUnitsDropDown = "SELECT EmployeeHasWorkOrders.workAssignmentID, WorkOrders.workOrderID, CONCAT(WorkOrders.unitID, ' ', WorkOrders.submissionDate) AS Work_Order_Unit_And_Submission_Date, CONCAT(MaintenanceEmployees.firstName, ' ', MaintenanceEmployees.lastName) AS Employee_Name FROM EmployeeHasWorkOrders INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID WHERE WorkOrders.isCompleted = 0;";

        // Query for Active Maintenance Employees dropdown menu
        let queryEmployeesDropDown = "SELECT employeeID, CONCAT(firstName, ' ', lastName) AS Employee_Name FROM MaintenanceEmployees WHERE isActive = 1;";

        // Query for Incomplete Work Orders dropdown menu 
        let queryAddUnitsDropDown = "SELECT workOrderID, CONCAT(unitID, ' ', submissionDate) AS Work_Order_Unit_And_Submission_Date FROM WorkOrders WHERE isCompleted = 0;";

        db.pool.query(queryDisplayWorkAssignments, function(error, rows, fields){   
            let workAssignments = rows;

            // Run the Work Orders dropdown menu query
            db.pool.query(queryUnitsDropDown, (error, rows, fields) => {

                let unit_dates = rows;

                // Run the active maintenance employees dropdown menu query
                db.pool.query(queryEmployeesDropDown, (error, rows, fields) => {

                    let employees = rows;

                    // Run the Work Assignments with incomplete work orders dropdown menu query
                    db.pool.query(queryAddUnitsDropDown, (error, rows, fields) => {
                        
                        // send the query results as a JS object in the HTTP response
                        let add_unit_dates = rows;
                        return res.render('work_assignments', {data: workAssignments, unit_dates:unit_dates, employees:employees, add_unit_dates:add_unit_dates});

                    })

        

            })
        })                                                  
    })
});                                                         


// WORK ASSIGNMENTS INSERT OPERATION
app.post('/add-workAssignment-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let employeeID = parseInt(data.employeeID);
    let workOrderID = parseInt(data.workOrderID);


    // Create the Add Work Assignment query and run it on the database
    queryAddWorkAssignment = `INSERT INTO EmployeeHasWorkOrders (employeeID, workOrderID) VALUES (${employeeID}, ${workOrderID});`;
    db.pool.query(queryAddWorkAssignment, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform the Display Work Assignments Query
            queryDisplayNewWorkAssignments = `SELECT workAssignmentID, MaintenanceEmployees.lastName AS Employee_Last_Name, MaintenanceEmployees.firstName AS Employee_First_Name, WorkOrders.unitID AS Unit, WorkOrders.submissionDate AS Date, WorkOrders.description AS Description, WorkOrders.isCompleted AS Completion_Status FROM EmployeeHasWorkOrders INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID;`;
            db.pool.query(queryDisplayNewWorkAssignments, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// WORK ASSIGNMENTS UPDATE OPERATION
app.put('/put-workAssignment-ajax', function(req,res,next){
    let data = req.body;
  
    let workAssignmentID = parseInt(data.workAssignmentID);
    let employeeID = parseInt(data.employeeID);
    
    // SQL queries to extra existing entries for the display, and to update a given Work Assignment's assigned Employee with the user input
    let queryUpdateWorkAssignment = `UPDATE EmployeeHasWorkOrders SET employeeID = ${employeeID} WHERE workAssignmentID = ${workAssignmentID}`;
    let selectWorkAssignments = "SELECT workAssignmentID, MaintenanceEmployees.lastName AS Employee_Last_Name, MaintenanceEmployees.firstName AS Employee_First_Name, WorkOrders.unitID AS Unit, WorkOrders.submissionDate AS Date, WorkOrders.description AS Description, WorkOrders.isCompleted AS Completion_Status FROM EmployeeHasWorkOrders INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID;";
  
          // Run the update work assignment query
          db.pool.query(queryUpdateWorkAssignment, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the Work Assignments
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectWorkAssignments, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);       // send the query results as a JS object in the HTTP response
                      }
                  })
              }
  })});


// WORK ASSIGNMENTS DELETE OPERATION
app.delete('/delete-workAssignment-ajax', function(req,res,next){
    let data = req.body;
    let workAssignmentID = parseInt(data.id);

    // Query to delete a Work Assignment given the workAssignmentID (PK)
    let queryDeleteWorkAssignment = `DELETE FROM EmployeeHasWorkOrders WHERE workAssignmentID = ${workAssignmentID}`;
  
          // Run the delete work assignment query
          db.pool.query(queryDeleteWorkAssignment, [workAssignmentID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
            })
});


/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

// Database
var db = require('./database/db-connector')
