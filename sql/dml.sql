-- SOURCE CODE CITATION
-- Date: 05/05/2024
-- Adapted from: https://canvas.oregonstate.edu/courses/1958399/assignments/9589658?module_item_id=24181850 


-- -----------------------------------------------------
-- Data Manipulation Queries for Group 48
-- Mackenzie Anderson & Nolan Reichkitzer
-- -----------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Create, Read, and Update Queries for the Units entity
-- -----------------------------------------------------

-- Get all Units and their information for the Units page display operation
SELECT unitID AS Unit, isVacant AS Vacancy_Status, rent AS Rent_Price, roomCount AS Bedrooms, bathCount AS Bathrooms, sqft AS Sqft FROM Units;

-- Add a new Unit to the database with user input that is collected from the add form on the Units page
INSERT INTO Units (unitID, isVacant, rent, roomCount, bathCount, sqft) 
VALUES ('${data.Unit}', '${data.Vacancy_Status}', '${data.Rent_Price}', '${data.Bedrooms}', '${data.Bathrooms}', '${data.SQFT}');

-- Update an existing Unit with user input from the update form on the Units page
UPDATE Units SET isVacant = IF('${data.Vacancy_Status}'='', isVacant, '${data.Vacancy_Status}'), rent = IF('${data.Rent_Price}'='', rent, '${data.Rent_Price}'), 
roomCount = IF('${data.Bedrooms}'='', roomCount, '${data.Bedrooms}'), bathCount = IF('${data.Bathrooms}'='', bathCount, '${data.Bathrooms}'), sqft = IF('${data.SQFT}'='', sqft, '${data.SQFT}') 
WHERE unitID = '${data.Unit}';



-- -----------------------------------------------------
-- Create, Read, and Update Queries for the Residents entity
-- -----------------------------------------------------

-- Get all Resident Full Names for a dropdown menu in the Resident Update operation
SELECT residentID, CONCAT(firstName, ' ', lastName) AS Full_Name FROM Residents;

-- Get all Units for a dropdown menu in the Resident Add and Update operations
SELECT unitID FROM Units;

-- Get all Residents and their information for the Residents display operation 
SELECT residentID, unitID AS Unit, lastName AS Last_Name, firstName AS First_Name, isActive AS Active_Status, phone AS Phone, email AS Email,
leaseStart AS Lease_Start_Date, leaseEnd AS Lease_End_Date, licensePlate AS License_Plate, pet AS Has_Pets FROM Residents;

-- Add a new Resident to the database with user input that is collected from the add form on the Residents page
INSERT INTO Residents (unitID, lastName, firstName, isActive, phone, email, leaseStart, leaseEnd, licensePlate, pet) 
VALUES (IF('${data.Unit}'='NULL', null, '${data.Unit}'), '${data.Last_Name}', '${data.First_Name}', ${Active_Status}, '${data.Phone}', '${data.Email}', '${data.Lease_Start_Date}', '${data.Lease_End_Date}', '${data.License_Plate}', ${Has_Pets});

-- Update an existing Resident's information via user input from the update form on the Residents page
UPDATE Residents SET unitID = IF('${data.unit}'='NULL', null, IF('${data.unit}'='', unitID, '${data.unit}')), isActive = IF(${isActive} = '2', isActive, ${isActive}), phone = IF('${data.phone}'='', phone, '${data.phone}'),
email = IF('${data.email}'='', email, '${data.email}'), leaseStart = IF('${data.leaseStart}'='', leaseStart, '${data.leaseStart}'), leaseEnd = IF('${data.leaseEnd}'='', leaseEnd, '${data.leaseEnd}'), licensePlate = '${data.licensePlate}',
pet = IF(${hasPets} = 2, pet, ${hasPets})
WHERE residentID=${residentID};

-- Delete an existing Resident's information via the residentID pk that is user-selected from the Residents page
DELETE FROM Residents WHERE residentID = '${residentID}';



-- -----------------------------------------------------
-- Create and Read Queries for the PaymentTypes entity
-- -----------------------------------------------------

