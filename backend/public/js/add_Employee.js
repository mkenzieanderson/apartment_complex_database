//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLastName = document.getElementById("input-lastName");
    let inputFirstName = document.getElementById("input-firstName");
    let inputIsActive = document.getElementById("input-isActive");
    let inputPhone = document.getElementById("input-phone");
    let inputEmail = document.getElementById("input-email");


    // Get the values from the form fields
    let lastNameValue = inputLastName.value;
    let firstNameValue = inputFirstName.value;
    let isActiveValue = inputIsActive.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {

        Last_Name: lastNameValue,
        First_Name: firstNameValue,
        Active_Status: isActiveValue,
        Phone: phoneValue,
        Email: emailValue
    }
    
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLastName.value = '';
            inputFirstName.value = '';
            inputIsActive.value = '';
            inputPhone.value = '';
            inputEmail.value = '';

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from MaintenanceEmployees
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("employees-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let lastNameCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let isActiveCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    // Fill the cells with correct data
    lastNameCell.innerText = newRow.Last_Name;
    firstNameCell.innerText = newRow.First_Name;
    isActiveCell.innerText = newRow.Active_Status;
    phoneCell.innerText = newRow.Phone;
    emailCell.innerText = newRow.Email;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEmployee(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(lastNameCell);
    row.appendChild(firstNameCell);
    row.appendChild(isActiveCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
