function User (userName, firstName, lastName, accountNumber, email, address) {
  this.userName = userName;
  this.firstName = firstName;
  this.lastName = lastName;
  this.accountNumber = accountNumber;
  this.email = email;
  this.address = address;
  this.transactions = [];
}

function Address (street, city, state, zip) {
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zip;
}

function Transaction (date, location, amount) {
  this.date = date;
  this.loc = location;
  this.amount = amount;
}
var newUserName = 'dafunk';
var newFirstName = 'Matt';
var newLastName = 'Nic';
var newEmail = 'funkyTown@fake.com';
var accountNumber = 3452;
var newAddress = new Address("123 west", "town", "MI", 97201);
var user = new User(newUserName, newFirstName, newLastName, accountNumber, newEmail, newAddress);

// user.transactions[user.transactions.length] = new Transaction('12/25/16', 'Fred Meyer', '$35.17');
//
// var anotherTrans =new Transaction('12/25/10', 'Meijer', '$35.34');




// Back End Logix
// function BankAccount(name, password, accountNumber){
//   this.user = name;
//   this.password = password;
//   this.balance = 20;
//   this.accountNumber = accountNumber;
// }
// var accounts = [];

// var userWithdrawl = 5;
// BankAccount.prototype.withdrawl = function () {
//   return this.balance - userWithdrawl;
// }
// var userDeposit = 5;
// BankAccount.prototype.deposit = function(){
//   return this.balance + userDeposit;
// }

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
// Confirm unique username
function findDuplicate(userName) {
  var userTest = localStorage.getItem(userName)
  console.log(userTest)
  if (userTest === null) {
    return true;
  }
}
// Verify user and password
function verifyUser(username, password) {
  var userTest = localStorage.getItem(username)
  if (userTest === null) {
    return alert('Username not found');
  } else {
    userTest = JSON.parse(userTest);
    if (userTest[0].password === password) {
      return userTest;
    } else {
      alert("Please enter the correct Password")
    }
    console.log(userTest);
  }
}


// JSON.parse(retrievedObject));

// Front end Logic
$(document).ready(function(){
  var currentUser;
  var accountCounter = 1;

  $('#goToLogin').click(function() {
    $('#accountCreator').hide();
    $('#accountLogin').show();
  });
  $('#goToCreate').click(function() {
    $('#accountLogin').hide();
    $('#accountCreator').show();
  });
  $('#home').click(function() {
    $('#accountLogin').hide();
    $('#accountCreator').hide();
  });

  $('#accountCreator').submit(function(event){
    event.preventDefault();

    var accountIndex = 'userAccount' + accountCounter;
    var newUsername = $('input#newUsername').val();
    var newPassword = $('input#newPassword').val();
    $('input#newPassword').val("");
    $('input#newUsername').val("");

    if(findDuplicate(newUsername)) {
      var newAccount = new BankAccount(newUsername, newPassword, accountCounter)
      accounts.push([newAccount, newUsername]);
      localStorage.setItem(newUsername, JSON.stringify(accounts[accountCounter - 1]));
      accountCounter++;
      } else {
        alert("please use a unique Username");
      }
  });
  $('#accountLogin').submit(function(event){
    event.preventDefault();

    var username = $('input#username').val();
    var password = $('input#password').val();
    currentUser = verifyUser(username, password);
    $("#balance").append("<p class='displayAccount'>" + currentUser[0].user + ", Current Balance: " + currentUser[0].balance + "</p>");
    $('input#username').val("");
    $('input#password').val("");
  });
  // $('#add').click(function() {
  //   currentUser[0][2] + 5;
  //   currentUser[0].deposit();
  //   localStorage.setItem(currentUser[1],currentUser);
  // });
});
