var transactionData = [];
for (var i = 0; i < rickyJsonData.length; i++) {
  array = [rickyJsonData[i].transactionID, rickyJsonData[i].date, rickyJsonData[i].description,rickyJsonData[i].amount,rickyJsonData[i].tag]
  transactionData.push(array);
}
$(document).ready(function() {
    $('#transaction-list').DataTable( {
        data: transactionData,
        columns: [
            { title: "Transaction ID" },
            { title: "Date" },
            { title: "Description" },
            { title: "Amount." },
            { title: "Tag" },
        ]
    } );
} );
