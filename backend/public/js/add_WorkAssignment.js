//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addWorkAssignmentForm = document.getElementById('add-workAssignment-form-ajax');

// Modify the objects we need
addWorkAssignmentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmployeeID = document.getElementById("input-employee");
    let inputWorkOrderID = document.getElementById("input-unit-date");

    // Get the values from the form fields
    let employeeIDValue = inputEmployeeID.value;
    let workOrderIDValue = inputWorkOrderID.value;

    // Put our data we want to send in a javascript object
    let data = {
        employeeID: employeeIDValue,
        workOrderID: workOrderIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-workAssignment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputEmployeeID.value = '';
            inputWorkOrderID.value = '';
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from EmployeeHasWorkOrders
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("workAssignments-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let workAssignmentIDCell = document.createElement("TD");
    let employeeLastNameCell = document.createElement("TD");
    let employeeFirstNameCell = document.createElement("TD");
    let unitCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let completionStatusCell = document.createElement("TD");

    // Fill the cells with correct data
    workAssignmentIDCell.innerText = newRow.workAssignmentID;
    employeeLastNameCell.innerText = newRow.Employee_Last_Name;
    employeeFirstNameCell.innerText = newRow.Employee_First_Name;
    unitCell.innerText = newRow.Unit;
    dateCell.innerText = newRow.Date;
    descriptionCell.innerText = newRow.Description;
    completionStatusCell.innerText = newRow.Completion_Status;

    // Add the cells to the row 
    row.appendChild(workAssignmentIDCell);
    row.appendChild(employeeLastNameCell);
    row.appendChild(employeeFirstNameCell);
    row.appendChild(unitCell);
    row.appendChild(dateCell);
    row.appendChild(descriptionCell);
    row.appendChild(completionStatusCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}