
var transactionData = [];
function createData() {
  for (var i = 0; i < PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.length; i++) {
    array = [PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].transactionID, PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].date, PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].desc,PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].amount,PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].tag]
    transactionData.push(array);
  }
}

function findTrans(id) {
  var thisUser = PROGSTATE.Users[PROGSTATE.CurrentUser];
  for (var i = 0; i <= thisUser.transactions.length; i++) {
    if(thisUser.transactions[i].transactionID === parseInt(id)) {
      return thisUser.transactions[i];
    }
  }

}

// Converts Transactions object into array for table

$(document).ready(function() {
    var accNum = getAccountNum();
    // alert(PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.firstName);
    $('#display-account-num').append('<h5>Account Number: ' + accNum + '</h5>')
    $('#display-username').append('<h5>' + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.firstName + ' ' + PROGSTATE.Users[PROGSTATE.CurrentUser].userProfile.lastName + '</h5>')


createData();
  // sets iniital value for transactionID on page, starts with new unused transactionID
  document.getElementById("trans-id").value = transactionData.length + 1;
  // Creates DataTable
  var transactions = $('#transaction-list').DataTable( {
      data: transactionData,
      columns: [
          { title: "Transaction ID" },
          { title: "Date" },
          { title: "Description" },
          { title: "Amount" },
          { title: "Tag" },
      ]
  });
printCharts();
// Provides id of row selected and passes it's transaction data into input fields
  $('#transaction-list tbody').on('click', 'tr', function () {
          console.log(transactionData)
          var data = transactions.row( this ).data();
          $('#add-trans').hide();
          $('#update-trans').show();
          document.getElementById("trans-id").value = data[0];
          var tempObject = findTrans(data[0]);
          document.getElementById("trans-date").value = tempObject.date
          document.getElementById("trans-desc").value = tempObject.desc
          document.getElementById("trans-amt").value = tempObject.amount
          document.getElementById("trans-tag").value = tempObject.tag

      });

// Pushes new transactions into both object array of transactions and into datatable array
  $('#add-trans').on( 'click', function () {
    var transID = parseInt(document.getElementById("trans-id").value);
    var transDate = document.getElementById("trans-date").value;
    var transDesc = document.getElementById("trans-desc").value;
    var transAmt = document.getElementById("trans-amt").value;
    var transTag = document.getElementById("trans-tag").value;
    transactions.rows.add( [
      [transID,transDate,transDesc,transAmt,transTag]
    ] ).draw();
    PROGSTATE.Users[PROGSTATE.CurrentUser].addTransaction(transID, transDate, transDesc, transAmt, transTag);
    console.log(transactionData.length)
    transactionData.push([parseInt(transID),transDate,transDesc,transAmt,transTag])
    console.log(transactionData.length)
    document.getElementById("trans-id").value = transactionData.length + 1;
    printCharts();
    saveState()
  });
  // when user clicks, takes input and corrects specific transaction
  $('#update-trans').click(function(event) {
    var transID = document.getElementById("trans-id").value;
    var transDate = document.getElementById("trans-date").value;
    var transDesc = document.getElementById("trans-desc").value;
    var transAmt = document.getElementById("trans-amt").value;
    var transTag = document.getElementById("trans-tag").value;

    PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[transID-1].date = transDate;
    PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[transID-1].desc = transDesc;
    PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[transID-1].amount = transAmt;
    PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[transID-1].tag = transTag;
    transactionData[transID - 1] = [transID,transDate,transDesc,transAmt,transTag];

    $('#add-trans').show();
    $('#update-trans').hide();

    $('#trans-date').val('')
    $('#trans-desc').val('')
    $('#trans-amt').val('')
    $('#trans-tag').val('')

    transactions.clear().draw();
    transactions.rows.add(transactionData); // Add new data
    transactions.columns.adjust().draw(); // Redraw the DataTable
    document.getElementById("trans-id").value = transactionData.length + 1;
    printCharts();
    saveState();
    event.preventDefault();
  });
  // end of transaction update
});
