//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addPaymentTypeForm = document.getElementById('add-payment-type-form-ajax');

// Modify the objects we need
addPaymentTypeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPaymentTypeID = document.getElementById("input-paymentTypeID");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let paymentTypeIDValue = inputPaymentTypeID.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        Payment_Type: paymentTypeIDValue,
        Description: descriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-payment-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            window.location.reload();

            // Clear the input fields for another transaction
            inputPaymentTypeID.value = '';
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


// Creates a single row from an Object representing a single record from PaymentTypes
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("payment-type-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let paymentTypeIDCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    // Fill the cells with correct data
    paymentTypeIDCell.innerText = newRow.Payment_Type;
    descriptionCell.innerText = newRow.Description;

    // Add the cells to the row 
    row.appendChild(paymentTypeIDCell);
    row.appendChild(descriptionCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}