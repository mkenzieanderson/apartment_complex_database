//<-- SOURCE CODE CITATIONS -->

//<-- Date: 05/08/2024 -->
//<-- Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app -->

function deleteWorkAssignment(workAssignmentID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: workAssignmentID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-workAssignment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(workAssignmentID);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(workAssignmentID){

    let table = document.getElementById("workAssignments-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == workAssignmentID) {
            table.deleteRow(i);
            break;
       }
    }
}