//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addWorkOrderForm = document.getElementById('add-work-order-form-ajax');

// Modify the objects we need
addWorkOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Save date info
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // Get form fields we need to get data from
    let inputUnitID = document.getElementById("input-unit");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let unitIDValue = inputUnitID.value;
    let descriptionValue = inputDescription.value;
    let submissionDateValue = `${year}-${month}-${day}`;
    let completionDateValue = null
    let completionStatusValue = 0;


    // Put our data we want to send in a javascript object
    let data = {
        Unit: unitIDValue,
        Description: descriptionValue,
        Submission_Date: submissionDateValue,
        Completion_Date: completionDateValue,
        Completion_Status: completionStatusValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-work-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUnitID.value = '';
            inputDescription.value = '';

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from WorkOrders
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("work-orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let workOrderIDCell = document.createElement("TD");
    let unitIDCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let submissionDateCell = document.createElement("TD");
    let completionDateCell = document.createElement("TD");
    let completionStatusCell = document.createElement("TD");

    // Fill the cells with correct data
    workOrderIDCell.innerText = newRow.Work_Order_ID;
    unitIDCell.innerText = newRow.Unit;
    descriptionCell.innerText = newRow.Description;
    submissionDateCell.innerText = newRow.Submission_Date;
    completionDateCell.innerText = newRow.Completion_Date;
    completionStatusCell.innerText = newRow.Completion_Status;

    // Add the cells to the row 
    row.appendChild(workOrderIDCell);
    row.appendChild(unitIDCell);
    row.appendChild(descriptionCell);
    row.appendChild(submissionDateCell);
    row.appendChild(completionDateCell);
    row.appendChild(completionStatusCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}