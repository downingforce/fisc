var STATENAME="FISCDATA";

var PROGSTATE = {
  accountNum: 500,
  Users: [],
  CurrentUser: -1
};

function USER(userProf, accNum){
    this.userProfile = userProf;
    this.accountNumber = accNum;
    this.transactions = [];

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

function createNewUser(userName, password, firstName, lastName, email, street, city, state, zip, jsonData) {
  var accountNumber = PROGSTATE.accountNum++;
  var newUserProfile = new UserProfile(userName, password, firstName, lastName, email, new Address (street, city, state, zip));
  var newUser = new USER(newUserProfile, accountNumber);
  if(jsonData != null){
    populateTransactions(jsonData, newUser);
  }

  PROGSTATE.Users.push(newUser);
  PROGSTATE.CurrentUser = PROGSTATE.Users.length - 1;
  // loginUser(CurrentUser);
}

function populateTransactions(jsonArray, user) {
  for(var i=0; i<jsonArray.length; ++i){
    var transaction = new Transaction (jsonArray[i].transactionID, jsonArray[i].date, jsonArray[i].description, jsonArray[i].amount, jsonArray[i].tag)
    user.transactions.push(transaction);
  }
}

USER.prototype.addTransaction = function(id, date, description, amount, tag) {
    var newTransaction = new Transaction(id, date, description, amount, tag);
    mainUSER.transactions.push(newTransaction)
}


function saveState(){
  localStorage.setItem(STATENAME, JSON.stringify(PROGSTATE));
}


function loadState(){
  var lsArray = JSON.parse(localStorage.getItem(STATENAME));
  if(lsArray === null)
    alert("No Saved Data Exists");
  else {
    PROGSTATE.accountNum = lsArray.accountNum;
    for (var i=0; i<lsArray.Users.length; ++i) {
      PROGSTATE.Users.push(retrieveUser(lsArray.Users[i]));
    }
  }
}

function deleteState(){
  localStorage.removeItem(STATENAME);
}

// Send User to localStorage, with accountNumber as identifier
function storeUser(User){
  localStorage.setItem(User.accountNumber, JSON.stringify(User));
}

// restore users from a local storage object array
function retrieveUser(lsArray) {
  var address = new Address (lsArray.userProfile.address.street, lsArray.userProfile.address.city, lsArray.userProfile.address.state, lsArray.userProfile.address.zip);
  var userProfile = new UserProfile (lsArray.userProfile.userName, lsArray.userProfile.password, lsArray.userProfile.firstName, lsArray.userProfile.lastName, lsArray.userProfile.email, address);
  var user = new  USER(userProfile, lsArray.accountNumber);
  for(var i=0; i<lsArray.transactions.length; ++i){
    var transaction = new Transaction;
    transaction.transactionID = lsArray.transactions[i].transactionID;
    transaction.date = lsArray.transactions[i].date;
    transaction.desc = lsArray.transactions[i].desc;
    transaction.amount = lsArray.transactions[i].amount;
    transaction.tag = lsArray.transactions[i].tag;
    user.transactions.push(transaction);
  }
  return user;
}

// Verify user and password
function verifyUser(username, password) {
    var userIndex = null;
    for(var i=0; i<PROGSTATE.Users.length; ++i){
      if(PROGSTATE.Users[i].userProfile.userName === username){
        userIndex = i;
        console.log("Found Name");
      }
    }

    if (userIndex === null) {
        return alert('Username not found');
    } else {
        if (PROGSTATE.Users[userIndex].userProfile.password === password) {
            console.log("Found Password");
            alert("Welcome " + PROGSTATE.Users[userIndex].userProfile.userName);
            PROGSTATE.CurrentUser = userIndex;
            // loginUser(userIndex);
        } else {
            alert("Please enter the correct Password");
        }
    }
}
function refreshUserList () {

  $(".user-display").remove();
  if(PROGSTATE.CurrentUser >=0) {
    $("#current-user").append('<span class="user-display">'
                            + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.userName
                            + '</span>');
  } else {
    $("#current-user").append('<span class="user-display">None</span>');
  }
  for(var i=0; i<PROGSTATE.Users.length; ++i){
    $("#user-list").append('<li class="user-display">'
                            + PROGSTATE.Users[i].userProfile.userName
                            + '</li>');

    //var accNum = PROGSTATE.Users[i].accountNumber;
    //var numTrans = PROGSTATE.Users[i].transactions.length;
    //$(".user-display").last().click(function(){
    //  debugger;
    //  alert("Acc Num: " + accNum + " Num Trans: " + numTrans);
    //});
  }
}

//var accountCounter = 989086;

// Front end Logic
$(document).ready(function(){


  $("#saveDataBtn").click(function(event){
    saveState();
    event.preventDefault();
  });
  $("#loadDataBtn").click(function(event){
    loadState();
    refreshUserList();
    event.preventDefault();
  });
  $("#clearDataBtn").click(function(event){
    deleteState();
    event.preventDefault();
  });
  $("#loadDummyBtn").click(function(event){
    var ricky = createNewUser("ricky", "abc", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
    var bobby = createNewUser("bobby", "xyz", "Bobby", "Dean", "bobby@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
    var bobby = createNewUser("johnny", "123", "Johnny", "Depp", "Johnny@bitch.com","1010 Main St", "Portland", "OR", "97214", null);
    refreshUserList();
     $("#loadDummyBtn").prop('disabled', true);
    event.preventDefault();
  });
  $("#refreshUserList").click(function(event){
    refreshUserList();
    event.preventDefault();
  });

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
  $('#loginSubmit').click(function(event) {
    event.preventDefault();
    var username = $('input#username').val();
    var password = $('input#password').val();
    console.log(username + " : " + password);
    verifyUser(username, password);
    refreshUserList();
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
    var duplicate = 0;
    if (duplicate) {
        $('input#new-password').val("");
        $('input#new-username').val("");
        alert("Username unavailable");
    }
    else {
      createNewUser(newUserName, newPassword, newFirstName, newLastName, newEmail, newStreet, newCity, newState, newZip, null);
      $('input#new-password').val("");
      $('input#new-username').val("");
      $('input#new-first').val("");
      $('input#new-last').val("");
      $('input#new-email').val("");
      $('input#new-street').val("");
      $('input#new-city').val("");
      $('input#new-state').val("");
      $('input#new-zip').val("");
      $('#account-creator').hide();
      refreshUserList();
    }
  });
});
