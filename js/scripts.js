
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
    mainUSER.transactions.push(newTransaction);
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

  var accNum = getAccountNum();
  // alert(PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.firstName);
  $('#display-account-num').append('<h5>Account Number: ' + accNum + '</h5>')
  $('#display-username').append('<h5>' + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.firstName + ' ' + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.lastName + '</h5>')

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
    var ricky = createNewUser("ricky", "900150983cd24fb0d6963f7d28e17f72", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
    var bobby = createNewUser("bobby", "d16fb36f0911f878998c136191af705e", "Bobby", "Dean", "bobby@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
    var bobby = createNewUser("johnny", "202cb962ac59075b964b07152d234b70", "Johnny", "Depp", "Johnny@bitch.com","1010 Main St", "Portland", "OR", "97214", null);

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

  $('#loginSubmit').click(function(event) {
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

  $('button#account-login-submit').click(function(event) {

    event.preventDefault();
    var username = $('input#account-login-username').val();
    var password = $('input#account-login-password').val();
    if(verifyUser(username, password)) {
      $('input.clearData').val("");
      $('#account-login').hide();
      refreshUserList();
    }
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
    if (createNewUser(newUserName, newPassword, newFirstName, newLastName, newEmail, newStreet, newCity, newState, newZip, null)){
      $('input.clearData').val("");
      $('#account-creator').hide();
      refreshUserList();
    }
    console.log(newUserName);
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



var steve = createNewUser("steve", "abc", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214");

PROGSTATE.CurrentUser = 0;
PROGSTATE.Users[PROGSTATE.CurrentUser].transactions = [{"transactionID":1,"date":"2015-08-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":2,"date":"2015-08-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":3,"date":"2016-06-15","description":"Coccoa","amount":"11.9","tag":"food"},
{"transactionID":4,"date":"2015-12-25","description":"Home Depot","amount":"50.15","tag":"other"},
{"transactionID":5,"date":"2016-02-16","description":"Lowes","amount":"189.54","tag":"home-improvement"},
{"transactionID":6,"date":"2016-01-04","description":"Home Depot","amount":"36.24","tag":"home-improvement"},
{"transactionID":7,"date":"2015-09-25","description":"Autozone","amount":"102.98","tag":"automotive"},
{"transactionID":8,"date":"2016-08-16","description":"Arco","amount":"122.66","tag":"automotive"},
{"transactionID":9,"date":"2016-04-03","description":"Starbucks","amount":"198.83","tag":"other"},
{"transactionID":10,"date":"2016-05-22","description":"Lowes","amount":"16.04","tag":"other"},
{"transactionID":11,"date":"2016-04-21","description":"Sassys","amount":"12.99","tag":"entertainment"},
{"transactionID":12,"date":"2016-05-08","description":"Arco","amount":"46.64","tag":"automotive"},
{"transactionID":13,"date":"2015-11-06","description":"Sassys","amount":"136.69","tag":"entertainment"},
{"transactionID":14,"date":"2016-05-30","description":"Coccoa","amount":"89.26","tag":"medical"},
{"transactionID":15,"date":"2016-03-26","description":"Netflix","amount":"84.07","tag":"entertainment"},
{"transactionID":16,"date":"2015-11-02","description":"New Seasons","amount":"141.44","tag":"food"},
{"transactionID":17,"date":"2015-10-03","description":"Amazon","amount":"185.24","tag":"medical"},
{"transactionID":18,"date":"2016-04-04","description":"Fred Meyer","amount":"154.34","tag":"entertainment"},
{"transactionID":19,"date":"2016-02-15","description":"Amazon","amount":"83.36","tag":"home-improvement"},
{"transactionID":20,"date":"2016-01-14","description":"Arco","amount":"3.36","tag":"automotive"},
{"transactionID":21,"date":"2016-07-14","description":"Multnomah County","amount":"29.16","tag":"utilities"},
{"transactionID":22,"date":"2016-08-30","description":"Multnomah County","amount":"158.63","tag":"utilities"},
{"transactionID":23,"date":"2016-05-15","description":"Fred Meyer","amount":"164.28","tag":"food"},
{"transactionID":24,"date":"2016-07-21","description":"Sassys","amount":"31.67","tag":"food"},
{"transactionID":25,"date":"2016-06-25","description":"Walmart","amount":"147.49","tag":"food"},
{"transactionID":26,"date":"2016-02-24","description":"Home Depot","amount":"7.68","tag":"home-improvement"},
{"transactionID":27,"date":"2015-10-11","description":"Fred Meyer","amount":"6.99","tag":"food"},
{"transactionID":28,"date":"2015-11-10","description":"Lowes","amount":"147.26","tag":"home-improvement"},
{"transactionID":29,"date":"2016-07-27","description":"Costco","amount":"186.71","tag":"medical"},
{"transactionID":30,"date":"2016-01-15","description":"Exxon Mobil","amount":"150.79","tag":"automotive"},
{"transactionID":31,"date":"2016-01-17","description":"Shell","amount":"174.69","tag":"automotive"},
{"transactionID":32,"date":"2015-09-10","description":"New Seasons","amount":"14.48","tag":"food"},
{"transactionID":33,"date":"2015-11-27","description":"Jiffy Lube","amount":"115.13","tag":"automotive"},
{"transactionID":34,"date":"2016-05-30","description":"Starbucks","amount":"90.48","tag":"food"},
{"transactionID":35,"date":"2016-01-30","description":"Northwest Natural","amount":"103.14","tag":"utilities"},
{"transactionID":36,"date":"2015-11-14","description":"Home Depot","amount":"50.66","tag":"home-improvement"},
{"transactionID":37,"date":"2015-10-07","description":"Sassys","amount":"73.61","tag":"other"},
{"transactionID":38,"date":"2015-11-15","description":"Northwest Natural","amount":"186.14","tag":"utilities"},
{"transactionID":39,"date":"2015-09-15","description":"Sassys","amount":"184.79","tag":"entertainment"},
{"transactionID":40,"date":"2016-05-14","description":"Home Depot","amount":"29.52","tag":"other"},
{"transactionID":41,"date":"2016-08-10","description":"New Seasons","amount":"131.94","tag":"other"},
{"transactionID":42,"date":"2015-09-23","description":"Chipoltle","amount":"190.5","tag":"food"},
{"transactionID":43,"date":"2016-05-26","description":"Northwest Natural","amount":"96.34","tag":"utilities"},
{"transactionID":44,"date":"2016-05-05","description":"Lowes","amount":"19.0","tag":"home-improvement"},
{"transactionID":45,"date":"2016-04-15","description":"Northwest Natural","amount":"129.4","tag":"utilities"},
{"transactionID":46,"date":"2015-11-17","description":"Walmart","amount":"75.79","tag":"entertainment"},
{"transactionID":47,"date":"2015-09-05","description":"Target","amount":"191.04","tag":"home-improvement"},
{"transactionID":48,"date":"2016-08-18","description":"Jiffy Lube","amount":"95.17","tag":"automotive"},
{"transactionID":49,"date":"2015-10-02","description":"Autozone","amount":"156.06","tag":"automotive"},
{"transactionID":50,"date":"2016-06-09","description":"Lowes","amount":"58.26","tag":"home-improvement"},
{"transactionID":51,"date":"2016-05-02","description":"BW3s","amount":"3.84","tag":"food"},
{"transactionID":52,"date":"2016-03-23","description":"Sassys","amount":"171.32","tag":"entertainment"},
{"transactionID":53,"date":"2016-02-08","description":"Sassys","amount":"51.26","tag":"food"},
{"transactionID":54,"date":"2016-07-11","description":"Multnomah County","amount":"190.87","tag":"other"},
{"transactionID":55,"date":"2016-07-18","description":"Walmart","amount":"127.63","tag":"other"},
{"transactionID":56,"date":"2015-11-12","description":"Walmart","amount":"195.44","tag":"medical"},
{"transactionID":57,"date":"2016-01-16","description":"Amazon","amount":"82.31","tag":"food"},
{"transactionID":58,"date":"2016-08-14","description":"Coccoa","amount":"55.54","tag":"utilities"},
{"transactionID":59,"date":"2016-04-09","description":"Home Depot","amount":"183.5","tag":"home-improvement"},
{"transactionID":60,"date":"2015-10-13","description":"Lowes","amount":"196.5","tag":"home-improvement"},
{"transactionID":61,"date":"2016-07-09","description":"Starbucks","amount":"188.64","tag":"food"},
{"transactionID":62,"date":"2015-09-25","description":"Coccoa","amount":"86.68","tag":"entertainment"},
{"transactionID":63,"date":"2016-08-14","description":"Multnomah County","amount":"167.98","tag":"other"},
{"transactionID":64,"date":"2016-02-14","description":"Netflix","amount":"172.3","tag":"entertainment"},
{"transactionID":65,"date":"2016-01-26","description":"Jiffy Lube","amount":"69.19","tag":"automotive"},
{"transactionID":66,"date":"2015-12-24","description":"Starbucks","amount":"10.66","tag":"food"},
{"transactionID":67,"date":"2016-07-08","description":"Sassys","amount":"67.68","tag":"food"},
{"transactionID":68,"date":"2016-07-18","description":"Netflix","amount":"40.97","tag":"entertainment"},
{"transactionID":69,"date":"2016-05-30","description":"Chipoltle","amount":"12.7","tag":"food"},
{"transactionID":70,"date":"2016-01-22","description":"Trader Joes","amount":"88.92","tag":"other"},
{"transactionID":71,"date":"2015-12-31","description":"New Seasons","amount":"135.38","tag":"food"},
{"transactionID":72,"date":"2015-11-17","description":"Trader Joes","amount":"189.27","tag":"other"},
{"transactionID":73,"date":"2015-10-03","description":"Trader Joes","amount":"130.1","tag":"food"},
{"transactionID":74,"date":"2015-11-14","description":"Tacobell","amount":"174.12","tag":"food"},
{"transactionID":75,"date":"2016-01-04","description":"Jiffy Lube","amount":"63.29","tag":"automotive"},
{"transactionID":76,"date":"2016-07-18","description":"Chipoltle","amount":"17.26","tag":"food"},
{"transactionID":77,"date":"2015-12-14","description":"Exxon Mobil","amount":"152.88","tag":"automotive"},
{"transactionID":78,"date":"2015-09-29","description":"Target","amount":"110.8","tag":"entertainment"},
{"transactionID":79,"date":"2016-08-09","description":"Lowes","amount":"100.74","tag":"home-improvement"},
{"transactionID":80,"date":"2016-08-19","description":"Trader Joes","amount":"9.14","tag":"food"},
{"transactionID":81,"date":"2016-08-10","description":"Fred Meyer","amount":"14.39","tag":"other"},
{"transactionID":82,"date":"2016-02-16","description":"Coccoa","amount":"145.03","tag":"clothes"},
{"transactionID":83,"date":"2016-01-23","description":"Trader Joes","amount":"175.8","tag":"food"},
{"transactionID":84,"date":"2016-02-16","description":"Coccoa","amount":"127.12","tag":"entertainment"},
{"transactionID":85,"date":"2016-01-06","description":"Shell","amount":"58.24","tag":"automotive"},
{"transactionID":86,"date":"2016-04-04","description":"Exxon Mobil","amount":"167.18","tag":"automotive"},
{"transactionID":87,"date":"2016-07-06","description":"New Seasons","amount":"104.64","tag":"other"},
{"transactionID":88,"date":"2015-12-30","description":"PGE","amount":"42.5","tag":"utilities"},
{"transactionID":89,"date":"2015-11-18","description":"Coccoa","amount":"179.45","tag":"income"},
{"transactionID":90,"date":"2016-01-09","description":"Trader Joes","amount":"40.93","tag":"food"},
{"transactionID":91,"date":"2016-06-30","description":"Trader Joes","amount":"15.57","tag":"food"},
{"transactionID":92,"date":"2015-11-27","description":"PGE","amount":"134.29","tag":"utilities"},
{"transactionID":93,"date":"2015-09-12","description":"Jiffy Lube","amount":"125.15","tag":"automotive"},
{"transactionID":94,"date":"2015-12-09","description":"PGE","amount":"195.66","tag":"utilities"},
{"transactionID":95,"date":"2016-05-23","description":"Chipoltle","amount":"145.68","tag":"food"},
{"transactionID":96,"date":"2016-01-28","description":"Netflix","amount":"104.51","tag":"entertainment"},
{"transactionID":97,"date":"2015-11-27","description":"Chipoltle","amount":"117.57","tag":"food"},
{"transactionID":98,"date":"2015-11-26","description":"Exxon Mobil","amount":"27.13","tag":"automotive"},
{"transactionID":99,"date":"2015-12-02","description":"Autozone","amount":"3.65","tag":"automotive"},
{"transactionID":100,"date":"2015-09-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":101,"date":"2016-02-20","description":"Netflix","amount":"128.72","tag":"entertainment"},
{"transactionID":102,"date":"2015-09-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":103,"date":"2016-02-09","description":"Chipoltle","amount":"95.37","tag":"food"},
{"transactionID":104,"date":"2016-04-17","description":"Tacobell","amount":"185.04","tag":"food"},
{"transactionID":105,"date":"2016-07-04","description":"Autozone","amount":"29.48","tag":"automotive"},
{"transactionID":106,"date":"2015-12-09","description":"Amazon","amount":"94.15","tag":"medical"},
{"transactionID":107,"date":"2016-04-15","description":"Exxon Mobil","amount":"28.68","tag":"automotive"},
{"transactionID":108,"date":"2015-09-08","description":"Starbucks","amount":"62.61","tag":"food"},
{"transactionID":109,"date":"2016-08-30","description":"New Seasons","amount":"138.71","tag":"food"},
{"transactionID":110,"date":"2016-08-16","description":"Tacobell","amount":"168.44","tag":"food"},
{"transactionID":111,"date":"2015-10-17","description":"Oregon Theater","amount":"154.16","tag":"entertainment"},
{"transactionID":112,"date":"2015-12-24","description":"Arco","amount":"175.59","tag":"automotive"},
{"transactionID":113,"date":"2016-01-18","description":"Netflix","amount":"106.37","tag":"entertainment"},
{"transactionID":114,"date":"2016-01-06","description":"Jiffy Lube","amount":"46.29","tag":"automotive"},
{"transactionID":115,"date":"2016-06-11","description":"New Seasons","amount":"77.6","tag":"food"},
{"transactionID":116,"date":"2016-02-17","description":"Oregon Theater","amount":"25.32","tag":"entertainment"},
{"transactionID":117,"date":"2015-11-04","description":"BW3s","amount":"143.91","tag":"food"},
{"transactionID":118,"date":"2016-02-12","description":"Lowes","amount":"29.21","tag":"other"},
{"transactionID":119,"date":"2016-03-15","description":"Starbucks","amount":"137.99","tag":"food"},
{"transactionID":120,"date":"2016-05-24","description":"Costco","amount":"41.02","tag":"food"},
{"transactionID":121,"date":"2016-06-21","description":"Amazon","amount":"123.59","tag":"clothes"},
{"transactionID":122,"date":"2016-04-14","description":"Sassys","amount":"46.94","tag":"entertainment"},
{"transactionID":123,"date":"2016-07-05","description":"Walmart","amount":"138.71","tag":"medical"},
{"transactionID":124,"date":"2016-08-13","description":"Starbucks","amount":"187.43","tag":"other"},
{"transactionID":125,"date":"2016-01-21","description":"Netflix","amount":"65.69","tag":"entertainment"},
{"transactionID":126,"date":"2016-04-01","description":"Northwest Natural","amount":"112.21","tag":"utilities"},
{"transactionID":127,"date":"2016-01-09","description":"Coccoa","amount":"186.24","tag":"income"},
{"transactionID":128,"date":"2016-06-21","description":"New Seasons","amount":"199.34","tag":"food"},
{"transactionID":129,"date":"2016-02-19","description":"Costco","amount":"4.33","tag":"home-improvement"},
{"transactionID":130,"date":"2016-06-01","description":"Target","amount":"132.63","tag":"medical"},
{"transactionID":131,"date":"2016-04-28","description":"Trader Joes","amount":"159.99","tag":"other"},
{"transactionID":132,"date":"2016-06-09","description":"Arco","amount":"179.9","tag":"automotive"},
{"transactionID":133,"date":"2015-12-30","description":"Home Depot","amount":"5.02","tag":"other"},
{"transactionID":134,"date":"2016-05-19","description":"Jiffy Lube","amount":"162.59","tag":"automotive"},
{"transactionID":135,"date":"2016-04-05","description":"BW3s","amount":"83.66","tag":"food"},
{"transactionID":136,"date":"2016-01-19","description":"Multnomah County","amount":"188.89","tag":"other"},
{"transactionID":137,"date":"2016-08-25","description":"New Seasons","amount":"34.13","tag":"food"},
{"transactionID":138,"date":"2015-11-04","description":"New Seasons","amount":"17.98","tag":"food"},
{"transactionID":139,"date":"2016-06-05","description":"Shell","amount":"98.1","tag":"automotive"},
{"transactionID":140,"date":"2015-09-21","description":"Shell","amount":"76.19","tag":"automotive"},
{"transactionID":141,"date":"2015-12-15","description":"Autozone","amount":"80.59","tag":"automotive"},
{"transactionID":142,"date":"2016-02-25","description":"PGE","amount":"24.01","tag":"utilities"},
{"transactionID":143,"date":"2016-02-11","description":"Lowes","amount":"80.0","tag":"home-improvement"},
{"transactionID":144,"date":"2015-12-20","description":"Fred Meyer","amount":"123.7","tag":"food"},
{"transactionID":145,"date":"2016-07-09","description":"New Seasons","amount":"7.97","tag":"food"},
{"transactionID":146,"date":"2016-04-25","description":"Northwest Natural","amount":"44.8","tag":"utilities"},
{"transactionID":147,"date":"2016-05-19","description":"Autozone","amount":"141.13","tag":"automotive"},
{"transactionID":148,"date":"2015-09-20","description":"Tacobell","amount":"123.19","tag":"food"},
{"transactionID":149,"date":"2016-01-29","description":"Amazon","amount":"16.62","tag":"food"},
{"transactionID":150,"date":"2015-11-18","description":"Sassys","amount":"136.03","tag":"food"},
{"transactionID":151,"date":"2016-04-28","description":"Trader Joes","amount":"163.94","tag":"other"},
{"transactionID":152,"date":"2015-12-31","description":"Jiffy Lube","amount":"38.37","tag":"automotive"},
{"transactionID":153,"date":"2016-01-12","description":"Home Depot","amount":"188.25","tag":"home-improvement"},
{"transactionID":154,"date":"2016-01-19","description":"Target","amount":"165.24","tag":"other"},
{"transactionID":155,"date":"2015-12-12","description":"Northwest Natural","amount":"189.67","tag":"utilities"},
{"transactionID":156,"date":"2016-03-08","description":"Costco","amount":"160.73","tag":"clothes"},
{"transactionID":157,"date":"2015-10-11","description":"Oregon Theater","amount":"60.31","tag":"entertainment"},
{"transactionID":158,"date":"2016-03-10","description":"Oregon Theater","amount":"12.95","tag":"entertainment"},
{"transactionID":159,"date":"2016-02-09","description":"Coccoa","amount":"68.4","tag":"home-improvement"},
{"transactionID":160,"date":"2015-09-29","description":"BW3s","amount":"11.32","tag":"food"},
{"transactionID":161,"date":"2016-03-17","description":"PGE","amount":"80.24","tag":"utilities"},
{"transactionID":162,"date":"2016-07-25","description":"Costco","amount":"177.83","tag":"food"},
{"transactionID":163,"date":"2016-03-20","description":"Target","amount":"179.27","tag":"clothes"},
{"transactionID":164,"date":"2016-07-08","description":"Oregon Theater","amount":"157.25","tag":"entertainment"},
{"transactionID":165,"date":"2016-04-02","description":"Amazon","amount":"40.12","tag":"automotive"},
{"transactionID":166,"date":"2015-09-26","description":"Exxon Mobil","amount":"38.01","tag":"automotive"},
{"transactionID":167,"date":"2016-04-30","description":"Multnomah County","amount":"142.85","tag":"utilities"},
{"transactionID":168,"date":"2016-02-02","description":"Exxon Mobil","amount":"74.96","tag":"automotive"},
{"transactionID":169,"date":"2015-12-26","description":"BW3s","amount":"186.0","tag":"food"},
{"transactionID":170,"date":"2016-02-21","description":"Northwest Natural","amount":"177.24","tag":"utilities"},
{"transactionID":171,"date":"2015-11-03","description":"Tacobell","amount":"63.59","tag":"food"},
{"transactionID":172,"date":"2015-11-13","description":"Trader Joes","amount":"34.08","tag":"other"},
{"transactionID":173,"date":"2016-07-29","description":"Shell","amount":"112.29","tag":"automotive"},
{"transactionID":174,"date":"2016-02-19","description":"Coccoa","amount":"136.19","tag":"medical"},
{"transactionID":175,"date":"2016-07-16","description":"Fred Meyer","amount":"168.04","tag":"food"},
{"transactionID":176,"date":"2016-01-23","description":"Jiffy Lube","amount":"3.25","tag":"automotive"},
{"transactionID":177,"date":"2015-10-27","description":"Target","amount":"136.88","tag":"clothes"},
{"transactionID":178,"date":"2015-09-27","description":"PGE","amount":"96.95","tag":"utilities"},
{"transactionID":179,"date":"2016-01-08","description":"Multnomah County","amount":"82.41","tag":"other"},
{"transactionID":180,"date":"2015-11-07","description":"Trader Joes","amount":"122.6","tag":"food"},
{"transactionID":181,"date":"2016-02-06","description":"Starbucks","amount":"27.63","tag":"other"},
{"transactionID":182,"date":"2016-04-02","description":"Coccoa","amount":"125.94","tag":"automotive"},
{"transactionID":183,"date":"2015-09-16","description":"Trader Joes","amount":"146.74","tag":"food"},
{"transactionID":184,"date":"2015-10-28","description":"Multnomah County","amount":"168.53","tag":"other"},
{"transactionID":185,"date":"2015-10-03","description":"Target","amount":"163.75","tag":"other"},
{"transactionID":186,"date":"2015-10-10","description":"Netflix","amount":"145.85","tag":"entertainment"},
{"transactionID":187,"date":"2015-10-31","description":"Sassys","amount":"127.58","tag":"entertainment"},
{"transactionID":188,"date":"2015-09-24","description":"Lowes","amount":"129.41","tag":"home-improvement"},
{"transactionID":189,"date":"2015-12-23","description":"Multnomah County","amount":"16.67","tag":"other"},
{"transactionID":190,"date":"2015-09-29","description":"Oregon Theater","amount":"133.94","tag":"entertainment"},
{"transactionID":191,"date":"2015-11-14","description":"Autozone","amount":"33.04","tag":"automotive"},
{"transactionID":192,"date":"2016-08-05","description":"Home Depot","amount":"81.18","tag":"other"},
{"transactionID":193,"date":"2015-12-18","description":"PGE","amount":"3.74","tag":"utilities"},
{"transactionID":194,"date":"2016-08-30","description":"Netflix","amount":"43.42","tag":"entertainment"},
{"transactionID":195,"date":"2016-07-14","description":"Tacobell","amount":"176.15","tag":"food"},
{"transactionID":196,"date":"2016-08-27","description":"Chipoltle","amount":"3.96","tag":"food"},
{"transactionID":197,"date":"2016-04-23","description":"Shell","amount":"38.99","tag":"automotive"},
{"transactionID":198,"date":"2016-07-25","description":"Tacobell","amount":"44.15","tag":"food"},
{"transactionID":199,"date":"2015-10-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":200,"date":"2016-07-28","description":"Target","amount":"52.94","tag":"medical"},
{"transactionID":201,"date":"2016-06-28","description":"Chipoltle","amount":"196.61","tag":"food"},
{"transactionID":202,"date":"2015-10-02","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":203,"date":"2015-09-19","description":"New Seasons","amount":"36.71","tag":"other"},
{"transactionID":204,"date":"2016-02-21","description":"Autozone","amount":"94.65","tag":"automotive"},
{"transactionID":205,"date":"2016-06-23","description":"BW3s","amount":"81.07","tag":"food"},
{"transactionID":206,"date":"2015-11-24","description":"Netflix","amount":"31.09","tag":"entertainment"},
{"transactionID":207,"date":"2016-07-16","description":"Trader Joes","amount":"137.4","tag":"food"},
{"transactionID":208,"date":"2015-12-09","description":"Netflix","amount":"28.83","tag":"entertainment"},
{"transactionID":209,"date":"2016-01-11","description":"Fred Meyer","amount":"130.38","tag":"entertainment"},
{"transactionID":210,"date":"2015-11-11","description":"Sassys","amount":"68.69","tag":"food"},
{"transactionID":211,"date":"2016-03-18","description":"PGE","amount":"72.07","tag":"utilities"},
{"transactionID":212,"date":"2016-02-20","description":"Northwest Natural","amount":"49.87","tag":"utilities"},
{"transactionID":213,"date":"2015-10-14","description":"Jiffy Lube","amount":"68.95","tag":"automotive"},
{"transactionID":214,"date":"2015-11-05","description":"Arco","amount":"84.59","tag":"automotive"},
{"transactionID":215,"date":"2016-04-24","description":"Walmart","amount":"140.2","tag":"other"},
{"transactionID":216,"date":"2016-07-25","description":"Coccoa","amount":"106.49","tag":"automotive"},
{"transactionID":217,"date":"2015-12-25","description":"Sassys","amount":"192.72","tag":"entertainment"},
{"transactionID":218,"date":"2016-02-03","description":"Costco","amount":"106.25","tag":"other"},
{"transactionID":219,"date":"2016-02-17","description":"Multnomah County","amount":"151.51","tag":"utilities"},
{"transactionID":220,"date":"2015-10-06","description":"Coccoa","amount":"59.19","tag":"utilities"},
{"transactionID":221,"date":"2015-12-05","description":"Target","amount":"56.88","tag":"home-improvement"},
{"transactionID":222,"date":"2015-09-23","description":"Home Depot","amount":"169.83","tag":"home-improvement"},
{"transactionID":223,"date":"2016-03-15","description":"Trader Joes","amount":"137.93","tag":"other"},
{"transactionID":224,"date":"2015-09-24","description":"Fred Meyer","amount":"76.58","tag":"entertainment"},
{"transactionID":225,"date":"2016-01-17","description":"Fred Meyer","amount":"165.45","tag":"food"},
{"transactionID":226,"date":"2015-11-18","description":"Oregon Theater","amount":"143.8","tag":"entertainment"},
{"transactionID":227,"date":"2016-01-13","description":"Starbucks","amount":"124.57","tag":"food"},
{"transactionID":228,"date":"2015-09-19","description":"Lowes","amount":"67.98","tag":"home-improvement"},
{"transactionID":229,"date":"2016-05-21","description":"Multnomah County","amount":"98.57","tag":"utilities"},
{"transactionID":230,"date":"2016-08-21","description":"Amazon","amount":"1.93","tag":"clothes"},
{"transactionID":231,"date":"2016-06-26","description":"Amazon","amount":"90.87","tag":"medical"},
{"transactionID":232,"date":"2015-09-26","description":"Tacobell","amount":"197.88","tag":"food"},
{"transactionID":233,"date":"2015-11-18","description":"Jiffy Lube","amount":"43.13","tag":"automotive"},
{"transactionID":234,"date":"2016-08-14","description":"Exxon Mobil","amount":"180.07","tag":"automotive"},
{"transactionID":235,"date":"2016-02-26","description":"Trader Joes","amount":"50.41","tag":"food"},
{"transactionID":236,"date":"2016-03-31","description":"Shell","amount":"17.02","tag":"automotive"},
{"transactionID":237,"date":"2016-02-07","description":"Home Depot","amount":"155.93","tag":"home-improvement"},
{"transactionID":238,"date":"2015-09-25","description":"Northwest Natural","amount":"34.17","tag":"utilities"},
{"transactionID":239,"date":"2016-08-21","description":"Target","amount":"8.92","tag":"home-improvement"},
{"transactionID":240,"date":"2016-01-04","description":"Netflix","amount":"146.1","tag":"entertainment"},
{"transactionID":241,"date":"2015-12-31","description":"Sassys","amount":"191.26","tag":"other"},
{"transactionID":242,"date":"2016-06-24","description":"New Seasons","amount":"114.57","tag":"other"},
{"transactionID":243,"date":"2016-02-29","description":"Sassys","amount":"18.68","tag":"food"},
{"transactionID":244,"date":"2016-07-19","description":"Fred Meyer","amount":"4.32","tag":"food"},
{"transactionID":245,"date":"2016-01-23","description":"Fred Meyer","amount":"8.95","tag":"medical"},
{"transactionID":246,"date":"2016-01-25","description":"Home Depot","amount":"37.23","tag":"home-improvement"},
{"transactionID":247,"date":"2016-05-02","description":"Amazon","amount":"37.39","tag":"entertainment"},
{"transactionID":248,"date":"2016-01-10","description":"Northwest Natural","amount":"171.2","tag":"utilities"},
{"transactionID":249,"date":"2016-01-30","description":"Trader Joes","amount":"68.76","tag":"food"},
{"transactionID":250,"date":"2015-11-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":251,"date":"2015-11-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":252,"date":"2016-04-30","description":"Amazon","amount":"24.27","tag":"food"},
{"transactionID":253,"date":"2016-08-15","description":"BW3s","amount":"119.53","tag":"food"},
{"transactionID":254,"date":"2015-12-02","description":"Arco","amount":"111.16","tag":"automotive"},
{"transactionID":255,"date":"2016-06-05","description":"Oregon Theater","amount":"47.64","tag":"entertainment"},
{"transactionID":256,"date":"2016-01-27","description":"Arco","amount":"153.68","tag":"automotive"},
{"transactionID":257,"date":"2016-08-10","description":"Walmart","amount":"31.41","tag":"clothes"},
{"transactionID":258,"date":"2016-05-25","description":"New Seasons","amount":"143.37","tag":"food"},
{"transactionID":259,"date":"2015-11-04","description":"Coccoa","amount":"146.37","tag":"clothes"},
{"transactionID":260,"date":"2015-11-28","description":"Target","amount":"136.92","tag":"clothes"},
{"transactionID":261,"date":"2016-08-29","description":"Autozone","amount":"197.4","tag":"automotive"},
{"transactionID":262,"date":"2016-03-05","description":"Netflix","amount":"6.95","tag":"entertainment"},
{"transactionID":263,"date":"2016-01-14","description":"Starbucks","amount":"123.31","tag":"food"},
{"transactionID":264,"date":"2016-07-24","description":"Netflix","amount":"46.33","tag":"entertainment"},
{"transactionID":265,"date":"2016-06-28","description":"Shell","amount":"78.04","tag":"automotive"},
{"transactionID":266,"date":"2016-01-27","description":"Exxon Mobil","amount":"50.05","tag":"automotive"},
{"transactionID":267,"date":"2015-09-30","description":"Exxon Mobil","amount":"1.95","tag":"automotive"},
{"transactionID":268,"date":"2016-06-14","description":"Sassys","amount":"145.38","tag":"entertainment"},
{"transactionID":269,"date":"2016-07-02","description":"Arco","amount":"127.26","tag":"automotive"},
{"transactionID":270,"date":"2015-09-04","description":"Jiffy Lube","amount":"44.73","tag":"automotive"},
{"transactionID":271,"date":"2015-11-21","description":"Home Depot","amount":"128.05","tag":"home-improvement"},
{"transactionID":272,"date":"2016-08-06","description":"Amazon","amount":"52.93","tag":"automotive"},
{"transactionID":273,"date":"2016-06-08","description":"PGE","amount":"45.47","tag":"utilities"},
{"transactionID":274,"date":"2016-06-17","description":"New Seasons","amount":"198.73","tag":"food"},
{"transactionID":275,"date":"2015-10-09","description":"PGE","amount":"48.32","tag":"utilities"},
{"transactionID":276,"date":"2016-05-13","description":"Sassys","amount":"92.04","tag":"food"},
{"transactionID":277,"date":"2015-10-17","description":"Home Depot","amount":"58.31","tag":"other"},
{"transactionID":278,"date":"2016-02-19","description":"Exxon Mobil","amount":"60.08","tag":"automotive"},
{"transactionID":279,"date":"2015-09-10","description":"Amazon","amount":"8.96","tag":"medical"},
{"transactionID":280,"date":"2015-11-16","description":"Exxon Mobil","amount":"78.67","tag":"automotive"},
{"transactionID":281,"date":"2016-03-17","description":"Costco","amount":"108.52","tag":"entertainment"},
{"transactionID":282,"date":"2016-03-22","description":"Arco","amount":"8.78","tag":"automotive"},
{"transactionID":283,"date":"2016-07-28","description":"BW3s","amount":"137.78","tag":"food"},
{"transactionID":284,"date":"2016-01-12","description":"Target","amount":"29.24","tag":"other"},
{"transactionID":285,"date":"2016-05-12","description":"PGE","amount":"147.42","tag":"utilities"},
{"transactionID":286,"date":"2015-09-28","description":"BW3s","amount":"163.21","tag":"food"},
{"transactionID":287,"date":"2015-08-31","description":"Northwest Natural","amount":"40.93","tag":"utilities"},
{"transactionID":288,"date":"2015-12-30","description":"Exxon Mobil","amount":"6.1","tag":"automotive"},
{"transactionID":289,"date":"2015-09-11","description":"New Seasons","amount":"15.45","tag":"food"},
{"transactionID":290,"date":"2015-09-06","description":"Autozone","amount":"13.43","tag":"automotive"},
{"transactionID":291,"date":"2016-07-05","description":"Walmart","amount":"38.52","tag":"food"},
{"transactionID":292,"date":"2015-10-03","description":"Trader Joes","amount":"119.67","tag":"food"},
{"transactionID":293,"date":"2016-05-13","description":"Netflix","amount":"129.94","tag":"entertainment"},
{"transactionID":294,"date":"2016-03-17","description":"Target","amount":"14.95","tag":"medical"},
{"transactionID":295,"date":"2016-07-22","description":"Starbucks","amount":"106.32","tag":"other"},
{"transactionID":296,"date":"2016-05-28","description":"Autozone","amount":"93.47","tag":"automotive"},
{"transactionID":297,"date":"2016-07-27","description":"Oregon Theater","amount":"172.17","tag":"entertainment"},
{"transactionID":298,"date":"2016-07-19","description":"Shell","amount":"18.64","tag":"automotive"},
{"transactionID":299,"date":"2016-02-24","description":"Walmart","amount":"13.89","tag":"clothes"},
{"transactionID":300,"date":"2015-12-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":301,"date":"2015-12-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":302,"date":"2016-03-14","description":"Jiffy Lube","amount":"62.2","tag":"automotive"},
{"transactionID":303,"date":"2016-03-11","description":"Multnomah County","amount":"111.08","tag":"utilities"},
{"transactionID":304,"date":"2016-06-08","description":"PGE","amount":"166.05","tag":"utilities"},
{"transactionID":305,"date":"2016-04-17","description":"Shell","amount":"148.36","tag":"automotive"},
{"transactionID":306,"date":"2015-10-17","description":"Autozone","amount":"79.41","tag":"automotive"},
{"transactionID":307,"date":"2016-08-19","description":"Amazon","amount":"71.24","tag":"home-improvement"},
{"transactionID":308,"date":"2016-07-20","description":"Netflix","amount":"9.42","tag":"entertainment"},
{"transactionID":309,"date":"2016-02-18","description":"Fred Meyer","amount":"21.18","tag":"medical"},
{"transactionID":310,"date":"2015-10-02","description":"Shell","amount":"20.88","tag":"automotive"},
{"transactionID":311,"date":"2016-08-27","description":"Costco","amount":"184.08","tag":"automotive"},
{"transactionID":312,"date":"2016-04-10","description":"Amazon","amount":"75.55","tag":"other"},
{"transactionID":313,"date":"2015-12-16","description":"Sassys","amount":"133.02","tag":"food"},
{"transactionID":314,"date":"2015-10-02","description":"BW3s","amount":"4.38","tag":"food"},
{"transactionID":315,"date":"2016-06-07","description":"Exxon Mobil","amount":"106.23","tag":"automotive"},
{"transactionID":316,"date":"2015-09-30","description":"Sassys","amount":"12.05","tag":"entertainment"},
{"transactionID":317,"date":"2016-07-25","description":"PGE","amount":"165.47","tag":"utilities"},
{"transactionID":318,"date":"2015-10-21","description":"Home Depot","amount":"43.97","tag":"home-improvement"},
{"transactionID":319,"date":"2016-05-23","description":"Netflix","amount":"19.06","tag":"entertainment"},
{"transactionID":320,"date":"2016-04-28","description":"Multnomah County","amount":"192.99","tag":"other"},
{"transactionID":321,"date":"2016-03-01","description":"Chipoltle","amount":"82.85","tag":"food"},
{"transactionID":322,"date":"2016-06-14","description":"Arco","amount":"127.25","tag":"automotive"},
{"transactionID":323,"date":"2016-07-07","description":"Target","amount":"182.89","tag":"home-improvement"},
{"transactionID":324,"date":"2016-04-04","description":"Multnomah County","amount":"77.52","tag":"other"},
{"transactionID":325,"date":"2016-06-19","description":"Walmart","amount":"7.46","tag":"medical"},
{"transactionID":326,"date":"2016-02-18","description":"Lowes","amount":"133.06","tag":"other"},
{"transactionID":327,"date":"2016-07-24","description":"Autozone","amount":"10.04","tag":"automotive"},
{"transactionID":328,"date":"2016-03-25","description":"Shell","amount":"6.81","tag":"automotive"},
{"transactionID":329,"date":"2016-05-25","description":"Amazon","amount":"188.09","tag":"food"},
{"transactionID":330,"date":"2015-10-07","description":"Sassys","amount":"129.61","tag":"entertainment"},
{"transactionID":331,"date":"2016-08-04","description":"Amazon","amount":"31.48","tag":"entertainment"},
{"transactionID":332,"date":"2015-10-27","description":"Shell","amount":"6.11","tag":"automotive"},
{"transactionID":333,"date":"2016-03-02","description":"Fred Meyer","amount":"194.3","tag":"clothes"},
{"transactionID":334,"date":"2016-08-01","description":"Target","amount":"147.51","tag":"clothes"},
{"transactionID":335,"date":"2015-12-14","description":"Costco","amount":"131.15","tag":"other"},
{"transactionID":336,"date":"2015-09-26","description":"Home Depot","amount":"158.77","tag":"other"},
{"transactionID":337,"date":"2016-06-30","description":"Netflix","amount":"129.01","tag":"entertainment"},
{"transactionID":338,"date":"2015-11-09","description":"Lowes","amount":"11.78","tag":"other"},
{"transactionID":339,"date":"2015-12-25","description":"Sassys","amount":"17.91","tag":"entertainment"},
{"transactionID":340,"date":"2015-11-13","description":"Walmart","amount":"144.27","tag":"clothes"},
{"transactionID":341,"date":"2016-03-18","description":"BW3s","amount":"165.66","tag":"food"},
{"transactionID":342,"date":"2016-07-07","description":"BW3s","amount":"15.73","tag":"food"},
{"transactionID":343,"date":"2016-01-30","description":"New Seasons","amount":"187.87","tag":"other"},
{"transactionID":344,"date":"2015-12-20","description":"Sassys","amount":"51.08","tag":"entertainment"},
{"transactionID":345,"date":"2016-08-21","description":"Arco","amount":"130.45","tag":"automotive"},
{"transactionID":346,"date":"2016-02-14","description":"Home Depot","amount":"69.73","tag":"other"},
{"transactionID":347,"date":"2015-10-11","description":"Netflix","amount":"91.61","tag":"entertainment"},
{"transactionID":348,"date":"2016-04-21","description":"Fred Meyer","amount":"197.34","tag":"clothes"},
{"transactionID":349,"date":"2015-12-28","description":"Fred Meyer","amount":"116.67","tag":"home-improvement"},
{"transactionID":350,"date":"2016-01-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":351,"date":"2016-01-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":352,"date":"2016-08-19","description":"Northwest Natural","amount":"77.4","tag":"utilities"},
{"transactionID":353,"date":"2016-07-28","description":"Costco","amount":"154.21","tag":"medical"},
{"transactionID":354,"date":"2015-10-30","description":"Target","amount":"70.99","tag":"food"},
{"transactionID":355,"date":"2015-12-01","description":"BW3s","amount":"10.26","tag":"food"},
{"transactionID":356,"date":"2016-07-18","description":"Jiffy Lube","amount":"135.02","tag":"automotive"},
{"transactionID":357,"date":"2016-04-07","description":"Starbucks","amount":"122.68","tag":"food"},
{"transactionID":358,"date":"2016-05-10","description":"Autozone","amount":"75.25","tag":"automotive"},
{"transactionID":359,"date":"2016-04-06","description":"Shell","amount":"66.39","tag":"automotive"},
{"transactionID":360,"date":"2016-07-06","description":"Home Depot","amount":"101.29","tag":"other"},
{"transactionID":361,"date":"2015-10-06","description":"Arco","amount":"127.36","tag":"automotive"},
{"transactionID":362,"date":"2016-02-09","description":"Home Depot","amount":"104.56","tag":"home-improvement"},
{"transactionID":363,"date":"2015-09-20","description":"Arco","amount":"120.23","tag":"automotive"},
{"transactionID":364,"date":"2016-08-23","description":"Fred Meyer","amount":"101.96","tag":"entertainment"},
{"transactionID":365,"date":"2016-03-18","description":"Exxon Mobil","amount":"51.27","tag":"automotive"},
{"transactionID":366,"date":"2016-02-11","description":"Jiffy Lube","amount":"99.42","tag":"automotive"},
{"transactionID":367,"date":"2016-04-26","description":"Exxon Mobil","amount":"71.3","tag":"automotive"},
{"transactionID":368,"date":"2016-05-21","description":"Oregon Theater","amount":"84.63","tag":"entertainment"},
{"transactionID":369,"date":"2016-08-01","description":"Fred Meyer","amount":"143.13","tag":"food"},
{"transactionID":370,"date":"2015-09-12","description":"Jiffy Lube","amount":"195.25","tag":"automotive"},
{"transactionID":371,"date":"2016-03-15","description":"New Seasons","amount":"61.0","tag":"food"},
{"transactionID":372,"date":"2016-03-01","description":"Fred Meyer","amount":"151.59","tag":"clothes"},
{"transactionID":373,"date":"2015-11-07","description":"Tacobell","amount":"120.68","tag":"food"},
{"transactionID":374,"date":"2016-01-10","description":"Autozone","amount":"29.82","tag":"automotive"},
{"transactionID":375,"date":"2015-12-13","description":"Walmart","amount":"110.83","tag":"other"},
{"transactionID":376,"date":"2016-01-09","description":"Fred Meyer","amount":"18.7","tag":"entertainment"},
{"transactionID":377,"date":"2015-09-25","description":"Oregon Theater","amount":"28.27","tag":"entertainment"},
{"transactionID":378,"date":"2016-05-22","description":"Fred Meyer","amount":"157.91","tag":"food"},
{"transactionID":379,"date":"2016-02-06","description":"Target","amount":"148.36","tag":"home-improvement"},
{"transactionID":380,"date":"2016-07-12","description":"Exxon Mobil","amount":"168.98","tag":"automotive"},
{"transactionID":381,"date":"2016-05-29","description":"Oregon Theater","amount":"180.91","tag":"entertainment"},
{"transactionID":382,"date":"2015-10-05","description":"Jiffy Lube","amount":"41.9","tag":"automotive"},
{"transactionID":383,"date":"2016-02-03","description":"Tacobell","amount":"97.99","tag":"food"},
{"transactionID":384,"date":"2016-07-07","description":"Northwest Natural","amount":"13.91","tag":"utilities"},
{"transactionID":385,"date":"2015-09-18","description":"Fred Meyer","amount":"100.59","tag":"food"},
{"transactionID":386,"date":"2015-09-07","description":"New Seasons","amount":"163.99","tag":"food"},
{"transactionID":387,"date":"2016-04-03","description":"Jiffy Lube","amount":"112.86","tag":"automotive"},
{"transactionID":388,"date":"2015-10-08","description":"Walmart","amount":"25.88","tag":"clothes"},
{"transactionID":389,"date":"2016-08-07","description":"Arco","amount":"104.05","tag":"automotive"},
{"transactionID":390,"date":"2015-09-29","description":"Jiffy Lube","amount":"150.14","tag":"automotive"},
{"transactionID":391,"date":"2015-09-01","description":"Multnomah County","amount":"75.86","tag":"other"},
{"transactionID":392,"date":"2016-08-16","description":"Starbucks","amount":"191.53","tag":"food"},
{"transactionID":393,"date":"2016-04-30","description":"Jiffy Lube","amount":"144.32","tag":"automotive"},
{"transactionID":394,"date":"2016-02-24","description":"Trader Joes","amount":"74.91","tag":"food"},
{"transactionID":395,"date":"2016-05-08","description":"Autozone","amount":"100.27","tag":"automotive"},
{"transactionID":396,"date":"2016-01-02","description":"Target","amount":"37.62","tag":"entertainment"},
{"transactionID":397,"date":"2016-03-30","description":"Multnomah County","amount":"91.58","tag":"other"},
{"transactionID":398,"date":"2016-01-24","description":"Exxon Mobil","amount":"122.19","tag":"automotive"},
{"transactionID":399,"date":"2016-08-07","description":"PGE","amount":"78.62","tag":"utilities"},
{"transactionID":400,"date":"2016-02-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":401,"date":"2016-02-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":402,"date":"2016-06-03","description":"Amazon","amount":"65.13","tag":"food"},
{"transactionID":403,"date":"2016-03-06","description":"Exxon Mobil","amount":"188.29","tag":"automotive"},
{"transactionID":404,"date":"2016-01-12","description":"Northwest Natural","amount":"105.4","tag":"utilities"},
{"transactionID":405,"date":"2016-02-14","description":"Multnomah County","amount":"177.21","tag":"utilities"},
{"transactionID":406,"date":"2016-01-24","description":"Amazon","amount":"199.14","tag":"clothes"},
{"transactionID":407,"date":"2016-06-01","description":"Costco","amount":"82.06","tag":"food"},
{"transactionID":408,"date":"2016-04-28","description":"Netflix","amount":"29.31","tag":"entertainment"},
{"transactionID":409,"date":"2016-08-17","description":"Sassys","amount":"161.92","tag":"entertainment"},
{"transactionID":410,"date":"2016-03-02","description":"Jiffy Lube","amount":"117.95","tag":"automotive"},
{"transactionID":411,"date":"2015-11-19","description":"Netflix","amount":"126.83","tag":"entertainment"},
{"transactionID":412,"date":"2015-09-06","description":"Tacobell","amount":"171.73","tag":"food"},
{"transactionID":413,"date":"2015-10-05","description":"New Seasons","amount":"1.44","tag":"food"},
{"transactionID":414,"date":"2016-08-24","description":"Walmart","amount":"20.68","tag":"food"},
{"transactionID":415,"date":"2015-12-26","description":"Trader Joes","amount":"70.9","tag":"food"},
{"transactionID":416,"date":"2015-11-16","description":"Arco","amount":"147.22","tag":"automotive"},
{"transactionID":417,"date":"2016-01-27","description":"Costco","amount":"41.29","tag":"automotive"},
{"transactionID":418,"date":"2016-04-20","description":"Arco","amount":"28.52","tag":"automotive"},
{"transactionID":419,"date":"2016-06-17","description":"Lowes","amount":"167.94","tag":"home-improvement"},
{"transactionID":420,"date":"2016-03-17","description":"Multnomah County","amount":"52.89","tag":"utilities"},
{"transactionID":421,"date":"2016-07-07","description":"Target","amount":"72.0","tag":"home-improvement"},
{"transactionID":422,"date":"2016-05-15","description":"PGE","amount":"19.7","tag":"utilities"},
{"transactionID":423,"date":"2015-12-08","description":"Trader Joes","amount":"153.08","tag":"food"},
{"transactionID":424,"date":"2015-11-23","description":"Sassys","amount":"100.37","tag":"entertainment"},
{"transactionID":425,"date":"2016-01-02","description":"Home Depot","amount":"199.12","tag":"home-improvement"},
{"transactionID":426,"date":"2015-12-08","description":"Northwest Natural","amount":"157.76","tag":"utilities"},
{"transactionID":427,"date":"2016-06-28","description":"Multnomah County","amount":"131.51","tag":"other"},
{"transactionID":428,"date":"2016-08-24","description":"Target","amount":"70.59","tag":"clothes"},
{"transactionID":429,"date":"2015-10-13","description":"Walmart","amount":"16.59","tag":"food"},
{"transactionID":430,"date":"2016-04-21","description":"Chipoltle","amount":"113.57","tag":"food"},
{"transactionID":431,"date":"2015-12-03","description":"BW3s","amount":"28.18","tag":"food"},
{"transactionID":432,"date":"2015-12-27","description":"Fred Meyer","amount":"156.94","tag":"medical"},
{"transactionID":433,"date":"2016-04-09","description":"Shell","amount":"2.82","tag":"automotive"},
{"transactionID":434,"date":"2015-12-30","description":"Exxon Mobil","amount":"94.82","tag":"automotive"},
{"transactionID":435,"date":"2016-03-26","description":"PGE","amount":"150.8","tag":"utilities"},
{"transactionID":436,"date":"2015-12-18","description":"Coccoa","amount":"120.22","tag":"utilities"},
{"transactionID":437,"date":"2015-12-22","description":"Home Depot","amount":"194.54","tag":"home-improvement"},
{"transactionID":438,"date":"2016-01-19","description":"Shell","amount":"72.87","tag":"automotive"},
{"transactionID":439,"date":"2016-04-19","description":"Chipoltle","amount":"31.89","tag":"food"},
{"transactionID":440,"date":"2016-01-27","description":"Chipoltle","amount":"163.52","tag":"food"},
{"transactionID":441,"date":"2016-01-09","description":"Trader Joes","amount":"66.26","tag":"food"},
{"transactionID":442,"date":"2016-05-23","description":"PGE","amount":"27.52","tag":"utilities"},
{"transactionID":443,"date":"2016-07-28","description":"Exxon Mobil","amount":"38.51","tag":"automotive"},
{"transactionID":444,"date":"2015-11-12","description":"Autozone","amount":"107.46","tag":"automotive"},
{"transactionID":445,"date":"2015-08-31","description":"Multnomah County","amount":"149.17","tag":"other"},
{"transactionID":446,"date":"2016-01-24","description":"Autozone","amount":"71.03","tag":"automotive"},
{"transactionID":447,"date":"2015-11-21","description":"New Seasons","amount":"31.75","tag":"food"},
{"transactionID":448,"date":"2016-08-13","description":"Sassys","amount":"196.34","tag":"other"},
{"transactionID":449,"date":"2016-02-21","description":"Exxon Mobil","amount":"138.86","tag":"automotive"},
{"transactionID":450,"date":"2016-04-21","description":"Chipoltle","amount":"190.24","tag":"food"},
{"transactionID":451,"date":"2015-11-23","description":"PGE","amount":"94.49","tag":"utilities"},
{"transactionID":452,"date":"2015-09-23","description":"Lowes","amount":"172.12","tag":"home-improvement"},
{"transactionID":453,"date":"2016-05-22","description":"Fred Meyer","amount":"59.64","tag":"food"},
{"transactionID":454,"date":"2015-11-15","description":"Target","amount":"166.82","tag":"medical"},
{"transactionID":455,"date":"2016-01-21","description":"Shell","amount":"78.8","tag":"automotive"},
{"transactionID":456,"date":"2015-10-26","description":"Fred Meyer","amount":"65.52","tag":"clothes"},
{"transactionID":457,"date":"2016-08-05","description":"Shell","amount":"169.73","tag":"automotive"},
{"transactionID":458,"date":"2016-04-18","description":"Exxon Mobil","amount":"56.12","tag":"automotive"},
{"transactionID":459,"date":"2015-11-16","description":"Fred Meyer","amount":"69.6","tag":"clothes"},
{"transactionID":460,"date":"2016-04-01","description":"Coccoa","amount":"136.84","tag":"other"},
{"transactionID":461,"date":"2016-05-23","description":"Northwest Natural","amount":"196.08","tag":"utilities"},
{"transactionID":462,"date":"2015-09-17","description":"Lowes","amount":"90.29","tag":"other"},
{"transactionID":463,"date":"2016-08-02","description":"Coccoa","amount":"26.13","tag":"income"},
{"transactionID":464,"date":"2016-07-24","description":"Coccoa","amount":"24.01","tag":"utilities"},
{"transactionID":465,"date":"2016-01-30","description":"Jiffy Lube","amount":"55.61","tag":"automotive"},
{"transactionID":466,"date":"2015-10-29","description":"Chipoltle","amount":"52.18","tag":"food"},
{"transactionID":467,"date":"2016-04-12","description":"Coccoa","amount":"73.13","tag":"food"},
{"transactionID":468,"date":"2016-03-12","description":"PGE","amount":"111.74","tag":"utilities"},
{"transactionID":469,"date":"2016-06-11","description":"Target","amount":"85.42","tag":"home-improvement"},
{"transactionID":470,"date":"2015-11-20","description":"Arco","amount":"132.32","tag":"automotive"},
{"transactionID":471,"date":"2015-11-09","description":"Oregon Theater","amount":"66.44","tag":"entertainment"},
{"transactionID":472,"date":"2016-05-05","description":"BW3s","amount":"69.13","tag":"food"},
{"transactionID":473,"date":"2016-05-10","description":"Fred Meyer","amount":"166.41","tag":"entertainment"},
{"transactionID":474,"date":"2015-09-26","description":"New Seasons","amount":"176.66","tag":"other"},
{"transactionID":475,"date":"2015-10-03","description":"PGE","amount":"68.44","tag":"utilities"},
{"transactionID":476,"date":"2016-01-23","description":"Arco","amount":"179.14","tag":"automotive"},
{"transactionID":477,"date":"2015-12-08","description":"Home Depot","amount":"182.98","tag":"other"},
{"transactionID":478,"date":"2015-11-09","description":"Arco","amount":"69.45","tag":"automotive"},
{"transactionID":479,"date":"2016-01-15","description":"Netflix","amount":"143.94","tag":"entertainment"},
{"transactionID":480,"date":"2016-03-05","description":"Arco","amount":"18.08","tag":"automotive"},
{"transactionID":481,"date":"2015-09-03","description":"Trader Joes","amount":"191.18","tag":"food"},
{"transactionID":482,"date":"2015-10-27","description":"BW3s","amount":"18.04","tag":"food"},
{"transactionID":483,"date":"2016-02-29","description":"Northwest Natural","amount":"21.74","tag":"utilities"},
{"transactionID":484,"date":"2015-11-25","description":"Tacobell","amount":"168.16","tag":"food"},
{"transactionID":485,"date":"2016-02-17","description":"Fred Meyer","amount":"148.7","tag":"home-improvement"},
{"transactionID":486,"date":"2016-05-27","description":"Northwest Natural","amount":"145.6","tag":"utilities"},
{"transactionID":487,"date":"2016-05-09","description":"Trader Joes","amount":"45.87","tag":"food"},
{"transactionID":488,"date":"2015-08-31","description":"Exxon Mobil","amount":"157.18","tag":"automotive"},
{"transactionID":489,"date":"2016-02-05","description":"Netflix","amount":"112.95","tag":"entertainment"},
{"transactionID":490,"date":"2016-01-08","description":"Netflix","amount":"124.91","tag":"entertainment"},
{"transactionID":491,"date":"2015-12-11","description":"BW3s","amount":"101.75","tag":"food"},
{"transactionID":492,"date":"2016-04-16","description":"New Seasons","amount":"149.19","tag":"other"},
{"transactionID":493,"date":"2016-08-01","description":"Costco","amount":"20.27","tag":"home-improvement"},
{"transactionID":494,"date":"2016-06-01","description":"Costco","amount":"83.02","tag":"food"},
{"transactionID":495,"date":"2016-04-28","description":"Coccoa","amount":"137.06","tag":"automotive"},
{"transactionID":496,"date":"2016-05-17","description":"Lowes","amount":"119.53","tag":"home-improvement"},
{"transactionID":497,"date":"2015-12-13","description":"PGE","amount":"153.55","tag":"utilities"},
{"transactionID":498,"date":"2015-09-13","description":"Sassys","amount":"183.41","tag":"entertainment"},
{"transactionID":499,"date":"2015-11-08","description":"Northwest Natural","amount":"102.27","tag":"utilities"},
{"transactionID":500,"date":"2016-03-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":501,"date":"2016-03-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":502,"date":"2015-10-18","description":"Sassys","amount":"123.33","tag":"food"},
{"transactionID":503,"date":"2016-04-17","description":"Target","amount":"179.63","tag":"clothes"},
{"transactionID":504,"date":"2016-01-16","description":"Costco","amount":"134.06","tag":"food"},
{"transactionID":505,"date":"2016-03-17","description":"Chipoltle","amount":"112.09","tag":"food"},
{"transactionID":506,"date":"2016-06-30","description":"Sassys","amount":"110.18","tag":"entertainment"},
{"transactionID":507,"date":"2016-04-24","description":"Trader Joes","amount":"67.17","tag":"food"},
{"transactionID":508,"date":"2016-02-15","description":"Starbucks","amount":"80.34","tag":"food"},
{"transactionID":509,"date":"2016-03-01","description":"Oregon Theater","amount":"13.66","tag":"entertainment"},
{"transactionID":510,"date":"2016-02-25","description":"Trader Joes","amount":"187.77","tag":"other"},
{"transactionID":511,"date":"2015-11-18","description":"Netflix","amount":"15.48","tag":"entertainment"},
{"transactionID":512,"date":"2016-05-18","description":"Coccoa","amount":"112.82","tag":"clothes"},
{"transactionID":513,"date":"2015-10-03","description":"BW3s","amount":"90.93","tag":"food"},
{"transactionID":514,"date":"2016-03-23","description":"Amazon","amount":"104.08","tag":"automotive"},
{"transactionID":515,"date":"2016-08-06","description":"Oregon Theater","amount":"157.52","tag":"entertainment"},
{"transactionID":516,"date":"2016-07-20","description":"PGE","amount":"131.22","tag":"utilities"},
{"transactionID":517,"date":"2016-05-30","description":"PGE","amount":"60.63","tag":"utilities"},
{"transactionID":518,"date":"2016-04-30","description":"PGE","amount":"50.8","tag":"utilities"},
{"transactionID":519,"date":"2016-03-17","description":"Walmart","amount":"86.39","tag":"entertainment"},
{"transactionID":520,"date":"2016-03-04","description":"Shell","amount":"138.94","tag":"automotive"},
{"transactionID":521,"date":"2015-11-09","description":"Amazon","amount":"28.73","tag":"medical"},
{"transactionID":522,"date":"2016-07-28","description":"Trader Joes","amount":"151.59","tag":"food"},
{"transactionID":523,"date":"2016-08-03","description":"BW3s","amount":"179.39","tag":"food"},
{"transactionID":524,"date":"2016-07-30","description":"Amazon","amount":"141.8","tag":"medical"},
{"transactionID":525,"date":"2015-10-25","description":"Sassys","amount":"199.65","tag":"entertainment"},
{"transactionID":526,"date":"2016-01-30","description":"Netflix","amount":"43.83","tag":"entertainment"},
{"transactionID":527,"date":"2016-07-15","description":"Sassys","amount":"178.64","tag":"entertainment"},
{"transactionID":528,"date":"2015-10-21","description":"Jiffy Lube","amount":"77.77","tag":"automotive"},
{"transactionID":529,"date":"2016-05-18","description":"Sassys","amount":"96.92","tag":"food"},
{"transactionID":530,"date":"2016-03-28","description":"Jiffy Lube","amount":"121.47","tag":"automotive"},
{"transactionID":531,"date":"2015-12-30","description":"Netflix","amount":"96.23","tag":"entertainment"},
{"transactionID":532,"date":"2016-08-27","description":"Trader Joes","amount":"162.44","tag":"food"},
{"transactionID":533,"date":"2015-11-03","description":"Multnomah County","amount":"199.19","tag":"other"},
{"transactionID":534,"date":"2016-07-16","description":"Sassys","amount":"29.67","tag":"food"},
{"transactionID":535,"date":"2015-11-07","description":"Starbucks","amount":"65.99","tag":"food"},
{"transactionID":536,"date":"2016-06-04","description":"Home Depot","amount":"28.34","tag":"home-improvement"},
{"transactionID":537,"date":"2015-09-02","description":"Tacobell","amount":"26.26","tag":"food"},
{"transactionID":538,"date":"2016-03-20","description":"PGE","amount":"179.72","tag":"utilities"},
{"transactionID":539,"date":"2016-04-20","description":"Chipoltle","amount":"148.02","tag":"food"},
{"transactionID":540,"date":"2015-12-12","description":"Arco","amount":"43.97","tag":"automotive"},
{"transactionID":541,"date":"2015-11-26","description":"Northwest Natural","amount":"127.27","tag":"utilities"},
{"transactionID":542,"date":"2016-04-28","description":"Netflix","amount":"34.55","tag":"entertainment"},
{"transactionID":543,"date":"2016-05-04","description":"Walmart","amount":"161.26","tag":"other"},
{"transactionID":544,"date":"2015-10-23","description":"Amazon","amount":"49.74","tag":"other"},
{"transactionID":545,"date":"2016-02-28","description":"Fred Meyer","amount":"26.35","tag":"food"},
{"transactionID":546,"date":"2015-09-28","description":"Northwest Natural","amount":"61.77","tag":"utilities"},
{"transactionID":547,"date":"2016-05-02","description":"Trader Joes","amount":"120.25","tag":"food"},
{"transactionID":548,"date":"2016-02-12","description":"Coccoa","amount":"49.2","tag":"utilities"},
{"transactionID":549,"date":"2016-02-23","description":"BW3s","amount":"126.34","tag":"food"},
{"transactionID":550,"date":"2016-08-14","description":"Costco","amount":"20.74","tag":"other"},
{"transactionID":551,"date":"2015-12-11","description":"Arco","amount":"104.69","tag":"automotive"},
{"transactionID":552,"date":"2016-01-31","description":"Home Depot","amount":"153.13","tag":"other"},
{"transactionID":553,"date":"2016-02-20","description":"Oregon Theater","amount":"127.94","tag":"entertainment"},
{"transactionID":554,"date":"2015-11-14","description":"Trader Joes","amount":"49.25","tag":"food"},
{"transactionID":555,"date":"2015-12-01","description":"Tacobell","amount":"33.74","tag":"food"},
{"transactionID":556,"date":"2016-08-22","description":"BW3s","amount":"141.52","tag":"food"},
{"transactionID":557,"date":"2015-09-21","description":"Multnomah County","amount":"107.6","tag":"other"},
{"transactionID":558,"date":"2016-03-09","description":"Chipoltle","amount":"168.19","tag":"food"},
{"transactionID":559,"date":"2015-09-05","description":"Jiffy Lube","amount":"109.8","tag":"automotive"},
{"transactionID":560,"date":"2015-10-01","description":"Jiffy Lube","amount":"151.53","tag":"automotive"},
{"transactionID":561,"date":"2015-10-14","description":"Trader Joes","amount":"157.89","tag":"other"},
{"transactionID":562,"date":"2016-04-14","description":"Fred Meyer","amount":"116.81","tag":"food"},
{"transactionID":563,"date":"2016-02-21","description":"Tacobell","amount":"76.82","tag":"food"},
{"transactionID":564,"date":"2016-08-28","description":"Oregon Theater","amount":"171.48","tag":"entertainment"},
{"transactionID":565,"date":"2016-08-16","description":"Shell","amount":"24.42","tag":"automotive"},
{"transactionID":566,"date":"2016-08-09","description":"Starbucks","amount":"144.5","tag":"food"},
{"transactionID":567,"date":"2016-04-12","description":"Jiffy Lube","amount":"46.12","tag":"automotive"},
{"transactionID":568,"date":"2016-02-27","description":"Sassys","amount":"79.54","tag":"entertainment"},
{"transactionID":569,"date":"2016-01-25","description":"Tacobell","amount":"10.52","tag":"food"},
{"transactionID":570,"date":"2016-07-18","description":"Coccoa","amount":"35.58","tag":"clothes"},
{"transactionID":571,"date":"2016-05-08","description":"Autozone","amount":"74.07","tag":"automotive"},
{"transactionID":572,"date":"2016-05-16","description":"Arco","amount":"33.33","tag":"automotive"},
{"transactionID":573,"date":"2016-03-18","description":"Lowes","amount":"108.89","tag":"other"},
{"transactionID":574,"date":"2016-03-24","description":"Shell","amount":"121.36","tag":"automotive"},
{"transactionID":575,"date":"2015-09-22","description":"Arco","amount":"171.9","tag":"automotive"},
{"transactionID":576,"date":"2016-08-28","description":"Chipoltle","amount":"175.44","tag":"food"},
{"transactionID":577,"date":"2016-05-17","description":"Coccoa","amount":"80.35","tag":"rent"},
{"transactionID":578,"date":"2016-02-03","description":"Sassys","amount":"91.63","tag":"entertainment"},
{"transactionID":579,"date":"2016-05-06","description":"Costco","amount":"39.14","tag":"entertainment"},
{"transactionID":580,"date":"2015-12-23","description":"Jiffy Lube","amount":"193.55","tag":"automotive"},
{"transactionID":581,"date":"2016-01-03","description":"Oregon Theater","amount":"199.98","tag":"entertainment"},
{"transactionID":582,"date":"2015-09-03","description":"Lowes","amount":"36.46","tag":"home-improvement"},
{"transactionID":583,"date":"2016-01-07","description":"Autozone","amount":"112.31","tag":"automotive"},
{"transactionID":584,"date":"2016-07-24","description":"BW3s","amount":"31.17","tag":"food"},
{"transactionID":585,"date":"2016-02-09","description":"Amazon","amount":"55.1","tag":"home-improvement"},
{"transactionID":586,"date":"2016-05-24","description":"New Seasons","amount":"110.52","tag":"other"},
{"transactionID":587,"date":"2016-05-04","description":"Oregon Theater","amount":"167.79","tag":"entertainment"},
{"transactionID":588,"date":"2015-11-19","description":"Arco","amount":"184.36","tag":"automotive"},
{"transactionID":589,"date":"2015-09-05","description":"BW3s","amount":"176.39","tag":"food"},
{"transactionID":590,"date":"2016-08-23","description":"Jiffy Lube","amount":"100.24","tag":"automotive"},
{"transactionID":591,"date":"2015-12-03","description":"Lowes","amount":"109.98","tag":"other"},
{"transactionID":592,"date":"2016-03-30","description":"PGE","amount":"51.53","tag":"utilities"},
{"transactionID":593,"date":"2016-06-16","description":"BW3s","amount":"143.94","tag":"food"},
{"transactionID":594,"date":"2016-02-12","description":"Target","amount":"125.63","tag":"food"},
{"transactionID":595,"date":"2016-07-26","description":"New Seasons","amount":"116.48","tag":"other"},
{"transactionID":596,"date":"2016-03-13","description":"Multnomah County","amount":"84.23","tag":"other"},
{"transactionID":597,"date":"2015-09-18","description":"Northwest Natural","amount":"42.12","tag":"utilities"},
{"transactionID":598,"date":"2016-04-13","description":"Tacobell","amount":"196.83","tag":"food"},
{"transactionID":599,"date":"2015-11-18","description":"Walmart","amount":"22.38","tag":"food"},
{"transactionID":600,"date":"2016-04-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":601,"date":"2016-04-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":602,"date":"2015-10-11","description":"Arco","amount":"56.15","tag":"automotive"},
{"transactionID":603,"date":"2016-06-07","description":"PGE","amount":"53.25","tag":"utilities"},
{"transactionID":604,"date":"2016-08-09","description":"Arco","amount":"27.91","tag":"automotive"},
{"transactionID":605,"date":"2016-04-01","description":"Fred Meyer","amount":"28.84","tag":"other"},
{"transactionID":606,"date":"2016-07-08","description":"Lowes","amount":"156.49","tag":"home-improvement"},
{"transactionID":607,"date":"2016-01-10","description":"Arco","amount":"143.9","tag":"automotive"},
{"transactionID":608,"date":"2016-02-23","description":"Northwest Natural","amount":"77.28","tag":"utilities"},
{"transactionID":609,"date":"2016-08-01","description":"Home Depot","amount":"94.13","tag":"home-improvement"},
{"transactionID":610,"date":"2016-04-07","description":"PGE","amount":"135.98","tag":"utilities"},
{"transactionID":611,"date":"2015-11-17","description":"Target","amount":"26.85","tag":"entertainment"},
{"transactionID":612,"date":"2016-01-29","description":"Sassys","amount":"151.05","tag":"entertainment"},
{"transactionID":613,"date":"2016-03-23","description":"Autozone","amount":"5.42","tag":"automotive"},
{"transactionID":614,"date":"2016-05-23","description":"Chipoltle","amount":"152.91","tag":"food"},
{"transactionID":615,"date":"2016-01-09","description":"Starbucks","amount":"117.68","tag":"other"},
{"transactionID":616,"date":"2015-11-22","description":"Starbucks","amount":"95.21","tag":"other"},
{"transactionID":617,"date":"2016-03-04","description":"Lowes","amount":"129.54","tag":"home-improvement"},
{"transactionID":618,"date":"2016-05-05","description":"Multnomah County","amount":"34.8","tag":"other"},
{"transactionID":619,"date":"2015-09-23","description":"Netflix","amount":"179.05","tag":"entertainment"},
{"transactionID":620,"date":"2016-08-18","description":"Shell","amount":"43.58","tag":"automotive"},
{"transactionID":621,"date":"2016-08-30","description":"Walmart","amount":"54.14","tag":"medical"},
{"transactionID":622,"date":"2015-10-24","description":"PGE","amount":"166.07","tag":"utilities"},
{"transactionID":623,"date":"2016-06-30","description":"Target","amount":"19.63","tag":"entertainment"},
{"transactionID":624,"date":"2015-11-10","description":"BW3s","amount":"33.45","tag":"food"},
{"transactionID":625,"date":"2016-06-08","description":"Amazon","amount":"32.77","tag":"medical"},
{"transactionID":626,"date":"2016-05-22","description":"Exxon Mobil","amount":"63.29","tag":"automotive"},
{"transactionID":627,"date":"2016-02-12","description":"Tacobell","amount":"170.64","tag":"food"},
{"transactionID":628,"date":"2016-08-12","description":"Northwest Natural","amount":"86.77","tag":"utilities"},
{"transactionID":629,"date":"2016-01-06","description":"Jiffy Lube","amount":"195.5","tag":"automotive"},
{"transactionID":630,"date":"2016-01-15","description":"Sassys","amount":"89.82","tag":"entertainment"},
{"transactionID":631,"date":"2016-05-01","description":"Netflix","amount":"99.73","tag":"entertainment"},
{"transactionID":632,"date":"2015-10-18","description":"Trader Joes","amount":"83.4","tag":"food"},
{"transactionID":633,"date":"2016-08-01","description":"Tacobell","amount":"59.14","tag":"food"},
{"transactionID":634,"date":"2016-04-05","description":"Home Depot","amount":"96.06","tag":"other"},
{"transactionID":635,"date":"2016-02-24","description":"Netflix","amount":"83.33","tag":"entertainment"},
{"transactionID":636,"date":"2015-10-27","description":"Arco","amount":"13.88","tag":"automotive"},
{"transactionID":637,"date":"2016-02-29","description":"Trader Joes","amount":"12.51","tag":"food"},
{"transactionID":638,"date":"2016-04-12","description":"Oregon Theater","amount":"39.69","tag":"entertainment"},
{"transactionID":639,"date":"2016-02-11","description":"Trader Joes","amount":"13.4","tag":"other"},
{"transactionID":640,"date":"2016-01-17","description":"Oregon Theater","amount":"32.85","tag":"entertainment"},
{"transactionID":641,"date":"2016-06-03","description":"Multnomah County","amount":"132.94","tag":"other"},
{"transactionID":642,"date":"2016-03-07","description":"Autozone","amount":"96.94","tag":"automotive"},
{"transactionID":643,"date":"2016-08-10","description":"Exxon Mobil","amount":"54.32","tag":"automotive"},
{"transactionID":644,"date":"2016-06-14","description":"Walmart","amount":"33.63","tag":"other"},
{"transactionID":645,"date":"2016-02-24","description":"Target","amount":"89.31","tag":"medical"},
{"transactionID":646,"date":"2015-11-15","description":"Sassys","amount":"152.84","tag":"entertainment"},
{"transactionID":647,"date":"2016-07-18","description":"Fred Meyer","amount":"22.05","tag":"home-improvement"},
{"transactionID":648,"date":"2016-01-26","description":"Amazon","amount":"193.79","tag":"automotive"},
{"transactionID":649,"date":"2016-05-13","description":"Coccoa","amount":"135.81","tag":"automotive"},
{"transactionID":650,"date":"2016-05-29","description":"Chipoltle","amount":"65.14","tag":"food"},
{"transactionID":651,"date":"2016-04-26","description":"Jiffy Lube","amount":"55.22","tag":"automotive"},
{"transactionID":652,"date":"2016-04-09","description":"Coccoa","amount":"163.66","tag":"utilities"},
{"transactionID":653,"date":"2015-11-10","description":"Multnomah County","amount":"172.78","tag":"utilities"},
{"transactionID":654,"date":"2016-04-06","description":"Tacobell","amount":"192.98","tag":"food"},
{"transactionID":655,"date":"2015-11-27","description":"New Seasons","amount":"157.86","tag":"food"},
{"transactionID":656,"date":"2016-05-10","description":"Home Depot","amount":"85.32","tag":"home-improvement"},
{"transactionID":657,"date":"2016-03-01","description":"Trader Joes","amount":"170.57","tag":"other"},
{"transactionID":658,"date":"2016-08-15","description":"New Seasons","amount":"173.24","tag":"food"},
{"transactionID":659,"date":"2016-03-04","description":"New Seasons","amount":"11.68","tag":"food"},
{"transactionID":660,"date":"2016-01-08","description":"Chipoltle","amount":"176.68","tag":"food"},
{"transactionID":661,"date":"2016-05-08","description":"Starbucks","amount":"72.93","tag":"food"},
{"transactionID":662,"date":"2016-02-06","description":"Lowes","amount":"93.3","tag":"other"},
{"transactionID":663,"date":"2015-12-20","description":"Northwest Natural","amount":"83.88","tag":"utilities"},
{"transactionID":664,"date":"2016-08-23","description":"Costco","amount":"78.07","tag":"entertainment"},
{"transactionID":665,"date":"2016-02-23","description":"BW3s","amount":"63.08","tag":"food"},
{"transactionID":666,"date":"2015-12-08","description":"Northwest Natural","amount":"199.93","tag":"utilities"},
{"transactionID":667,"date":"2016-08-08","description":"Walmart","amount":"29.95","tag":"food"},
{"transactionID":668,"date":"2016-08-20","description":"PGE","amount":"134.72","tag":"utilities"},
{"transactionID":669,"date":"2016-06-25","description":"BW3s","amount":"177.73","tag":"food"},
{"transactionID":670,"date":"2016-04-27","description":"Northwest Natural","amount":"62.1","tag":"utilities"},
{"transactionID":671,"date":"2016-03-27","description":"PGE","amount":"156.41","tag":"utilities"},
{"transactionID":672,"date":"2016-04-23","description":"Chipoltle","amount":"110.46","tag":"food"},
{"transactionID":673,"date":"2016-07-23","description":"Home Depot","amount":"89.49","tag":"other"},
{"transactionID":674,"date":"2015-11-17","description":"Jiffy Lube","amount":"5.77","tag":"automotive"},
{"transactionID":675,"date":"2015-10-11","description":"Autozone","amount":"195.99","tag":"automotive"},
{"transactionID":676,"date":"2016-05-12","description":"PGE","amount":"126.45","tag":"utilities"},
{"transactionID":677,"date":"2015-12-23","description":"Jiffy Lube","amount":"28.44","tag":"automotive"},
{"transactionID":678,"date":"2016-02-27","description":"Shell","amount":"94.63","tag":"automotive"},
{"transactionID":679,"date":"2016-05-07","description":"Home Depot","amount":"31.83","tag":"other"},
{"transactionID":680,"date":"2016-03-03","description":"Lowes","amount":"45.19","tag":"home-improvement"},
{"transactionID":681,"date":"2016-08-11","description":"Fred Meyer","amount":"176.02","tag":"food"},
{"transactionID":682,"date":"2016-03-27","description":"Target","amount":"182.55","tag":"medical"},
{"transactionID":683,"date":"2015-09-03","description":"Trader Joes","amount":"2.12","tag":"food"},
{"transactionID":684,"date":"2016-08-16","description":"BW3s","amount":"136.62","tag":"food"},
{"transactionID":685,"date":"2015-10-07","description":"Netflix","amount":"36.22","tag":"entertainment"},
{"transactionID":686,"date":"2015-09-04","description":"Northwest Natural","amount":"174.5","tag":"utilities"},
{"transactionID":687,"date":"2016-03-27","description":"Shell","amount":"108.38","tag":"automotive"},
{"transactionID":688,"date":"2016-08-21","description":"Fred Meyer","amount":"14.12","tag":"entertainment"},
{"transactionID":689,"date":"2016-03-07","description":"Shell","amount":"83.8","tag":"automotive"},
{"transactionID":690,"date":"2016-01-10","description":"Target","amount":"167.3","tag":"home-improvement"},
{"transactionID":691,"date":"2016-06-11","description":"Tacobell","amount":"66.23","tag":"food"},
{"transactionID":692,"date":"2015-11-28","description":"Oregon Theater","amount":"120.71","tag":"entertainment"},
{"transactionID":693,"date":"2016-08-25","description":"Shell","amount":"101.76","tag":"automotive"},
{"transactionID":694,"date":"2016-01-31","description":"Amazon","amount":"106.99","tag":"medical"},
{"transactionID":695,"date":"2016-02-21","description":"Netflix","amount":"152.49","tag":"entertainment"},
{"transactionID":696,"date":"2016-04-10","description":"Exxon Mobil","amount":"164.05","tag":"automotive"},
{"transactionID":697,"date":"2015-12-03","description":"New Seasons","amount":"145.56","tag":"food"},
{"transactionID":698,"date":"2016-07-24","description":"Autozone","amount":"111.52","tag":"automotive"},
{"transactionID":699,"date":"2016-02-03","description":"Arco","amount":"93.37","tag":"automotive"},
{"transactionID":700,"date":"2016-05-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":701,"date":"2016-05-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":702,"date":"2016-01-09","description":"Jiffy Lube","amount":"117.73","tag":"automotive"},
{"transactionID":703,"date":"2015-09-29","description":"Lowes","amount":"185.64","tag":"other"},
{"transactionID":704,"date":"2015-11-23","description":"Oregon Theater","amount":"69.68","tag":"entertainment"},
{"transactionID":705,"date":"2016-01-08","description":"Home Depot","amount":"43.07","tag":"home-improvement"},
{"transactionID":706,"date":"2016-08-27","description":"Tacobell","amount":"24.98","tag":"food"},
{"transactionID":707,"date":"2016-07-02","description":"Chipoltle","amount":"26.79","tag":"food"},
{"transactionID":708,"date":"2015-12-05","description":"Chipoltle","amount":"24.51","tag":"food"},
{"transactionID":709,"date":"2016-06-29","description":"PGE","amount":"65.0","tag":"utilities"},
{"transactionID":710,"date":"2016-06-11","description":"PGE","amount":"21.01","tag":"utilities"},
{"transactionID":711,"date":"2016-03-06","description":"Amazon","amount":"154.36","tag":"automotive"},
{"transactionID":712,"date":"2016-07-08","description":"Fred Meyer","amount":"146.9","tag":"medical"},
{"transactionID":713,"date":"2016-08-06","description":"PGE","amount":"114.86","tag":"utilities"},
{"transactionID":714,"date":"2016-05-10","description":"Chipoltle","amount":"104.99","tag":"food"},
{"transactionID":715,"date":"2016-02-02","description":"Trader Joes","amount":"126.88","tag":"food"},
{"transactionID":716,"date":"2015-11-02","description":"Sassys","amount":"21.6","tag":"entertainment"},
{"transactionID":717,"date":"2016-06-04","description":"Netflix","amount":"152.91","tag":"entertainment"},
{"transactionID":718,"date":"2016-04-15","description":"Tacobell","amount":"95.32","tag":"food"},
{"transactionID":719,"date":"2016-06-22","description":"Starbucks","amount":"127.11","tag":"food"},
{"transactionID":720,"date":"2015-09-29","description":"Autozone","amount":"183.06","tag":"automotive"},
{"transactionID":721,"date":"2016-03-20","description":"Trader Joes","amount":"34.3","tag":"food"},
{"transactionID":722,"date":"2015-12-05","description":"Chipoltle","amount":"105.5","tag":"food"},
{"transactionID":723,"date":"2016-05-01","description":"PGE","amount":"27.61","tag":"utilities"},
{"transactionID":724,"date":"2016-02-08","description":"PGE","amount":"62.97","tag":"utilities"},
{"transactionID":725,"date":"2015-11-28","description":"New Seasons","amount":"41.16","tag":"other"},
{"transactionID":726,"date":"2016-04-29","description":"Costco","amount":"3.53","tag":"food"},
{"transactionID":727,"date":"2015-09-26","description":"Shell","amount":"42.02","tag":"automotive"},
{"transactionID":728,"date":"2016-07-18","description":"Starbucks","amount":"5.48","tag":"other"},
{"transactionID":729,"date":"2015-12-07","description":"Target","amount":"95.94","tag":"other"},
{"transactionID":730,"date":"2016-02-10","description":"Autozone","amount":"37.16","tag":"automotive"},
{"transactionID":731,"date":"2016-07-27","description":"Fred Meyer","amount":"193.74","tag":"medical"},
{"transactionID":732,"date":"2016-04-12","description":"Exxon Mobil","amount":"61.47","tag":"automotive"},
{"transactionID":733,"date":"2016-08-14","description":"Home Depot","amount":"171.54","tag":"home-improvement"},
{"transactionID":734,"date":"2015-10-13","description":"Multnomah County","amount":"78.79","tag":"utilities"},
{"transactionID":735,"date":"2015-10-27","description":"Amazon","amount":"191.31","tag":"home-improvement"},
{"transactionID":736,"date":"2016-06-15","description":"Jiffy Lube","amount":"185.62","tag":"automotive"},
{"transactionID":737,"date":"2016-06-09","description":"Coccoa","amount":"1.72","tag":"utilities"},
{"transactionID":738,"date":"2015-10-27","description":"Oregon Theater","amount":"52.6","tag":"entertainment"},
{"transactionID":739,"date":"2016-07-28","description":"Tacobell","amount":"135.58","tag":"food"},
{"transactionID":740,"date":"2015-10-19","description":"Coccoa","amount":"75.87","tag":"income"},
{"transactionID":741,"date":"2016-02-18","description":"Costco","amount":"28.5","tag":"medical"},
{"transactionID":742,"date":"2016-06-05","description":"Walmart","amount":"187.61","tag":"food"},
{"transactionID":743,"date":"2015-09-05","description":"Amazon","amount":"71.27","tag":"other"},
{"transactionID":744,"date":"2016-06-13","description":"Home Depot","amount":"50.73","tag":"home-improvement"},
{"transactionID":745,"date":"2016-05-06","description":"Multnomah County","amount":"103.84","tag":"utilities"},
{"transactionID":746,"date":"2016-07-27","description":"Oregon Theater","amount":"67.69","tag":"entertainment"},
{"transactionID":747,"date":"2016-03-24","description":"Amazon","amount":"83.53","tag":"other"},
{"transactionID":748,"date":"2016-01-18","description":"Amazon","amount":"116.01","tag":"clothes"},
{"transactionID":749,"date":"2015-10-29","description":"New Seasons","amount":"117.74","tag":"other"},
{"transactionID":750,"date":"2016-01-07","description":"Arco","amount":"19.28","tag":"automotive"},
{"transactionID":751,"date":"2016-03-12","description":"Coccoa","amount":"127.23","tag":"home-improvement"},
{"transactionID":752,"date":"2016-06-12","description":"Costco","amount":"110.37","tag":"other"},
{"transactionID":753,"date":"2016-01-23","description":"Tacobell","amount":"97.97","tag":"food"},
{"transactionID":754,"date":"2016-08-08","description":"Northwest Natural","amount":"34.14","tag":"utilities"},
{"transactionID":755,"date":"2015-09-10","description":"Multnomah County","amount":"20.21","tag":"utilities"},
{"transactionID":756,"date":"2016-01-05","description":"Fred Meyer","amount":"186.09","tag":"medical"},
{"transactionID":757,"date":"2016-05-25","description":"Starbucks","amount":"53.97","tag":"food"},
{"transactionID":758,"date":"2016-07-25","description":"Fred Meyer","amount":"89.7","tag":"entertainment"},
{"transactionID":759,"date":"2016-06-25","description":"Tacobell","amount":"148.22","tag":"food"},
{"transactionID":760,"date":"2016-02-16","description":"Shell","amount":"44.48","tag":"automotive"},
{"transactionID":761,"date":"2015-09-27","description":"PGE","amount":"43.63","tag":"utilities"},
{"transactionID":762,"date":"2016-06-19","description":"Sassys","amount":"142.49","tag":"food"},
{"transactionID":763,"date":"2015-09-21","description":"Walmart","amount":"146.76","tag":"food"},
{"transactionID":764,"date":"2016-02-16","description":"Multnomah County","amount":"178.22","tag":"other"},
{"transactionID":765,"date":"2016-04-02","description":"Autozone","amount":"119.48","tag":"automotive"},
{"transactionID":766,"date":"2016-03-21","description":"Oregon Theater","amount":"66.27","tag":"entertainment"},
{"transactionID":767,"date":"2016-02-28","description":"Coccoa","amount":"75.87","tag":"automotive"},
{"transactionID":768,"date":"2016-08-08","description":"Shell","amount":"120.64","tag":"automotive"},
{"transactionID":769,"date":"2016-01-08","description":"New Seasons","amount":"55.85","tag":"other"},
{"transactionID":770,"date":"2016-06-16","description":"Costco","amount":"38.82","tag":"clothes"},
{"transactionID":771,"date":"2016-01-12","description":"Fred Meyer","amount":"115.33","tag":"medical"},
{"transactionID":772,"date":"2015-11-12","description":"New Seasons","amount":"184.81","tag":"food"},
{"transactionID":773,"date":"2015-12-28","description":"Autozone","amount":"164.27","tag":"automotive"},
{"transactionID":774,"date":"2016-03-14","description":"New Seasons","amount":"84.0","tag":"food"},
{"transactionID":775,"date":"2015-11-22","description":"Lowes","amount":"177.41","tag":"other"},
{"transactionID":776,"date":"2015-09-28","description":"Multnomah County","amount":"19.84","tag":"utilities"},
{"transactionID":777,"date":"2015-12-13","description":"Starbucks","amount":"102.32","tag":"other"},
{"transactionID":778,"date":"2016-07-23","description":"Chipoltle","amount":"49.26","tag":"food"},
{"transactionID":779,"date":"2015-10-31","description":"Arco","amount":"32.67","tag":"automotive"},
{"transactionID":780,"date":"2015-11-05","description":"Shell","amount":"63.93","tag":"automotive"},
{"transactionID":781,"date":"2015-10-10","description":"Autozone","amount":"70.32","tag":"automotive"},
{"transactionID":782,"date":"2016-01-12","description":"Tacobell","amount":"184.41","tag":"food"},
{"transactionID":783,"date":"2016-01-14","description":"BW3s","amount":"99.11","tag":"food"},
{"transactionID":784,"date":"2016-01-06","description":"Walmart","amount":"37.21","tag":"food"},
{"transactionID":785,"date":"2015-12-01","description":"Walmart","amount":"37.59","tag":"other"},
{"transactionID":786,"date":"2016-07-07","description":"Multnomah County","amount":"57.57","tag":"other"},
{"transactionID":787,"date":"2015-10-29","description":"BW3s","amount":"8.76","tag":"food"},
{"transactionID":788,"date":"2015-12-30","description":"Netflix","amount":"199.68","tag":"entertainment"},
{"transactionID":789,"date":"2016-08-07","description":"PGE","amount":"110.6","tag":"utilities"},
{"transactionID":790,"date":"2015-11-03","description":"Multnomah County","amount":"145.07","tag":"utilities"},
{"transactionID":791,"date":"2016-06-23","description":"Arco","amount":"138.21","tag":"automotive"},
{"transactionID":792,"date":"2016-02-01","description":"Sassys","amount":"23.16","tag":"entertainment"},
{"transactionID":793,"date":"2015-12-13","description":"New Seasons","amount":"197.7","tag":"food"},
{"transactionID":794,"date":"2016-05-09","description":"New Seasons","amount":"153.47","tag":"other"},
{"transactionID":795,"date":"2016-08-17","description":"Trader Joes","amount":"156.14","tag":"other"},
{"transactionID":796,"date":"2016-06-23","description":"Autozone","amount":"144.37","tag":"automotive"},
{"transactionID":797,"date":"2016-05-20","description":"Fred Meyer","amount":"104.31","tag":"food"},
{"transactionID":798,"date":"2015-12-27","description":"BW3s","amount":"181.47","tag":"food"},
{"transactionID":799,"date":"2016-05-22","description":"Shell","amount":"65.25","tag":"automotive"},
{"transactionID":800,"date":"2016-06-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":801,"date":"2016-06-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":802,"date":"2015-11-05","description":"Sassys","amount":"28.54","tag":"other"},
{"transactionID":803,"date":"2015-10-14","description":"Starbucks","amount":"29.96","tag":"food"},
{"transactionID":804,"date":"2016-07-29","description":"Fred Meyer","amount":"93.82","tag":"clothes"},
{"transactionID":805,"date":"2015-11-10","description":"Target","amount":"5.08","tag":"medical"},
{"transactionID":806,"date":"2016-02-12","description":"Trader Joes","amount":"167.18","tag":"food"},
{"transactionID":807,"date":"2016-04-14","description":"Walmart","amount":"190.91","tag":"other"},
{"transactionID":808,"date":"2016-04-12","description":"Shell","amount":"39.14","tag":"automotive"},
{"transactionID":809,"date":"2015-11-26","description":"Walmart","amount":"107.92","tag":"food"},
{"transactionID":810,"date":"2016-08-20","description":"Tacobell","amount":"88.71","tag":"food"},
{"transactionID":811,"date":"2016-01-07","description":"Jiffy Lube","amount":"164.6","tag":"automotive"},
{"transactionID":812,"date":"2016-04-25","description":"Sassys","amount":"11.22","tag":"food"},
{"transactionID":813,"date":"2016-01-17","description":"Shell","amount":"153.94","tag":"automotive"},
{"transactionID":814,"date":"2016-04-14","description":"PGE","amount":"133.96","tag":"utilities"},
{"transactionID":815,"date":"2016-03-26","description":"Coccoa","amount":"110.83","tag":"rent"},
{"transactionID":816,"date":"2015-10-24","description":"New Seasons","amount":"31.67","tag":"food"},
{"transactionID":817,"date":"2016-07-21","description":"Exxon Mobil","amount":"67.01","tag":"automotive"},
{"transactionID":818,"date":"2016-07-05","description":"PGE","amount":"12.88","tag":"utilities"},
{"transactionID":819,"date":"2016-08-13","description":"PGE","amount":"72.79","tag":"utilities"},
{"transactionID":820,"date":"2015-11-08","description":"Tacobell","amount":"147.77","tag":"food"},
{"transactionID":821,"date":"2015-10-24","description":"Arco","amount":"170.41","tag":"automotive"},
{"transactionID":822,"date":"2016-01-20","description":"Northwest Natural","amount":"174.1","tag":"utilities"},
{"transactionID":823,"date":"2016-02-25","description":"Arco","amount":"33.14","tag":"automotive"},
{"transactionID":824,"date":"2016-01-16","description":"BW3s","amount":"187.75","tag":"food"},
{"transactionID":825,"date":"2016-07-16","description":"New Seasons","amount":"193.25","tag":"other"},
{"transactionID":826,"date":"2015-10-14","description":"Target","amount":"89.77","tag":"medical"},
{"transactionID":827,"date":"2016-01-06","description":"Multnomah County","amount":"34.4","tag":"utilities"},
{"transactionID":828,"date":"2016-05-27","description":"New Seasons","amount":"23.46","tag":"food"},
{"transactionID":829,"date":"2015-12-20","description":"Starbucks","amount":"122.5","tag":"food"},
{"transactionID":830,"date":"2016-08-08","description":"Jiffy Lube","amount":"7.68","tag":"automotive"},
{"transactionID":831,"date":"2016-07-08","description":"Northwest Natural","amount":"109.54","tag":"utilities"},
{"transactionID":832,"date":"2016-05-12","description":"Coccoa","amount":"116.24","tag":"automotive"},
{"transactionID":833,"date":"2016-03-25","description":"PGE","amount":"163.21","tag":"utilities"},
{"transactionID":834,"date":"2016-03-09","description":"Autozone","amount":"184.57","tag":"automotive"},
{"transactionID":835,"date":"2016-01-22","description":"Lowes","amount":"40.08","tag":"home-improvement"},
{"transactionID":836,"date":"2015-10-26","description":"Chipoltle","amount":"5.1","tag":"food"},
{"transactionID":837,"date":"2016-05-12","description":"Netflix","amount":"100.08","tag":"entertainment"},
{"transactionID":838,"date":"2015-12-05","description":"Tacobell","amount":"23.65","tag":"food"},
{"transactionID":839,"date":"2016-08-14","description":"Starbucks","amount":"169.94","tag":"food"},
{"transactionID":840,"date":"2015-10-20","description":"BW3s","amount":"4.82","tag":"food"},
{"transactionID":841,"date":"2016-02-03","description":"Tacobell","amount":"165.67","tag":"food"},
{"transactionID":842,"date":"2016-05-15","description":"Target","amount":"142.0","tag":"medical"},
{"transactionID":843,"date":"2016-06-05","description":"Target","amount":"67.52","tag":"medical"},
{"transactionID":844,"date":"2016-06-10","description":"New Seasons","amount":"3.12","tag":"food"},
{"transactionID":845,"date":"2016-05-22","description":"Target","amount":"30.62","tag":"entertainment"},
{"transactionID":846,"date":"2016-03-17","description":"Starbucks","amount":"61.13","tag":"other"},
{"transactionID":847,"date":"2015-09-13","description":"Tacobell","amount":"51.78","tag":"food"},
{"transactionID":848,"date":"2015-12-30","description":"Northwest Natural","amount":"11.97","tag":"utilities"},
{"transactionID":849,"date":"2015-09-09","description":"Coccoa","amount":"193.77","tag":"utilities"},
{"transactionID":850,"date":"2016-03-31","description":"Shell","amount":"108.45","tag":"automotive"},
{"transactionID":851,"date":"2016-06-02","description":"Coccoa","amount":"30.91","tag":"rent"},
{"transactionID":852,"date":"2016-07-30","description":"Home Depot","amount":"142.93","tag":"home-improvement"},
{"transactionID":853,"date":"2015-11-30","description":"Sassys","amount":"107.19","tag":"entertainment"},
{"transactionID":854,"date":"2015-10-23","description":"Amazon","amount":"81.96","tag":"medical"},
{"transactionID":855,"date":"2015-11-10","description":"Costco","amount":"134.89","tag":"clothes"},
{"transactionID":856,"date":"2015-09-26","description":"Tacobell","amount":"89.3","tag":"food"},
{"transactionID":857,"date":"2015-11-03","description":"New Seasons","amount":"69.55","tag":"food"},
{"transactionID":858,"date":"2015-11-21","description":"Northwest Natural","amount":"64.55","tag":"utilities"},
{"transactionID":859,"date":"2016-07-09","description":"Coccoa","amount":"192.63","tag":"automotive"},
{"transactionID":860,"date":"2016-06-13","description":"Tacobell","amount":"18.22","tag":"food"},
{"transactionID":861,"date":"2016-04-13","description":"Lowes","amount":"137.94","tag":"other"},
{"transactionID":862,"date":"2016-01-05","description":"Shell","amount":"179.99","tag":"automotive"},
{"transactionID":863,"date":"2015-11-04","description":"Amazon","amount":"150.56","tag":"automotive"},
{"transactionID":864,"date":"2016-07-14","description":"Autozone","amount":"98.95","tag":"automotive"},
{"transactionID":865,"date":"2016-08-06","description":"Sassys","amount":"157.53","tag":"food"},
{"transactionID":866,"date":"2016-03-13","description":"Home Depot","amount":"86.41","tag":"other"},
{"transactionID":867,"date":"2015-09-11","description":"Target","amount":"163.22","tag":"entertainment"},
{"transactionID":868,"date":"2016-06-16","description":"Northwest Natural","amount":"149.46","tag":"utilities"},
{"transactionID":869,"date":"2015-12-11","description":"Home Depot","amount":"4.93","tag":"other"},
{"transactionID":870,"date":"2016-07-02","description":"Sassys","amount":"20.53","tag":"food"},
{"transactionID":871,"date":"2016-06-27","description":"Netflix","amount":"122.2","tag":"entertainment"},
{"transactionID":872,"date":"2015-12-09","description":"Walmart","amount":"16.15","tag":"food"},
{"transactionID":873,"date":"2015-09-21","description":"Fred Meyer","amount":"156.72","tag":"food"},
{"transactionID":874,"date":"2016-01-29","description":"Shell","amount":"123.38","tag":"automotive"},
{"transactionID":875,"date":"2015-09-24","description":"Lowes","amount":"106.9","tag":"other"},
{"transactionID":876,"date":"2015-09-30","description":"Multnomah County","amount":"71.01","tag":"utilities"},
{"transactionID":877,"date":"2015-12-10","description":"Shell","amount":"164.1","tag":"automotive"},
{"transactionID":878,"date":"2016-01-11","description":"Amazon","amount":"89.86","tag":"food"},
{"transactionID":879,"date":"2016-03-01","description":"Chipoltle","amount":"6.76","tag":"food"},
{"transactionID":880,"date":"2016-05-14","description":"PGE","amount":"168.49","tag":"utilities"},
{"transactionID":881,"date":"2016-02-12","description":"Exxon Mobil","amount":"160.94","tag":"automotive"},
{"transactionID":882,"date":"2016-05-12","description":"New Seasons","amount":"66.36","tag":"other"},
{"transactionID":883,"date":"2015-11-04","description":"Lowes","amount":"27.53","tag":"home-improvement"},
{"transactionID":884,"date":"2015-11-10","description":"Sassys","amount":"78.7","tag":"entertainment"},
{"transactionID":885,"date":"2015-09-27","description":"Chipoltle","amount":"129.0","tag":"food"},
{"transactionID":886,"date":"2015-10-04","description":"Autozone","amount":"146.96","tag":"automotive"},
{"transactionID":887,"date":"2016-03-29","description":"Coccoa","amount":"114.18","tag":"medical"},
{"transactionID":888,"date":"2016-06-05","description":"Coccoa","amount":"94.08","tag":"medical"},
{"transactionID":889,"date":"2016-05-19","description":"PGE","amount":"92.11","tag":"utilities"},
{"transactionID":890,"date":"2016-08-20","description":"Costco","amount":"100.51","tag":"medical"},
{"transactionID":891,"date":"2015-10-30","description":"PGE","amount":"129.59","tag":"utilities"},
{"transactionID":892,"date":"2015-11-10","description":"Sassys","amount":"3.31","tag":"entertainment"},
{"transactionID":893,"date":"2016-06-17","description":"Arco","amount":"64.17","tag":"automotive"},
{"transactionID":894,"date":"2015-09-30","description":"Walmart","amount":"170.58","tag":"entertainment"},
{"transactionID":895,"date":"2016-01-23","description":"Walmart","amount":"110.31","tag":"medical"},
{"transactionID":896,"date":"2016-04-17","description":"Starbucks","amount":"111.82","tag":"food"},
{"transactionID":897,"date":"2016-08-06","description":"Sassys","amount":"94.5","tag":"entertainment"},
{"transactionID":898,"date":"2016-07-24","description":"Costco","amount":"18.41","tag":"food"},
{"transactionID":899,"date":"2016-02-16","description":"Lowes","amount":"158.18","tag":"home-improvement"},
{"transactionID":900,"date":"2016-7-29","description":"fisc","amount":"25786","tag":"income"},
{"transactionID":901,"date":"2016-07-01","description":"Capital Properties","amount":"2500","tag":"rent"},
{"transactionID":902,"date":"2016-06-18","description":"Netflix","amount":"159.85","tag":"entertainment"},
{"transactionID":903,"date":"2016-02-11","description":"Shell","amount":"102.66","tag":"automotive"},
{"transactionID":904,"date":"2016-07-14","description":"Amazon","amount":"168.14","tag":"medical"},
{"transactionID":905,"date":"2016-02-17","description":"Costco","amount":"77.1","tag":"entertainment"},
{"transactionID":906,"date":"2016-01-12","description":"PGE","amount":"103.86","tag":"utilities"},
{"transactionID":907,"date":"2015-10-09","description":"Coccoa","amount":"143.16","tag":"utilities"},
{"transactionID":908,"date":"2016-05-28","description":"BW3s","amount":"46.09","tag":"food"},
{"transactionID":909,"date":"2015-10-09","description":"Northwest Natural","amount":"52.53","tag":"utilities"},
{"transactionID":910,"date":"2016-02-07","description":"BW3s","amount":"63.06","tag":"food"},
{"transactionID":911,"date":"2016-08-17","description":"Walmart","amount":"46.48","tag":"entertainment"},
{"transactionID":912,"date":"2015-09-16","description":"Amazon","amount":"160.41","tag":"automotive"},
{"transactionID":913,"date":"2016-01-30","description":"Costco","amount":"11.46","tag":"clothes"},
{"transactionID":914,"date":"2015-10-13","description":"Oregon Theater","amount":"70.38","tag":"entertainment"},
{"transactionID":915,"date":"2016-01-28","description":"Netflix","amount":"46.0","tag":"entertainment"},
{"transactionID":916,"date":"2015-09-05","description":"Multnomah County","amount":"16.65","tag":"other"},
{"transactionID":917,"date":"2016-03-24","description":"PGE","amount":"82.45","tag":"utilities"},
{"transactionID":918,"date":"2016-01-10","description":"Exxon Mobil","amount":"100.85","tag":"automotive"},
{"transactionID":919,"date":"2016-05-12","description":"Autozone","amount":"144.18","tag":"automotive"},
{"transactionID":920,"date":"2016-05-28","description":"Amazon","amount":"2.93","tag":"home-improvement"},
{"transactionID":921,"date":"2015-10-29","description":"Multnomah County","amount":"82.98","tag":"utilities"},
{"transactionID":922,"date":"2016-04-28","description":"Target","amount":"161.31","tag":"clothes"},
{"transactionID":923,"date":"2016-01-27","description":"Lowes","amount":"198.54","tag":"home-improvement"},
{"transactionID":924,"date":"2016-07-28","description":"Walmart","amount":"123.25","tag":"other"},
{"transactionID":925,"date":"2016-06-13","description":"Arco","amount":"107.04","tag":"automotive"},
{"transactionID":926,"date":"2016-01-23","description":"Coccoa","amount":"111.27","tag":"other"},
{"transactionID":927,"date":"2016-08-30","description":"Multnomah County","amount":"36.2","tag":"utilities"},
{"transactionID":928,"date":"2016-04-25","description":"Walmart","amount":"6.65","tag":"home-improvement"},
{"transactionID":929,"date":"2016-01-02","description":"PGE","amount":"185.31","tag":"utilities"},
{"transactionID":930,"date":"2016-03-22","description":"New Seasons","amount":"58.58","tag":"other"},
{"transactionID":931,"date":"2016-04-04","description":"Home Depot","amount":"63.73","tag":"home-improvement"},
{"transactionID":932,"date":"2016-02-25","description":"Trader Joes","amount":"167.29","tag":"other"},
{"transactionID":933,"date":"2015-10-19","description":"Lowes","amount":"179.83","tag":"home-improvement"},
{"transactionID":934,"date":"2016-01-28","description":"Jiffy Lube","amount":"7.81","tag":"automotive"},
{"transactionID":935,"date":"2015-10-23","description":"Tacobell","amount":"14.98","tag":"food"},
{"transactionID":936,"date":"2016-05-06","description":"Shell","amount":"87.81","tag":"automotive"},
{"transactionID":937,"date":"2016-01-30","description":"Shell","amount":"123.15","tag":"automotive"},
{"transactionID":938,"date":"2015-09-29","description":"Home Depot","amount":"181.08","tag":"home-improvement"},
{"transactionID":939,"date":"2016-05-22","description":"Starbucks","amount":"169.4","tag":"food"},
{"transactionID":940,"date":"2016-02-12","description":"Fred Meyer","amount":"192.03","tag":"medical"},
{"transactionID":941,"date":"2015-11-14","description":"Shell","amount":"10.17","tag":"automotive"},
{"transactionID":942,"date":"2015-10-13","description":"Home Depot","amount":"89.43","tag":"other"},
{"transactionID":943,"date":"2016-05-07","description":"Jiffy Lube","amount":"189.2","tag":"automotive"},
{"transactionID":944,"date":"2015-09-25","description":"Target","amount":"158.23","tag":"other"},
{"transactionID":945,"date":"2016-06-12","description":"Chipoltle","amount":"111.44","tag":"food"},
{"transactionID":946,"date":"2015-11-04","description":"Jiffy Lube","amount":"40.88","tag":"automotive"},
{"transactionID":947,"date":"2016-08-29","description":"Sassys","amount":"18.64","tag":"entertainment"},
{"transactionID":948,"date":"2016-07-24","description":"Arco","amount":"176.31","tag":"automotive"},
{"transactionID":949,"date":"2015-10-09","description":"Oregon Theater","amount":"8.97","tag":"entertainment"},
{"transactionID":950,"date":"2016-05-03","description":"PGE","amount":"162.45","tag":"utilities"},
{"transactionID":951,"date":"2016-01-10","description":"Fred Meyer","amount":"96.45","tag":"entertainment"},
{"transactionID":952,"date":"2015-10-11","description":"Exxon Mobil","amount":"61.38","tag":"automotive"},
{"transactionID":953,"date":"2015-12-21","description":"Amazon","amount":"120.42","tag":"home-improvement"},
{"transactionID":954,"date":"2015-11-27","description":"PGE","amount":"137.58","tag":"utilities"},
{"transactionID":955,"date":"2016-07-07","description":"Trader Joes","amount":"20.54","tag":"food"},
{"transactionID":956,"date":"2016-04-15","description":"Sassys","amount":"191.13","tag":"food"},
{"transactionID":957,"date":"2016-08-18","description":"Multnomah County","amount":"157.34","tag":"utilities"},
{"transactionID":958,"date":"2016-05-23","description":"Walmart","amount":"112.36","tag":"entertainment"},
{"transactionID":959,"date":"2016-03-16","description":"Chipoltle","amount":"167.04","tag":"food"},
{"transactionID":960,"date":"2016-06-15","description":"Fred Meyer","amount":"129.28","tag":"other"},
{"transactionID":961,"date":"2016-01-07","description":"Sassys","amount":"52.81","tag":"entertainment"},
{"transactionID":962,"date":"2016-08-02","description":"Costco","amount":"83.53","tag":"entertainment"},
{"transactionID":963,"date":"2015-09-30","description":"Netflix","amount":"46.47","tag":"entertainment"},
{"transactionID":964,"date":"2016-06-26","description":"Chipoltle","amount":"117.5","tag":"food"},
{"transactionID":965,"date":"2015-11-05","description":"Costco","amount":"55.81","tag":"clothes"},
{"transactionID":966,"date":"2016-03-17","description":"Chipoltle","amount":"183.75","tag":"food"},
{"transactionID":967,"date":"2016-05-04","description":"Trader Joes","amount":"14.1","tag":"other"},
{"transactionID":968,"date":"2016-08-17","description":"Tacobell","amount":"151.88","tag":"food"},
{"transactionID":969,"date":"2015-12-11","description":"PGE","amount":"45.92","tag":"utilities"},
{"transactionID":970,"date":"2016-02-21","description":"Arco","amount":"28.17","tag":"automotive"},
{"transactionID":971,"date":"2015-09-19","description":"Exxon Mobil","amount":"148.28","tag":"automotive"},
{"transactionID":972,"date":"2016-07-01","description":"Autozone","amount":"28.21","tag":"automotive"},
{"transactionID":973,"date":"2016-02-14","description":"Tacobell","amount":"76.91","tag":"food"},
{"transactionID":974,"date":"2016-04-18","description":"New Seasons","amount":"120.28","tag":"food"},
{"transactionID":975,"date":"2016-04-02","description":"Exxon Mobil","amount":"82.49","tag":"automotive"},
{"transactionID":976,"date":"2016-07-22","description":"Oregon Theater","amount":"72.18","tag":"entertainment"},
{"transactionID":977,"date":"2016-08-13","description":"New Seasons","amount":"63.12","tag":"food"},
{"transactionID":978,"date":"2016-06-03","description":"Exxon Mobil","amount":"166.33","tag":"automotive"},
{"transactionID":979,"date":"2016-08-12","description":"PGE","amount":"191.11","tag":"utilities"},
{"transactionID":980,"date":"2016-01-26","description":"Multnomah County","amount":"42.78","tag":"other"},
{"transactionID":981,"date":"2016-03-17","description":"PGE","amount":"150.26","tag":"utilities"},
{"transactionID":982,"date":"2016-08-27","description":"Exxon Mobil","amount":"149.43","tag":"automotive"},
{"transactionID":983,"date":"2016-01-01","description":"Northwest Natural","amount":"154.89","tag":"utilities"},
{"transactionID":984,"date":"2015-11-04","description":"Target","amount":"100.96","tag":"clothes"},
{"transactionID":985,"date":"2016-03-25","description":"Netflix","amount":"74.67","tag":"entertainment"},
{"transactionID":986,"date":"2016-02-17","description":"Exxon Mobil","amount":"190.69","tag":"automotive"},
{"transactionID":987,"date":"2016-07-25","description":"Arco","amount":"46.9","tag":"automotive"},
{"transactionID":988,"date":"2016-04-13","description":"Fred Meyer","amount":"166.15","tag":"automotive"},
{"transactionID":989,"date":"2016-03-02","description":"Coccoa","amount":"196.37","tag":"automotive"},
{"transactionID":990,"date":"2015-09-17","description":"Home Depot","amount":"96.85","tag":"home-improvement"},
{"transactionID":991,"date":"2016-08-02","description":"Walmart","amount":"172.99","tag":"food"},
{"transactionID":992,"date":"2015-10-04","description":"BW3s","amount":"86.71","tag":"food"},
{"transactionID":993,"date":"2016-08-15","description":"Multnomah County","amount":"119.08","tag":"other"},
{"transactionID":994,"date":"2016-05-29","description":"Jiffy Lube","amount":"85.15","tag":"automotive"},
{"transactionID":995,"date":"2015-12-09","description":"Netflix","amount":"197.86","tag":"entertainment"},
{"transactionID":996,"date":"2016-05-19","description":"Shell","amount":"51.59","tag":"automotive"},
{"transactionID":997,"date":"2016-04-05","description":"Tacobell","amount":"187.82","tag":"food"},
{"transactionID":998,"date":"2016-06-08","description":"Oregon Theater","amount":"77.08","tag":"entertainment"},
{"transactionID":999,"date":"2016-08-01","description":"Oregon Theater","amount":"130.54","tag":"entertainment"},
{"transactionID":1000,"date":"2016-08-29","description":"Tacobell","amount":"25.98","tag":"food"}]
