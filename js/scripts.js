
// Create New User Account
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







// user.transactions[user.transactions.length] = new Transaction('12/25/16', 'Fred Meyer', '$35.17');
//
// var anotherTrans =new Transaction('12/25/10', 'Meijer', '$35.34');


// Search Accounts On Login
// for (var i = 0; i < array.length; i++) {
//   if (newUser[i].userName === 'dafunk'){
//     // success!!!!!
//     // return newUser[i];
//   }
// }



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
  $('#account-creator').submit(function(event){
    event.preventDefault();
    console.log('test');

    var accountNumber = 0989087;
    var newUserName = $('input#new-username').val();
    var newPassword = $('input#new-password').val();
    var newFirstName = $('input#new-first').val();
    var newLastName = $('input#new-last').val();
    var newEmail = $('input#new-email').val();
    var newStreet = $('input#new-street').val();
    var newCity = $('input#new-city').val();
    var newState = $('input#new-state').val();
    var newZip = $('input#new-zip').val();

    var newAddress = new Address(newStreet, newCity, newState, newZip);
    console.log(newAddress)
    var newUser = new User(newUserName, newFirstName, newLastName, accountNumber, newEmail, newAddress);
    console.log(newUser);
    $('input#new-password').val("");
    $('input#new-username').val("");
    $('input#new-first').val("");
    $('input#new-last').val("");
    $('input#new-email').val("");
    $('input#new-street').val("");
    $('input#new-city').val("");
    $('input#new-state').val("");
    $('input#new-zip').val("");

      accountCounter++;

  });
  // $('#accountLogin').submit(function(event){
  //   event.preventDefault();
  //   var username = $('input#username').val();
  //   var password = $('input#password').val();
  //   currentUser = verifyUser(username, password);
  //   $("#balance").append("<p class='displayAccount'>" + currentUser[0].user + ", Current Balance: " + currentUser[0].balance + "</p>");;
  //   $('input#username').val("");
  //   $('input#password').val("");
  // });
  // $('#add').click(function() {
  //   currentUser[0][2] + 5;
  //   currentUser[0].deposit();
  //   localStorage.setItem(currentUser[1],currentUser);
  // });
});
