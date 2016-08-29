$(document).ready(function() {
  var exArray = [];
  // Add Transaction Input Field
  $('#transaction-input').submit(function(event) {
    console.log(exArray)
    exArray.push('hah');
    var transID = exArray.length;
    document.getElementById("transaction-id").value = exArray.length;

    event.preventDefault();
  });
});
