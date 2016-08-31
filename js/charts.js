var series = [{
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
 name: 'Other',
 data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
}, {
 name: 'Medical',
 data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
}, {
 name: 'Home-Improvement',
 data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
}];

function sortLineChart(){
  var thisUser = PROGSTATE.Users[0];

  for (var i = 0; i < thisUser.transactions.length; i++) {
    var date = new Date(thisUser.transactions[i].date).getMonth();
    if (thisUser.transactions[i].tag === 'rent') {
      series[0].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'food') {
      series[1].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'utilities') {
      series[2].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'entertainment') {
      series[3].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'clothes') {
      series[4].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'automotive') {
      series[5].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'other') {
      series[6].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'medical') {
      series[7].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
    if (thisUser.transactions[i].tag === 'home-improvement') {
      series[8].data[date] += parseFloat(thisUser.transactions[i].amount);
    }
  }
}
$(function () {

  $('#toggle-line').click(function() {
    $('#pie-chart').hide();
    $('#line-chart').show();
    });

  $('#toggle-pie').click(function() {
    $('#pie-chart').show();
    $('#line-chart').hide();
    });


sortLineChart();
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

     series: series

  });
  // End Line Chart
  //
  // Pie Chart
  //
  var thisUser = PROGSTATE.Users[0];
  var rent = 0.0;
  var food = 0.0;
  var utilities = 0.0;
  var entertainment = 0.0;
  var clothes = 0.0;
  var automotive = 0.0;
  var medical = 0.0;
  var other = 0.0;
  var homeImprovement = 0.0;

  for (var i = 0; i < thisUser.transactions.length; i++) {

      if(thisUser.transactions[i].tag === 'rent'){
          rent += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'food'){
          food += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'utilities'){
          utilities += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'entertainment'){
          entertainment += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'clothes'){
          clothes += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'automotive'){
          automotive += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'medical'){
          medical += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'home-improvement'){
          homeImprovement += parseFloat(thisUser.transactions[i].amount);
      }
      if(thisUser.transactions[i].tag === 'other'){
          other += parseFloat(thisUser.transactions[i].amount);
      }
  }


  $('#pie-chart').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Annual Spending: Grouped by tags'
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
        y: food
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
        name: 'Other',
        y: other
      },{
        name: 'Medical',
        y: medical
      }, {
        name: 'Home-Improvement',
        y: homeImprovement
      }]
    }]
  });
  // End Pie Chart

});
