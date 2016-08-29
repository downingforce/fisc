var PROGSTATE = {
  accountNum: 500,
  Users: [],
  StateName: "fiscState"
};

function USER(userProfile){
    this.userProfile = userProfile;
    this.transactions = [];
    this.accountNumber;
}

function UserProfile (userName, password, firstName, lastName, email, address) {
    this.userName = userName;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
}
function Address (street, city, state, zip) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
}
function Transaction (id, date, description, amount, tag) {
    this.transactionID = id;
    this.date = date;
    this.desc = description;
    this.amount = amount;
    this.tag = tag;
}

function populateTransactions(jsonArray, currentUser) {
  var transactionID;
  for(var i=0; i<jsonArray.length; ++i){
    var transaction = new Transaction (jsonArray[i].transactionID, jsonArray[i].date, jsonArray[i].desc, jsonArray[i].amount, jsonArray[i].tag)
    currentUser.transactions.push(transaction);
  }
}

// Send User to localStorage, with accountNumber as identifier
function storeUser(User){
  localStorage.setItem(User.accountNumber, JSON.stringify(User));
}

USER.prototype.addTransaction = function(id, date, description, amount, tag) {
    var newTransaction = new Transaction(id, date, description, amount, tag);
    mainUSER.transactions.push(newTransaction)
}

// Retrieve User from localStorage, with accountNumber as identifier
function retrieveUser(LSNAME) {
  var lsArray = JSON.parse(localStorage.getItem(LSNAME));
  var address = new Address (lsArray.address.street, lsArray.address.city, lsArray.address.state, lsArray.address.zip);
  var retrievedUser = new User (lsArray.userName, lsArray.firstName, lsArray.lastName, lsArray.accountNumber, lsArray.email, address);
  for(var i=0; i<lsArray.transactions.length; ++i){
    var transaction = new Transaction;
    transaction.transactionID = lsArray.transactions[i].transactionID;
    transaction.date = lsArray.transactions[i].date;
    transaction.desc = lsArray.transactions[i].desc;
    transaction.amount = lsArray.transactions[i].amount;
    transaction.tag = lsArray.transactions[i].tag;
    retrievedUser.transactions.push(transaction);
  }
  return retrievedUser;
}

function createNewUser(userName, firstName, lastName, email, street, city, state, zip, jsonData) {
  var accountNumber = PROGSTATE.accountNum++;
  var newUser = new User (userName, firstName, lastName, accountNumber, email, new Address (street, city, state, zip));

  if(jsonData != null){
    populateTransactions(jsonData, newUser);
  }

  PROGSTATE.Users.push(newUser);
  return newUser;
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
//var accountCounter = 989086;

// Front end Logic
$(document).ready(function(){

  //var mainUSER = new USER(new UserProfile("username", "password", 'user', 'name', '1', 'email', 'address'));
  //var ricky = createNewUser("ricky", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
  //var bobby = createNewUser("bobby", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
  //storeUser(ricky);

  $('#goToLogin').click(function() {
      $('#account-creator').hide();
      $('#account-login').show();
  });
  $('#goToCreate').click(function() {
      $('#account-login').hide();
      $('#account-creator').show();
  });
  $('#home').click(function() {
      $('#account-login').hide();
      $('#account-creator').hide();
  });
  $('#account-creator').submit(function(event){
      event.preventDefault();
      var newUserName = $('input#new-username').val();
      var newPassword = $('input#new-password').val();
      var newFirstName = $('input#new-first').val();
      var newLastName = $('input#new-last').val();
      var newEmail = $('input#new-email').val();
      var newStreet = $('input#new-street').val();
      var newCity = $('input#new-city').val();
      var newState = $('input#new-state').val();
      var newZip = $('input#new-zip').val();
      //var duplicate = findDuplicate(newUserName);
      if (duplicate) {
          $('input#new-password').val("");
          $('input#new-username').val("");
          alert("Username unavailable");
      } else {
          //localStorage.setItem('accountCounter', accountCounter+=11);
          //var accountNumber = localStorage.getItem('accountCounter');
          //var newAddress = new Address(newStreet, newCity, newState, newZip);
          //var user = new User(newUserName, newFirstName, newLastName, accountNumber, newEmail, newAddress);
          //users.push(user);

          createNewUser(newUserName, newFirstName, newLastName, newEmail, newStreet, newCity, newState, newZip, null)
          $('input#new-password').val("");
          $('input#new-username').val("");
          $('input#new-first').val("");
          $('input#new-last').val("");
          $('input#new-email').val("");
          $('input#new-street').val("");
          $('input#new-city').val("");
          $('input#new-state').val("");
          $('input#new-zip').val("");
        }
    });
});
