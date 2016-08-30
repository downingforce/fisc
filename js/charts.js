function sortLineChart(transaction){
  var thisUser = PROGSTATE.Users[PROGSTATE.CurrentUser];

  for (var i = 0; i < thisUser.transactions.length; i++) {
    var date = new Date(thisUser.transactions[i].date).getMonth();
    if (thisUser.transactions[i].tag === 'Rent') {
      series[0].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Food') {
      series[1].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Utilities') {
      series[2].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Entertainment') {
      series[3].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Clothes') {
      series[4].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Automotive') {
      series[5].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Bills') {
      series[6].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'Medical') {
      series[7].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
  }
}
$(function () {
  var thisUser = PROGSTATE.Users[PROGSTATE.CurrentUser];
  var rent = 0.0;
  var food = 0.0;
  var utilities = 0.0;
  var entertainment = 0.0;
  var clothes = 0.0;
  var automotive = 0.0;
  var bills = 0.0;
  var medical = 0.0;

  for (var i = 0; i < thisUser.transactions.length; i++) {
      if(thisUser.transactions[i].tag === 'Rent'){
          rent += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Food'){
          food += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Utilities'){
          utilities += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Entertainment'){
          entertainment += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Clothes'){
          clothes += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Automotive'){
          automotive += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Bills'){
          Bills += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'Medical'){
          medical += parseFloat(thisUser.transactions[i].amount);
      }
  }

  // Line Chart
  $('#line-chart').highcharts({
    title: {
      text: 'Monthly Spending Trends',
      x: -20 //center
    },
    subtitle: {
      text: 'Source: Your fisc account',
      x: -20
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: '$ Dollars $'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      valuePrefix: '$'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Rent',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Food',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Utilities',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Entertainment',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Clothes',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Automotive',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Bills',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }, {
      name: 'Medical',
      data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }]
  });
  // End Line Chart

  // Pie Chart
  $('#pie-chart').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Anual Spending: Grouped by tags'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          }
        }
      }
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: [{
        name: 'Rent',
        y: rent
      }, {
        name: 'Food',
        y: food,
      }, {
        name: 'Utilities',
        y: utilities
      }, {
        name: 'Entertainment',
        y: entertainment
      }, {
        name: 'Clothes',
        y: clothes
      }, {
        name: 'Automotive',
        y: automotive
      },{
        name: 'Bills',
        y: bills
      },{
        name: 'Medical',
        y: medical
      }]
    }]
  });
  // End Pie Chart

});
