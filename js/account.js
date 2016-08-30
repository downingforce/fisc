function sortLineChart(transaction){
  for (var i = 0; i < mainUSER.transactions.length; i++) {
  var date = new Date(mainUSER.transactions[i].date).getMonth();
      if (mainUSER.transactions[i].tag === 'Rent') {
        series[0].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Food') {
        series[1].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Utilities') {
        series[2].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Entertainment') {
        series[3].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Clothes') {
        series[4].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Automotive') {
        series[5].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Bills') {
        series[6].data[date] += mainUSER.transactions[i].amount;
      }
      if (mainUSER.transactions[i].tag === 'Medical') {
        series[7].data[date] += mainUSER.transactions[i].amount;
      }
  }
}


    $(function () {
        var rent = 10;
        var food = 10;
        var utilities = 10;
        var entertainment = 10;
        var clothes = 10;
        var automotive = 10;
        var bills = 10;
        var medical = 30;

        // for (var i = 0; i < mainUSER.transactions.length; i++) {
        //     if(mainUSER.transactions[i].tag === 'Rent'){
        //         rent += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Food'){
        //         food += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Utilities'){
        //         utilities += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Entertainment'){
        //         entertainment += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Clothes'){
        //         clothes += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Automotive'){
        //         automotive += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Bills'){
        //         Bills += mainUSER.transactions[i].amount;
        //     }
        //     if(mainUSER.transactions[i].tag === 'Medical'){
        //         medical += mainUSER.transactions[i].amount;
        //     }
        // }

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
            valueSuffix: '$'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Rent',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Food',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Utilities',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Entertainment',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Clothes',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Automotive',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Bills',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            name: 'Medical',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    });


        // Pie Chart
        $('#pie-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares January, 2015 to May, 2015'
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
                    sliced: true,
                    selected: true
                }, {
                    name: 'Util',
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
