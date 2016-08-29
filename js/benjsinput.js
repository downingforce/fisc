$(document).ready(function() {
  var exArray = [];
  document.getElementById("transaction-id").value = 'test';
  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {
    exArray.push('hah');
    var transID = exArray.length;
    document.getElementById("transaction-id").value = exArray.length;

    event.preventDefault();
  });
});
