$("document").ready(function(){
    // Prints transactions to the table
    for (var i = 0; i < USER.transactions.length; i++) {
        $('#transaction-row').prepend('<td>' + USER.transactions[i].transactionID + '</tr><td>' + USER.transactions[i].date + '</tr><td>' + USER.transactions[i].description + '</tr><td>' + USER.transactions[i].amount + '</tr><td>' + USER.transactions[i].tag + '</tr>')
    }
});
