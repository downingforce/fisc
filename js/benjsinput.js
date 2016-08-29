


function findTrans(id) {
  for (var i = 0; i <= mainUSER.transactions.length; i++) {
    if(mainUSER.transactions[i].transactionID === parseInt(id)) {
      return mainUSER.transactions[i];
    }
  }
}

$(document).ready(function() {
  // Gets new ID number for Transaction List
  document.getElementById("trans-id").value = mainUSER.transactions.length + 1;
  //
  function refreshTable() {
    $('.transaction-row tr').detach();
    for (var i = 0; i < mainUSER.transactions.length; i++) {
      id = i + 1;
        $('.transaction-row').prepend('<tr class="transaction-item" id="'+id+'"><td>' + mainUSER.transactions[i].transactionID + '</td><td>' + mainUSER.transactions[i].date + '</td><td>' + mainUSER.transactions[i].desc + '</td><td>' + mainUSER.transactions[i].amount + '</td><td>' + mainUSER.transactions[i].tag + '</td></tr>');
    }
  }
  refreshTable();


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

  $('#update-trans').click(function(event) {
    var transID = document.getElementById("trans-id").value;
    var transDate = document.getElementById("trans-date").value;
    var transDesc = document.getElementById("trans-desc").value;
    var transAmt = document.getElementById("trans-amt").value;
    var transTag = document.getElementById("trans-tag").value;

    mainUSER.transactions[transID-1].date = transDate;
    mainUSER.transactions[transID-1].desc = transDesc;
    mainUSER.transactions[transID-1].amount = transAmt;
    mainUSER.transactions[transID-1].tag = transTag;
    refreshTable();
    event.preventDefault();
    debugger;
    
  });




  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {

    var transID = mainUSER.transactions.length + 1
    console.log('submit entered')
    var userDate = $('#trans-date').val();
    var userDesc = $('#trans-desc').val();
    var userAmt = parseInt($('#trans-amt').val());
    var userTag = $('#trans-tag').val();

    mainUSER.addTransaction(transID, userDate, userDesc, userAmt, userTag);

    $('#trans-date').val('')
    $('#trans-desc').val('')
    $('#trans-amt').val('')


    document.getElementById("trans-id").value = mainUSER.transactions.length + 1;
    refreshTable();



    event.preventDefault();
  });
});
