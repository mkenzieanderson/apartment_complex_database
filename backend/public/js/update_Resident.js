//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let updateResidentForm = document.getElementById('update-resident-form-ajax');

// Modify the objects we need
updateResidentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputUnit = document.getElementById("input-unit-update");
    let inputIsActive = document.getElementById("input-isActive-update");
    let inputPhone = document.getElementById("input-phone-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputLeaseStart = document.getElementById("input-leaseStart-update");
    let inputLeaseEnd = document.getElementById("input-leaseEnd-update");
    let inputLicensePlate = document.getElementById("input-licensePlate-update");
    let inputPets = document.getElementById("input-pet-update");


    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let unitValue = inputUnit.value;
    let isActiveValue = inputIsActive.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;
    let leaseStartValue = inputLeaseStart.value;
    let leaseEndValue = inputLeaseEnd.value;
    let licensePlateValue = inputLicensePlate.value;
    let petValue = inputPets.value;

    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        unit: unitValue,
        isActive: isActiveValue,
        phone: phoneValue,
        email: emailValue,
        leaseStart: leaseStartValue,
        leaseEnd: leaseEndValue,
        licensePlate: licensePlateValue,
        hasPets: petValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-resident-ajax", true);
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