use master
go

Use BudgetTracker
go

Create Table Acount(
    AcountID int IDENTITY(1,1) PRIMARY KEY,
    email varchar(max),
    AcountPassword varchar(30)
)

Create Table Users(
    UserID int IDENTITY(1,1) PRIMARY KEY,
    AcountID int FOREIGN KEY REFERENCES Acount(AcountID) On update cascade On delete cascade,
    fname varchar(20),
    lname varchar(20),
    Age int,
    Gender varchar(20),
    UserType varchar(50) CHECK(UserType in ('Student','Business Man','Employee','House Wife'))  
)

Create Table Budget(
    BudgetID int IDENTITY(1,1),
    UserID int FOREIGN KEY REFERENCES Users(UserID) On update cascade On delete cascade,
    PRIMARY KEY(UserID,BudgetID),
    TotalBudget FLOAT DEFAULT(0),
    CurrentAmount FlOAT DEFAULT(0),
    LeftAmount Float DEFAULT(0)
)
-- Rename LeftAmount to UsedAmount
EXEC sp_rename 'Budget.LeftAmount', 'UsedAmount', 'COLUMN';

Create Table Item(
    ItemID int IDENTITY(1,1),
    BudgetID int,
    UserID int,
    FOREIGN KEY(UserID,BudgetID) REFERENCES Budget(UserID,BudgetID) On update cascade On delete cascade,
    PRIMARY KEY(UserID,BudgetID,ItemID),
    ItemName varchar(Max),
    Amount FLOAT
)

Select * from Acount;
Select * from Users;
Select * from Budget;
Select * from Item;

--Procedures
--1, For User Login i.e. Sign-in with already made acount
GO
Create Procedure Loggin
@email varchar(max),
@password varchar(30),
@message varchar(max) output
as begin

if exists(Select 1 from Acount where @email = email and @password = AcountPassword)
BEGIN
set @message = 'Login Successful';
end

else if exists(Select 1 from Acount where @email = email and @password <> AcountPassword)
BEGIN
set @message = 'Wrong Password';
end

else if not exists(Select 1 from Acount where @email = email)
BEGIN
set @message = 'Email does not exist';
END

END

declare @msg varchar(max);
exec Loggin 'arham@gmail.com','hello',@msg output;
print(@msg);