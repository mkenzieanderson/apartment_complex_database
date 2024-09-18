//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('update-employee-form-ajax');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmployeeID = document.getElementById("input-employeeID-update");
    let inputLastName = document.getElementById("input-lastName-update");
    let inputFirstName = document.getElementById("input-firstName-update");
    let inputIsActive = document.getElementById("input-isActive-update");
    let inputPhone = document.getElementById("input-phone-update");
    let inputEmail = document.getElementById("input-email-update");

    // Get the values from the form fields
    let employeeIDValue = inputEmployeeID.value;
    let lastNameValue = inputLastName.value;
    let firstNameValue = inputFirstName.value;
    let isActiveValue = inputIsActive.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        Employee_ID: employeeIDValue,
        Last_Name: lastNameValue,
        First_Name: firstNameValue,
        Active_Status: isActiveValue,
        Phone: phoneValue,
        Email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-employee-ajax", true);
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