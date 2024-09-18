//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addResidentForm = document.getElementById('add-resident-form-ajax');

// Modify the objects we need
addResidentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUnitID = document.getElementById("input-unitID");
    let inputLastName = document.getElementById("input-lastName");
    let inputFirstName = document.getElementById("input-firstName");
    let inputIsActive = document.getElementById("input-isActive");
    let inputPhone = document.getElementById("input-phone");
    let inputEmail = document.getElementById("input-email");
    let inputLeaseStart = document.getElementById("input-leaseStart");
    let inputLeaseEnd = document.getElementById("input-leaseEnd");
    let inputLicensePlate = document.getElementById("input-licensePlate");
    let inputPet = document.getElementById("input-pet");


    // Get the values from the form fields
    let unitIDValue = inputUnitID.value;
    let lastNameValue = inputLastName.value;
    let firstNameValue = inputFirstName.value;
    let isActiveValue = inputIsActive.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;
    let leaseStartValue = inputLeaseStart.value;
    let leaseEndValue = inputLeaseEnd.value;
    let licensePlateValue = inputLicensePlate.value;
    let petValue = inputPet.value;


    // Put our data we want to send in a javascript object
    let data = {
        Unit: unitIDValue,
        Last_Name: lastNameValue,
        First_Name: firstNameValue,
        Active_Status: isActiveValue,
        Phone: phoneValue,
        Email: emailValue,
        Lease_Start_Date: leaseStartValue,
        Lease_End_Date: leaseEndValue,
        License_Plate: licensePlateValue,
        Has_Pets: petValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-resident-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            window.location.reload();

            // Clear the input fields for another transaction
            inputUnitID.value = '';
            inputLastName.value = '';
            inputFirstName.value = '';
            inputIsActive.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputLeaseStart.value = '';
            inputLeaseEnd.value = '';
            inputLicensePlate.value = '';
            inputPet.value = '';

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Residents
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("residents-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 11 cells
    let row = document.createElement("TR");
    let unitIDCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let isActiveCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let leaseStartCell = document.createElement("TD");
    let leaseEndCell = document.createElement("TD");
    let licensePlateCell = document.createElement("TD");
    let petCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    unitIDCell.innerText = newRow.Unit;
    lastNameCell.innerText = newRow.Last_Name;
    firstNameCell.innerText = newRow.First_Name;
    isActiveCell.innerText = newRow.Active_Status;
    phoneCell.innerText = newRow.Phone;
    emailCell.innerText = newRow.Email;
    leaseStartCell.innerText = newRow.Lease_Start_Date;
    leaseEndCell.innerText = newRow.Lease_End_Date;
    licensePlateCell.innerText = newRow.License_Plate;
    petCell.innerText = newRow.Has_Pets;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteResident(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(unitIDCell);
    row.appendChild(lastNameCell);
    row.appendChild(firstNameCell);
    row.appendChild(isActiveCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(leaseStartCell);
    row.appendChild(leaseEndCell);
    row.appendChild(licensePlateCell);
    row.appendChild(petCell);
    row.appendChild(deleteCell);

    
    // Add the row to the table
    currentTable.appendChild(row);
}