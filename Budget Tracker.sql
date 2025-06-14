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
--Add another column
Alter TABLE Budget
add BudgetName varchar(max);

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

--2, For User Login i.e. Sign-in first time
Go
Create PROCEDURE SignIn
@fname varchar(20),
@lname varchar(20),
@Age int,
@Gender varchar(20),
@UserType varchar(50),
@email varchar(max),
@password varchar(30),
@message varchar(max) output
as BEGIN

if not exists(Select 1 from Acount where email = @email)
begin
Insert into Acount(email,AcountPassword)
values(@email,@password);

declare @AcountID int;
set @AcountID = SCOPE_IDENTITY();

Insert into Users(AcountID,fname,lname,Age,Gender,UserType)
values(@AcountID,@fname,@lname,@Age,@Gender,@UserType);

set @message = 'Acount made Successfuly';
end

ELSE
BEGIN
set @message = 'Acount with this email already exist';
END

END

declare @msg2 varchar(max);
exec SignIn 'James','Hilton',20,'Male','Student','james123@gmail.com','hello',@msg2 output;
print (@msg2);

Select * from Acount;
Select * from Users;

--3 Add Budget
GO
Create Procedure AddBudget
@UserID int,
@BudgetName varchar(max),
@BudgetAmount float,
@message varchar(max) output
as begin

if not exists(Select 1 from Budget where UserID = @UserID and BudgetName = @BudgetName)
BEGIN
Insert into Budget(UserID,BudgetName,TotalBudget,CurrentAmount)
VALUES (@UserID,@BudgetName,@BudgetAmount,@BudgetAmount);
set @message = 'Budget Added Successfuly';
end

ELSE
BEGIN
set @message = 'Budget with this name already exist';
end

END

declare @msg3 varchar(max);
exec AddBudget 1,'Hostel Expense',3000,@msg3 output;
print (@msg3);
Select * from Budget;

--4 Delete Budget
GO
Create Procedure DeleteBudget
@UserID int,
@BudgetID int
as begin

if exists (Select 1 from Budget where UserID = @UserID and BudgetID = @BudgetID)
BEGIN
Delete from Budget
where UserID = @UserID and BudgetID = @BudgetID;
END

END

--5 Add Items to a budget
GO
Create PROCEDURE AddItems
@UserID int,
@BudgetID int,
@Name varchar(max),
@Amount float,
@message varchar(max) OUTPUT
as BEGIN

if exists(Select 1 from Budget where UserID = @UserID and BudgetID = @BudgetID
          and @Amount<=CurrentAmount)
BEGIN
Insert into Item(UserID,BudgetID,ItemName,Amount)
values (@UserID,@BudgetID,@Name,@Amount);

Update Budget
set CurrentAmount = CurrentAmount - @Amount,
    UsedAmount = UsedAmount + @Amount
where UserID = @UserID and BudgetID = @BudgetID;

set @message = 'Item Added Successfuly';
END

ELSE
BEGIN
set @message = 'Error! The Item Amount is greater than Budget';
end

END

declare @msg4 varchar(max);
exec AddItems 1,1,'Dinner',200,@msg4 output;
print (@msg4);
Select * from Budget;
Select * from Item;

--6 Delete Items from a Budget
Go
Create Procedure DeleteItem
@ItemID int
as BEGIN

if exists (Select 1 from Item where ItemID = @ItemID)
BEGIN
declare @BudgetID int;
declare @Amount float;
Select @BudgetID = BudgetID , @Amount = Amount from Item
where ItemID = @ItemID;

Delete from Item
where ItemID = @ItemID;

Update Budget
set CurrentAmount = CurrentAmount + @Amount,
    UsedAmount = UsedAmount - @Amount
where BudgetID = @BudgetID;
END

ELSE
begin
print('Error! Item does not exists');
end

END

exec DeleteItem 2;
Select * from Budget;
Select * from Item;

--7 Update ItemPrice for a budget
GO
Create Procedure UpdateItemPrice
@ItemID int,
@NewAmount float,
@message varchar(max) output
as BEGIN

if exists(Select 1 from Item where ItemID = @ItemID)
BEGIN
declare @PrevAmount float;
declare @BudgetID int;
Select @PrevAmount = Amount, @BudgetID = BudgetID from Item
where ItemID = @ItemID;

-- Case 1: 300 > 250
if (@NewAmount > @PrevAmount)
BEGIN
declare @UpdatedAmount float;
set @UpdatedAmount = @NewAmount - @PrevAmount;

if exists (Select 1 from Budget where BudgetID = @BudgetID and (UsedAmount + @UpdatedAmount)<=TotalBudget)
BEGIN
Update Budget
set UsedAmount = UsedAmount + @UpdatedAmount,
    CurrentAmount = CurrentAmount - @UpdatedAmount
where BudgetID = @BudgetID;

Update Item
set Amount = @NewAmount
where ItemID = @ItemID;

set @message = 'Item Amount and Budget updated successfuly!';
END

ELSE
BEGIN
set @message = 'Error! Not Enough Budget';
END

END

-- Case 2: 200 < 250
else if(@NewAmount < @PrevAmount)
BEGIN
declare @UpdatedAmount2 float;
set @UpdatedAmount2 = @PrevAmount - @NewAmount;

if exists (Select 1 from Budget where BudgetID = @BudgetID and (CurrentAmount + @UpdatedAmount2)<=TotalBudget)
BEGIN
Update Budget
set UsedAmount = UsedAmount - @UpdatedAmount2,
    CurrentAmount = CurrentAmount + @UpdatedAmount2
where BudgetID = @BudgetID;

Update Item
set Amount = @NewAmount
where ItemID = @ItemID;

set @message = 'Item Amount and Budget updated successfuly!';
END

ELSE
BEGIN
set @message = 'Error! Not Enough Budget';
END

END

END
END

declare @msg5 varchar(max);
exec UpdateItemPrice 1,250,@msg5 output;
print (@msg5);
Select * from Budget;
Select * from Item;