-- Get all PaymentTypes and their descriptions for the Payment Types page display operation
SELECT paymentTypeID AS Payment_Type, description AS Description FROM PaymentTypes;

-- Add a new Payment Type to the database with user input that is collected from the add form on the Payment Types page
INSERT INTO PaymentTypes (paymentTypeID, description) 
VALUES ('${data.Payment_Type}', '${data.Description}');



-- -----------------------------------------------------
-- Create and Read Queries for the RentTransactions entity
-- -----------------------------------------------------

-- Create a dropdown menu of Residents to ease the update operation. Only display Active residents.
-- Therefore, the user does not need to know the residentID value. Rather, they can select a resident by full name
-- JavaScript function will need to be able to extract the first and last name from this concantenation such that the residentID can be found
SELECT residentID, CONCAT(firstName, ' ', lastName) AS Full_Name FROM Residents WHERE isActive = 1;

-- Create a dropdown menu of PaymentTypes for error-free insertion operations
SELECT paymentTypeID AS Payment_Types FROM PaymentTypes;

-- Get all RentTransactions and their information for the Rent Transactions page display operation
SELECT RentTransactions.rentTransactionID AS Transaction_ID, RentTransactions.residentID AS Resident_ID, Residents.lastName AS Resident_Last_Name, Residents.firstName AS Resident_First_Name,
RentTransactions.unitID as Unit, RentTransactions.date AS Date, RentTransactions.amount AS Amount, RentTransactions.paymentType AS Payment_Type FROM RentTransactions
INNER JOIN Residents ON RentTransactions.residentID = Residents.residentID ORDER BY Transaction_ID;

-- Add a new Rent Transaction to the database with user input that is collected from the add form on the Rent Transactions page
INSERT INTO RentTransactions (residentID, unitID, date, amount, paymentType)
VALUES ('${data.Resident_ID}', (SELECT unitID from Residents WHERE residentID = '${data.Resident_ID}'), '${data.Date}', '${data.Amount}', '${data.Payment_Type}');



-- -----------------------------------------------------
-- Create, Read, Update, and Delete Queries for the MaintenanceEmployees entity
-- -----------------------------------------------------

-- Get all Maintenance Employees by full name for Add and Update dropdown menus
SELECT employeeID, CONCAT(firstName, ' ', lastName) AS Full_Name FROM MaintenanceEmployees;

-- Get all MaintenanceEmployees and their information for the Maintenance Employees page display operation
SELECT employeeID AS Employee_ID, lastName AS Last_Name, firstName as First_Name, isActive AS Active_Status, phone as Phone, email as Email FROM MaintenanceEmployees;

-- Add a new Maintenance to the database with user input that is collected from the add form on the Employees page
INSERT INTO MaintenanceEmployees (lastName, firstName, isActive, phone, email) 
VALUES ('${data.Last_Name}', '${data.First_Name}', ${data.Active_Status}, '${data.Phone}', '${data.Email}');

-- Update an existing MaintenanceEmployee via user input that is collected from the update form on the Maintenance Employees Page
UPDATE MaintenanceEmployees SET lastName = IF('${data.Last_Name}'='', lastName, '${data.Last_Name}'), firstName = IF('${data.First_Name}'='', firstName, '${data.First_Name}'), 
isActive = IF('${data.Active_Status}'='', isActive, '${data.Active_Status}'), phone = IF('${data.Phone}'='', phone, '${data.Phone}'), email = IF('${data.Email}'='', 
email, '${data.Email}') WHERE employeeID = '${data.Employee_ID}';

-- Delete an existing MaintenanceEmployee via the employeeID value that is user-selected from the Maintenance Employees Page
DELETE FROM MaintenanceEmployees WHERE employeeID = :employeeID_selected_from_page;


-- -----------------------------------------------------
-- Create, Read, and Update Queries for the WorkOrders entity
-- -----------------------------------------------------

-- Get all Units for a unit dropdown menun for the Add and Update operations
SELECT unitID FROM Units;

-- Get all uncompleted WorkOrders for a dropdown menu for the Update operation
SELECT workOrderID AS Work_Order_ID FROM WorkOrders WHERE isCompleted = 0;

