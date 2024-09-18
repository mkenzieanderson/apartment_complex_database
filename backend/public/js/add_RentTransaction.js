//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addRentTransactionForm = document.getElementById('add-rent-transaction-form-ajax');

// Modify the objects we need
addRentTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputResidentID = document.getElementById("input-residentID");
    let inputDate = document.getElementById("input-date");
    let inputAmount = document.getElementById("input-amount");
    let inputPaymentType = document.getElementById("input-paymentType");

    // Get the values from the form fields
    let residentIDValue = inputResidentID.value;
    let dateValue = inputDate.value;
    let amountValue = inputAmount.value;
    let paymentTypeValue = inputPaymentType.value;


    // Put our data we want to send in a javascript object
    let data = {
        Resident_ID: residentIDValue,
        Date: dateValue,
        Amount: amountValue,
        Payment_Type: paymentTypeValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-rent-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputResidentID = '';
            inputDate = '';
            inputAmount = '';
            inputPaymentType = '';

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from RentTransactions
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("rent-transactions-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 8 cells
    let row = document.createElement("TR");
    let transactionIDCell = document.createElement("TD");
    let residentIDCell = document.createElement("TD");
    let residentLastNameCell = document.createElement("TD");
    let residentFirstNameCell = document.createElement("TD");
    let unitCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let amountCell = document.createElement("TD");
    let paymentTypeCell = document.createElement("TD");

    // Fill the cells with correct data
    transactionIDCell.innerText = newRow.Transaction_ID;
    residentIDCell.innerText = newRow.Resident_ID;
    residentLastNameCell.innerText = newRow.Resident_Last_Name;
    residentFirstNameCell.innerText = newRow.Resident_First_Name;
    unitCell.innerText = newRow.Unit;
    dateCell.innerText = newRow.Date;
    amountCell.innerText = newRow.Amount;
    paymentTypeCell.innerText = newRow.Payment_Type;

    // Add the cells to the row 
    row.appendChild(transactionIDCell);
    row.appendChild(residentIDCell);
    row.appendChild(residentLastNameCell);
    row.appendChild(residentFirstNameCell);
    row.appendChild(unitCell);
    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(paymentTypeCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}