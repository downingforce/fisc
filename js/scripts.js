
var STATENAME="FISCDATA";

var PROGSTATE = {
  accountNum: 1000,
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
  for(var i=0; i<PROGSTATE.Users.length; ++i){
    if(PROGSTATE.Users[i].userProfile.userName === userName){
      alert("Try again, the user name <" + userName + "> is taken.");
      return false;
    }
  }
  var newUserProfile = new UserProfile(userName, password, firstName, lastName, email, new Address (street, city, state, zip));
  var newUser = new USER(newUserProfile, PROGSTATE.accountNum++);

  if(jsonData != null){
    populateTransactions(jsonData, newUser);
  }

  PROGSTATE.Users.push(newUser);
  PROGSTATE.CurrentUser = PROGSTATE.Users.length - 1;
  saveState();
  return true;
}

function populateTransactions(jsonArray, user) {
  for(var i=0; i<jsonArray.length; ++i){
    var transaction = new Transaction (jsonArray[i].transactionID, jsonArray[i].date, jsonArray[i].description, jsonArray[i].amount, jsonArray[i].tag)
    user.transactions.push(transaction);
  }
}

USER.prototype.addTransaction = function(id, date, description, amount, tag) {
    var newTransaction = new Transaction(id, date, description, amount, tag);
    this.transactions.push(newTransaction);
}

function logoutUser(){
  alert(PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.userName + " has been logged out");
  PROGSTATE.CurrentUser = -1;
  saveState();
  refreshUserList();
}

function saveState(){
  localStorage.setItem(STATENAME, JSON.stringify(PROGSTATE));
}

function loadState(){
  var lsArray = JSON.parse(localStorage.getItem(STATENAME));
  if(lsArray === null) {
    return false;
  }
  else {
    PROGSTATE.accountNum = lsArray.accountNum;
    PROGSTATE.CurrentUser = lsArray.CurrentUser;
    PROGSTATE.Users = [];
    for (var i=0; i<lsArray.Users.length; ++i) {
      PROGSTATE.Users.push(retrieveUser(lsArray.Users[i]));
    }
    return true;
  }
}

function deleteState(){
  localStorage.removeItem(STATENAME);
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
debugger;
  var userIndex = null;
  for(var i=0; i<PROGSTATE.Users.length; ++i)
    if(PROGSTATE.Users[i].userProfile.userName === username)
      userIndex = i;

  if (userIndex === null) {
      alert('Username not found');
      return false;
  } else {
    if (PROGSTATE.Users[userIndex].userProfile.password === md5(password)) {
      alert("Welcome " + PROGSTATE.Users[userIndex].userProfile.userName);
      PROGSTATE.CurrentUser = userIndex;
      saveState();
      return true;
    } else {
      alert("Please enter the correct Password");
      return false;
    }
  }
}

function changePassword(pwCurrent, pwNew1, pwNew2) {
  if(PROGSTATE.CurrentUser < 0) {
    alert("Please login first");
    return false;
  }

  if (PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.password === md5(pwCurrent)) {
      if(pwNew1 != pwNew2){
        alert("Try Again, Passwords do not match");
        return false;
      }
      else{
        PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.password = md5(pwNew1);
        alert("Password has been changed");
        saveState();
        return true;
      }
  } else {
      alert("Current Password is Incorrect");
      return false;
  }
}

function deleteCurrentUser(password){
  if(PROGSTATE.CurrentUser < 0) {
    alert("Please login first");
    return false;
  }
  if (PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.password === md5(password)) {
    PROGSTATE.Users.splice(PROGSTATE.CurrentUser, 1);
    alert("Account has been deleted");
    PROGSTATE.CurrentUser = -1;
    saveState();
    return true;
  } else {
      alert("Password is Incorrect");
      return false;
  }
}

function refreshUserList () {
  $(".user-display").remove();
  $(".user-details").remove();
  if(PROGSTATE.CurrentUser >=0) {
    $("#current-user").append('<span class="user-display">'
                            + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.userName
                            + '</span>');
  } else {
    $("#current-user").append('<span class="user-display">None</span>');
  }
  for(var i=0; i<PROGSTATE.Users.length; ++i){
    $("#user-list").append('<li class="user-display"><span class="user-details">'
                            + PROGSTATE.Users[i].userProfile.userName
                            + '</span></li>');
    addListInfo(PROGSTATE.Users[i].accountNumber, PROGSTATE.Users[i].transactions.length)
  }
}