-- Get all WorkOrders and their information for the Work Orders page display operation
SELECT workOrderID AS Work_Order_ID, unitID AS Unit, description AS Description, submissionDate AS Submission_Date, completionDate AS Completion_Date, 
isCompleted AS Completion_Status FROM WorkOrders;

-- Add a new WorkOrder using user input from the add form on the Work Orders page
INSERT INTO WorkOrders (unitID, description, submissionDate, completionDate, isCompleted)
VALUES (IF('${data.Unit}'='NULL', null, '${data.Unit}'), '${data.Description}', '${data.Submission_Date}', null, '${data.Completion_Status}');

-- Update an existing WorkOrder with user input from the update form on the Work Orders page
UPDATE WorkOrders SET description = IF('${data.Description}'='', description, '${data.Description}'), unitID = IF('${data.Unit}'='NULL', null, IF('${data.Unit}'='', unitID, '${data.Unit}')),
completionDate = '${data.Completion_Date}', isCompleted = '${data.Completion_Status}' WHERE workOrderID = '${data.Work_Order_ID}';


-- -----------------------------------------------------
-- Create, Read, Update, and Delete Queries for the EmployeeHasWorkOrders entity
-- -----------------------------------------------------

-- Create a dropdown menu of MaintenanceEmployees by full name. Only display active employees.
-- Therefore, the user is not required to memorize employeeID numbers when adding a new EmployeeHasWorkOrders
SELECT employeeID, CONCAT(firstName, ' ', lastName) AS Employee_Name FROM MaintenanceEmployees WHERE isActive = 1;

-- Create a dropdown menu of WorkOrders by Unit and Date. Only display the work orders that are still in progress.
-- Therefore, the user is not required to memorize employeeID numbers when adding a new EmployeeHasWorkOrders
SELECT workOrderID, CONCAT(unitID, ' ', submissionDate) AS Work_Order_Unit_And_Submission_Date FROM WorkOrders WHERE isCompleted = 0; 

-- Create a dropdown menu of Work Assignments by Unit, Date, and Assigned Employee. Only display the Work Assignments
-- where the work orders have not been completed.
SELECT EmployeeHasWorkOrders.workAssignmentID, WorkOrders.workOrderID, CONCAT(WorkOrders.unitID, ' ', WorkOrders.submissionDate) AS Work_Order_Unit_And_Submission_Date, 
CONCAT(MaintenanceEmployees.firstName, ' ', MaintenanceEmployees.lastName) AS Employee_Name 
FROM EmployeeHasWorkOrders 
INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID 
INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID WHERE WorkOrders.isCompleted = 0;

-- Get all EmployeeHasWorkOrders and their information for the Work Assignments page display operation
SELECT workAssignmentID, MaintenanceEmployees.lastName AS Employee_Last_Name, MaintenanceEmployees.firstName AS Employee_First_Name, WorkOrders.unitID AS Unit, 
WorkOrders.submissionDate AS Date, WorkOrders.description AS Description, WorkOrders.isCompleted AS Completion_Status FROM EmployeeHasWorkOrders 
INNER JOIN MaintenanceEmployees ON EmployeeHasWorkOrders.employeeID = MaintenanceEmployees.employeeID 
INNER JOIN WorkOrders ON EmployeeHasWorkOrders.workOrderID = WorkOrders.workOrderID;

-- Add a new EmployeeHasWorkOrders with user input from the add form on the Work Assignments page
INSERT INTO EmployeeHasWorkOrders (employeeID, workOrderID) 
VALUES (${employeeID}, ${workOrderID});

-- Update an existing EmployeeHasWorkOrders with user input from the update form on the Work Assignments page
UPDATE EmployeeHasWorkOrders SET employeeID = ${employeeID} 
WHERE workAssignmentID = ${workAssignmentID};

-- Delete an existing EmployeeHasWorkOrders by user-selected workAssignmentID via the Work Assignments Page
DELETE FROM EmployeeHasWorkOrders WHERE workAssignmentID = ${workAssignmentID};


SET FOREIGN_KEY_CHECKS=1;
COMMIT;