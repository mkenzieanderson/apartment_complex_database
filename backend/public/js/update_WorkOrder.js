//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let updateWorkOrderForm = document.getElementById('update-work-order-form-ajax');

// Modify the objects we need
updateWorkOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWorkOrderID = document.getElementById("input-work-order-update");
    let inputUnitID = document.getElementById("input-unit-update");
    let inputDescription = document.getElementById("input-description-update");
    let inputCompletionDate = document.getElementById("input-completion-date-update");

    // Get the values from the form fields
    let workOrderIDValue = inputWorkOrderID.value;
    let unitIDValue = inputUnitID.value;
    let descriptionValue = inputDescription.value;
    let completionDateValue = inputCompletionDate.value;
    let completionStatusValue = 0

    if (completionDateValue !== '') {
        completionStatusValue = 1
    }

    // Put our data we want to send in a javascript object
    let data = {
        Work_Order_ID: workOrderIDValue,
        Description: descriptionValue,
        Unit: unitIDValue,
        Completion_Date: completionDateValue,
        Completion_Status: completionStatusValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-work-order-ajax", true);
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