function addListInfo(accNum, numTrans) {
  $(".user-details").last().click(function(){
   alert("Acc Num: " + accNum + " Num Trans: " + numTrans);
  });
}

// Login Function
function revealLogin (evt, type) {

  var tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  var tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(type).style.display = "block";
  evt.currentTarget.className += " active";
}
function padToEight(number) {
  if (number<=99999999) { number = ("0000000"+number).slice(-8); }
  return number;
}


function getAccountNum(){
  var accNum = PROGSTATE.Users[PROGSTATE.CurrentUser].accountNumber;
  return padToEight(accNum);
}

// Front end Logic
$(document).ready(function(){
  loadState();
  refreshUserList();


  $("#saveDataBtn").click(function(event){
    saveState();
    event.preventDefault();
  });

  $("#loadDataBtn").click(function(event){
    if(!loadState())
      alert("No Saved Data Exists");
    refreshUserList();
    event.preventDefault();
  });

  $("#clearDataBtn").click(function(event){
    deleteState();
    event.preventDefault();
  });

  $("#loadDummyBtn").click(function(event){

    var ricky = createNewUser("ricky", "900150983cd24fb0d6963f7d28e17f72", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", randomData());
    var bobby = createNewUser("bobby", "d16fb36f0911f878998c136191af705e", "Bobby", "Dean", "bobby@bitch.com","1010 Main St", "Portland", "OR", "97214", randomData());
    //var bobby = createNewUser("johnny", "202cb962ac59075b964b07152d234b70", "Johnny", "Depp", "Johnny@bitch.com","1010 Main St", "Portland", "OR", "97214", null);

    refreshUserList();
     $("#loadDummyBtn").prop('disabled', true);
    event.preventDefault();
  });

  $("#refreshUserList").click(function(event){
    refreshUserList();
    event.preventDefault();
  });

  $('#goToLogin').click(function() {
    $('#introrow').hide();
    $('#loginrow').show();
    $('#account-creator').show();
    $('#account-login').show();
  });



  $("#logoutUserBtn").click(function(event){
    if(PROGSTATE.CurrentUser === -1) {
      alert("Please login first");
    } else {
      logoutUser();
    }
    event.preventDefault();
  });

  $('#goToCreate').click(function() {
      $('#account-creator').show();
  });

  $('#goToChangePassword').click(function() {
    if(PROGSTATE.CurrentUser === -1) {
      alert("Please login first");
    } else {
      $('#change-password').show();
    }
  });

  $('#goToDeleteUser').click(function() {
    if(PROGSTATE.CurrentUser === -1) {
      alert("Please login first");
    } else {
      $('#delete-user').show();
    }
  });

  $('#loginSubmit').click(function(event) {

    event.preventDefault();
    var username = $('input#account-login-username').val();
    var password = $('input#account-login-password').val();
    if(verifyUser(username, password)) {
      $('input.clearData').val("");
      $('#account-login').hide();
      refreshUserList();
      var newUrl = 'account.html';
      window.location.replace(newUrl);
    }
  });

  $('#registerSubmit').click(function(event){
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
    if (createNewUser(newUserName, newPassword, newFirstName, newLastName, newEmail, newStreet, newCity, newState, newZip, randomData())){
      $('input.clearData').val("");
      $('#account-creator').hide();
      refreshUserList();
    }
    console.log(newUserName);
    var newUrl = 'account.html';
    window.location.replace(newUrl);
    });

  $('button#change-password-submit').click(function(event) {
    event.preventDefault();
    var pwCurrent = $('input#change-password-oldpw').val();
    var pwNew1 = $('input#change-password-newpw1').val();
    var pwNew2 = $('input#change-password-newpw2').val();
    if (changePassword(pwCurrent, pwNew1, pwNew2)) {
      $('input.clearData').val("");
      $('#change-password').hide();
    }
  });

  $('button#delete-user-submit').click(function(event) {
    event.preventDefault();
    var password = $('input#delete-user-password').val();
    if (deleteCurrentUser(password)) {
      refreshUserList();
      $('input.clearData').val("");
      $('#delete-user').hide();
    }
  });

});
