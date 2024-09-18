//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

// Get the objects we need to modify
let updateWorkAssignmentForm = document.getElementById('update-workAssignment-form-ajax');

// Modify the objects we need
updateWorkAssignmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWorkAssignmentID = document.getElementById("mySelect");
    let inputEmployeeID = document.getElementById("input-employee-update");



    // Get the values from the form fields
    let workAssignmentIDValue = inputWorkAssignmentID.value;
    let employeeIDValue = inputEmployeeID.value;


    // Put our data we want to send in a javascript object
    let data = {
        workAssignmentID: workAssignmentIDValue,
        employeeID: employeeIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-workAssignment-ajax", true);
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