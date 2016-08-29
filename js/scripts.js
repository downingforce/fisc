var PROGSTATE = {
  accountNum: 500,
  Users: [],
  StateName: "fiscState"
};

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
function Transaction (id, date, description, amount, tag) {
    this.transactionID = id;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.tag = tag;
}

function populateTransactions(jsonArray, currentUser) {
  var transactionID;
  for(var i=0; i<jsonArray.length; ++i){
    var transaction = new Transaction (jsonArray[i].transactionID, jsonArray[i].date, jsonArray[i].description, jsonArray[i].amount, jsonArray[i].tag)
    currentUser.transactions.push(transaction);
  }

}

// Send User to localStorage, with accountNumber as identifier
function storeUser(User){
  localStorage.setItem(User.accountNumber, JSON.stringify(User));
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
    transaction.description = lsArray.transactions[i].description;
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


$(document).ready(function(){

  var ricky = createNewUser("ricky", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
  var bobby = createNewUser("bobby", "Rick", "James", "rickjames@bitch.com","1010 Main St", "Portland", "OR", "97214", rickyJsonData);
  storeUser(ricky);

  debugger;




});
