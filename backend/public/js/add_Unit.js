//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let addUnitForm = document.getElementById('add-unit-form-ajax');

// Modify the objects we need
addUnitForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUnitID = document.getElementById("input-unitID");
    let inputVacancyStatus = document.getElementById("input-isVacant");
    let inputRentPrice = document.getElementById("input-rent");
    let inputBedrooms = document.getElementById("input-roomCount");
    let inputBathrooms = document.getElementById("input-bathCount");
    let inputSQFT = document.getElementById("input-sqft");


    // Get the values from the form fields
    let unitIDValue = inputUnitID.value;
    let vacancyStatusValue = inputVacancyStatus.value;
    let rentPriceValue = inputRentPrice.value;
    let bedroomsValue = inputBedrooms.value;
    let bathroomsValue = inputBathrooms.value;
    let sqftValue = inputSQFT.value;


    // Put our data we want to send in a javascript object
    let data = {
        Unit: unitIDValue,
        Vacancy_Status: vacancyStatusValue,
        Rent_Price: rentPriceValue,
        Bedrooms: bedroomsValue,
        Bathrooms: bathroomsValue,
        SQFT: sqftValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-unit-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUnitID.value = '';
            inputVacancyStatus.value = '';
            inputRentPrice.value = '';
            inputBedrooms.value = '';
            inputBathrooms.value = '';
            inputSQFT.value = '';

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Units
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("units-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let unitIDCell = document.createElement("TD");
    let vacancyStatusCell = document.createElement("TD");
    let rentPriceCell = document.createElement("TD");
    let bedroomsCell = document.createElement("TD");
    let bathroomsCell = document.createElement("TD");
    let sqftCell = document.createElement("TD");

    // Fill the cells with correct data
    unitIDCell.innerText = newRow.Unit;
    vacancyStatusCell.innerText = newRow.Vacancy_Status;
    rentPriceCell.innerText = newRow.Rent_Price;
    bedroomsCell.innerText = newRow.Bedrooms;
    bathroomsCell.innerText = newRow.Bathrooms;
    sqftCell.innerText = newRow.SQFT;

    // Add the cells to the row 
    row.appendChild(unitIDCell);
    row.appendChild(vacancyStatusCell);
    row.appendChild(rentPriceCell);
    row.appendChild(bedroomsCell);
    row.appendChild(bathroomsCell);
    row.appendChild(sqftCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}