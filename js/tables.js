function findTrans(id) {
  var thisUser = PROGSTATE.Users[PROGSTATE.CurrentUser];
  for (var i = 0; i <= thisUser.transactions.length; i++) {
    if(thisUser.transactions[i].transactionID === parseInt(id)) {
      return thisUser.transactions[i];
    }
  }
}


var transactionData = [];
for (var i = 0; i < rickyJsonData.length; i++) {
  array = [rickyJsonData[i].transactionID, rickyJsonData[i].date, rickyJsonData[i].description,rickyJsonData[i].amount,rickyJsonData[i].tag]
  transactionData.push(array);
}
$(document).ready(function() {


  document.getElementById("trans-id").value = transactionData.length + 1;
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


  $('#transaction-list tbody').on('click', 'tr', function () {
          var data = transactions.row( this ).data();
          $('#add-trans').hide();
          $('#update-trans').show();
          document.getElementById("trans-id").value = data[0];
          // var tempObject = findTrans(id);
          // $('#trans-date').val(tempObject.date)
          // $('#trans-desc').val(tempObject.desc)
          // $('#trans-amt').val(tempObject.amount)
          // $('#trans-tag').val(tempObject.tag)
      });


  $('#add-trans').on( 'click', function () {
    var transID = document.getElementById("trans-id").value;
    var transDate = document.getElementById("trans-date").value;
    var transDesc = document.getElementById("trans-desc").value;
    var transAmt = document.getElementById("trans-amt").value;
    var transTag = document.getElementById("trans-tag").value;
    transactions.rows.add( [
      [transID,transDate,transDesc,transAmt,transTag]
    ] ).draw();
    PROGSTATE.Users[PROGSTATE.CurrentUser].transactions.push(transID,transDate,transDesc,transAmt,transTag)
    document.getElementById("trans-id").value = transactionData.length + 1
  });
});