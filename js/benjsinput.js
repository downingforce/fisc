$(document).ready(function() {
  // Gets new ID number for Transaction List
  document.getElementById("trans-id").value = mainUSER.transactions.length + 1;
  //
  function refreshTable() {
    $('.transaction-row tr').detach();
    for (var i = 0; i < mainUSER.transactions.length; i++) {
      id = i + 1;
        $('.transaction-row').prepend('<tr class="transaction-item"><td id="'+id+'">' + mainUSER.transactions[i].transactionID + '</td><td>' + mainUSER.transactions[i].date + '</td><td>' + mainUSER.transactions[i].description + '</td><td>' + mainUSER.transactions[i].amount + '</td><td>' + mainUSER.transactions[i].tag + '</td></tr>');
    }
  }
  refreshTable();
  $('tr').click(function(event) {
    $('#add-trans').hide();
    $('#update-trans').show();
    alert($(this).attr('id'));
    alert($(this).id)
    document.getElementById("trans-id").value = id;
  });


  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {

    var transID = mainUSER.transactions.length + 1
    console.log('submit entered')
    var userDate = $('#trans-date').val();
    var userDesc = $('#trans-desc').val();
    var userAmt = parseInt($('#trans-amt').val());
    var userTag = 'test';

    mainUSER.addTransaction(transID, userDate, userDesc, userAmt, userTag);

    $('#trans-date').val('')
    $('#trans-desc').val('')
    $('#trans-amt').val('')


    document.getElementById("trans-id").value = mainUSER.transactions.length + 1;
    refreshTable();



    event.preventDefault();
  });
});
