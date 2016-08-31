
function findTrans(id) {
  var thisUser = PROGSTATE.Users[PROGSTATE.CurrentUser];
  for (var i = 0; i <= thisUser.transactions.length; i++) {
    if(thisUser.transactions[i].transactionID === parseInt(id)) {
      return thisUser.transactions[i];
    }
  }
}

$(document).ready(function() {
  // debugger;

  // Gets new ID number for Transaction List
  document.getElementById("trans-id").value = PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.length + 1;
  //function creates transaction table
  function refreshTable() {
    $('.transaction-row tr').detach();
    for (var i = 0; i < PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.length; i++) {
      id = i + 1;
        $('.transaction-row').prepend('<tr class="transaction-item" id="'+id+'"><td>' + PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].transactionID + '</td><td>' + PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].date + '</td><td>' + PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].desc + '</td><td>' + PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].amount + '</td><td>' + PROGSTATE.Users[PROGSTATE.CurrentUser].transactions[i].tag + '</td></tr>');
    }
  }
  // end of transaction table
  refreshTable();

// function collects id from user click and populates transaction input fields with selected transaction
  $('table').on("click", '.transaction-item' ,function(event) {
    $('#add-trans').hide();
    $('#update-trans').show();
     var id = $(this).attr('id');
     document.getElementById("trans-id").value = id;

    var tempObject = findTrans(id);

     $('#trans-date').val(tempObject.date)
     $('#trans-desc').val(tempObject.desc)
     $('#trans-amt').val(tempObject.amount)
     $('#trans-tag').val(tempObject.tag)
  });
// end of transaction id click function









  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {

    var transID = PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.length + 1
    var userDate = $('#trans-date').val();
    var userDesc = $('#trans-desc').val();
    var userAmt = parseInt($('#trans-amt').val());
    var userTag = $('#trans-tag').val();

    PROGSTATE.Users[PROGSTATE.CurrentUser].addTransaction(transID, userDate, userDesc, userAmt, userTag);

    $('#trans-date').val('')
    $('#trans-desc').val('')
    $('#trans-amt').val('')


    document.getElementById("trans-id").value = PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.length + 1;
    refreshTable();



    event.preventDefault();
  });
  // end of inital add transaction submit function
});
