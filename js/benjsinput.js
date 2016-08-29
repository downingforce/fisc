$(document).ready(function() {
var transID = mainUSER.transactions.length + 1
console.log(transID)
  document.getElementById("trans-id").value = transID;
  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {
    var userDate = $('#trans-date').val();
    var userDesc = $('#trans-desc').val();
    var userAmt = parseInt($('#trans-amt').val());
    var userTag = 'test';

    mainUSER.addTransaction(transID, userDate, userDesc, userAmt, userTag);

    $('#trans-date').val('')
    $('#trans-desc').val('')
    $('#trans-amt').val('')

    transID = mainUSER.transactions.length + 1
    document.getElementById("trans-id").value = transID;

    event.preventDefault();
  });
});
