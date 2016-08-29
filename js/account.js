
    $(function () {
        var rent = 0;
        var food = 0;
        var untilities = 0;
        var entertainment = 0;
        var clothes = 0;
        var automotive = 0;
        var bills = 0;
        var medical = 0;

        for (var i = 0; i < mainUSER.transactions.length; i++) {
            if(mainUSER.transactions[i].tag === 'Rent'){
                rent += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Food'){
                food += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Utilities'){
                utilities += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Entertainment'){
                entertainment += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Clothes'){
                clothes += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Automotive'){
                automotive += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Bills'){
                Bills += mainUSER.transactions[i].amount;
            }
            if(mainUSER.transactions[i].tag === 'Medical'){
                medical += mainUSER.transactions[i].amount;
            }
        }



        $('#container').highcharts({
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
    });
