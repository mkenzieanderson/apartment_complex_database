-- -----------------------------------------------------
-- Data Definition Queries for Group 48
-- Mackenzie Anderson & Nolan Reichkitzer
-- -----------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Create Units Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Units (
  unitID VARCHAR(4) NOT NULL,
  isVacant TINYINT(1) NOT NULL,
  rent INT(4) NOT NULL,
  roomCount INT(1) NOT NULL,
  bathCount INT(1) NOT NULL,
  sqft INT(4) NOT NULL,
  PRIMARY KEY (unitID)
);

-- -----------------------------------------------------
-- Create Residents Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Residents (
  residentID INT(11) NOT NULL AUTO_INCREMENT,
  unitID VARCHAR(4) NULL,
  lastName VARCHAR(45) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  phone VARCHAR(12) NOT NULL,
  email VARCHAR(120) NOT NULL,
  leaseStart DATE NOT NULL,
  leaseEnd DATE NOT NULL,
  licensePlate VARCHAR(7) NULL,
  pet TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT full_name UNIQUE (firstName, lastName),
  PRIMARY KEY (residentID),
  CONSTRAINT fk_Residents_Units
    FOREIGN KEY (unitID)
    REFERENCES Units (unitID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create PaymentTypes Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PaymentTypes (
  paymentTypeID VARCHAR(45) NOT NULL,
  description VARCHAR(500) NOT NULL,
  PRIMARY KEY (paymentTypeID)
);


-- -----------------------------------------------------
-- Create RentTransactions Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS RentTransactions (
  rentTransactionID INT(11) NOT NULL AUTO_INCREMENT,
  residentID INT(11) NULL,
  unitID VARCHAR(4) NULL,
  date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  paymentType VARCHAR(45) NULL,
  PRIMARY KEY (rentTransactionID),
  CONSTRAINT fk_RentTransactions_Residents
    FOREIGN KEY (residentID)
    REFERENCES Residents (residentID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_RentTransactions_Units
    FOREIGN KEY (unitID)
    REFERENCES Units (unitID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_RentTransactions_PaymentTypes
    FOREIGN KEY (paymentType)
    REFERENCES PaymentTypes (paymentTypeID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create MaintenanceEmployees Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS MaintenanceEmployees (
  employeeID INT(11) NOT NULL AUTO_INCREMENT,
  lastName VARCHAR(45) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  isActive TINYINT(1) NOT NULL,
  phone VARCHAR(12) NOT NULL,
  email VARCHAR(120) NOT NULL,
  PRIMARY KEY (employeeID)
);


-- -----------------------------------------------------
-- Create WorkOrders Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS WorkOrders (
  workOrderID INT(11) NOT NULL AUTO_INCREMENT,
  unitID VARCHAR(4) NULL,
  description VARCHAR(500) NOT NULL,
  submissionDate DATE NOT NULL,
  completionDate DATE NULL,
  isCompleted TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (workOrderID),
  CONSTRAINT fk_WorkOrders_Units
    FOREIGN KEY (unitID)
    REFERENCES Units (unitID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create EmployeeHasWorkOrders Table
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS EmployeeHasWorkOrders (
  workAssignmentID INT(11) NOT NULL AUTO_INCREMENT,
  employeeID INT(11) NOT NULL,
  workOrderID INT(11) NOT NULL,
PRIMARY KEY (workAssignmentID),
  CONSTRAINT fk_MaintenanceEmployeesHasWorkOrders_MaintenanceEmployees
    FOREIGN KEY (employeeID)
    REFERENCES MaintenanceEmployees (employeeID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_MaintenanceEmployeesHasWorkOrders_WorkOrders
    FOREIGN KEY (workOrderID)
    REFERENCES WorkOrders (workOrderID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Insert 5 rows of sample data into each table
-- -----------------------------------------------------
INSERT INTO PaymentTypes (
    paymentTypeID,
    description
)
VALUES 
("Credit Card", "Required information includes card holder namer, card number, expiration date, security code, and billing zip code. Does not take American Express. 2% processing fee."),
("Debit Card", "Required information includes card holder namer, card number, expiration date, security code, and billing zip code. 1.5% processing fee."),
("eCheck", "Required information includes account number and electronic routing number. No processing fees."),
("Personal Check", "Required information includes account holder name, recipient identifier, account number, routing number, and proof of signature. No processing fees."),
("Cashier's Check", "Required information includes recipient identifier, account number, routing number, check number, and proof of signature. No processing fees.");


INSERT INTO Units (
    unitID,
    isVacant,
    rent,
    roomCount,
    bathCount,
    sqft
)
VALUES 
("A142",1,1450,1,1,728),
("A210",0,1385,1,1,688),
("B308",0,1980,2,1,1050),
("A201",1,2100,2,2,1180),
("A116",0,2400,3,2,1245);


INSERT INTO Residents (
    unitID,
    lastName,
    firstName,
    isActive,
    phone,
    email,
    leaseStart,
    leaseEnd,
    licensePlate,
    pet
)
VALUES 
("A201","Nelson","Maria",1,"202-333-5454","maria_22@hello.com","2023-09-30","2024-09-29","ABC1234",0),
("A201","Nelson","Theo",1,"202-414-5454","theooo@mymail.com","2023-09-30","2024-09-29",NULL,0),
(NULL,"Cho","Sarah",0,"328-432-3329","s_cho123@quickmail.com","2018-04-18","2018-10-17",NULL,0),
("B308","Patel","Jay",1,"874-113-4989","jaypatel6@hello.com","2024-03-08","2025-03-07","ZZV0011",0),
("A210","Green","Morgan",1,"404-288-2828","smile_morgan@mymail.com","2024-04-24","2024-05-23","BCD4457",1);


INSERT INTO RentTransactions (
    residentID,
    unitID,
    date,
    amount,
    paymentType
)
VALUES 
((SELECT residentID FROM Residents WHERE Residents.firstName = "Jay" AND Residents.lastName = "Patel"),"B308","2024-03-25",999.99,"eCheck"),
((SELECT residentID FROM Residents WHERE Residents.firstName = "Maria" AND Residents.lastName = "Nelson"),"A201","2024-03-31",1050.00,"Credit Card"),
((SELECT residentID FROM Residents WHERE Residents.firstName = "Theo" AND Residents.lastName = "Nelson"),"A201","2024-04-01",1050.00,"Personal Check"),
((SELECT residentID FROM Residents WHERE Residents.firstName = "Jay" AND Residents.lastName = "Patel"),"B308","2024-04-01",980.01,"eCheck"),
((SELECT residentID FROM Residents WHERE Residents.firstName = "Morgan" AND Residents.lastName = "Green"),"A210","2024-04-02",1385.00,"Cashier's Check");


INSERT INTO MaintenanceEmployees (
    lastName,
    firstName,
    isActive,
    phone,
    email
)
VALUES 
("Lane","Amy",1,"202-660-5505","amy_construction@workmail.com"),
("Smith","Charles",1,"202-851-4455","charles44@hello.com"),
("Johnson","Ryan",0,"440-959-6636","ryry_j@mymail.com"),
("Riley","Sarah",0,"231-233-0001","rileysarah1@quickmail.com"),
("Liu","Justin",1,"989-112-1910","justin_liu0@hello.com");


INSERT INTO WorkOrders (
    unitID,
    description,
    submissionDate,
    completionDate,
    isCompleted
)
VALUES 
("A201","One of the living room windows does not stay open.","2023-10-14","2024-10-16",1),
("A201","Fire alarm makes chirping sounds about every hours.","2023-12-08","2023-12-09",1),
("A210","One of the bathroom vanity hinges is falling off.","2024-04-03","2024-04-04",1),
("B308","Window in the primary bedroom is leaking rainwater.","2024-04-28",NULL,0),
("A201","Dryer is not turning on.","2024-04-30",NULL,0),
(NULL,"Replace the cracked window in the lobby.","2024-06-05",NULL,0);


INSERT INTO EmployeeHasWorkOrders (
    employeeID,
    workOrderID
)
VALUES 
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Ryan" AND MaintenanceEmployees.lastName = "Johnson"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "A201" AND WorkOrders.submissionDate = "2023-10-14")
),
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Justin" AND MaintenanceEmployees.lastName = "Liu"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "A201" AND WorkOrders.submissionDate = "2023-12-08")
),
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Justin" AND MaintenanceEmployees.lastName = "Liu"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "A210" AND WorkOrders.submissionDate = "2024-04-03")
),
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Justin" AND MaintenanceEmployees.lastName = "Liu"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "B308" AND WorkOrders.submissionDate = "2024-04-28")
),
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Amy" AND MaintenanceEmployees.lastName = "Lane"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "B308" AND WorkOrders.submissionDate = "2024-04-28")
),
(
    (SELECT employeeID FROM MaintenanceEmployees WHERE MaintenanceEmployees.firstName = "Charles" AND MaintenanceEmployees.lastName = "Smith"),
    (SELECT workOrderID FROM WorkOrders WHERE WorkOrders.unitID = "A201" AND WorkOrders.submissionDate = "2024-04-30")
);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
