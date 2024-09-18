//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let updateUnitForm = document.getElementById('update-unit-form-ajax');

// Modify the objects we need
updateUnitForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUnitID = document.getElementById("input-unit-update");
    let inputVacancyStatus = document.getElementById("input-isVacant-update");
    let inputRentPrice = document.getElementById("input-rent-update");
    let inputBedrooms = document.getElementById("input-roomCount-update");
    let inputBathrooms = document.getElementById("input-bathCount-update");
    let inputSQFT = document.getElementById("input-sqft-update");

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
    xhttp.open("PUT", "/put-unit-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Reload the table
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})