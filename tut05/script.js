/* global d3, Datamap */

'use strict';

var colors = d3.scale.category10();

var Asia = ['IND', 'AFG'];
var America = ['CAN', 'USA'];
var arr = [];
var AsiaObj = {
    country: [],
    budget: 0,
    revenue: 0,
    sale: 0
};

var AmericaObj = {
    country: [],
    budget: 0,
    revenue: 0,
    sale: 0
};

var regions = [AsiaObj,AmericaObj];
var asia_rev = [];
d3.csv('data.csv', function(data) {
    data.forEach(function(d) {
        var budget = 0;
        if (Asia.indexOf(d.Country) !== -1) {

            AsiaObj.country.push(d.Country);
            AsiaObj.budget += +d.Budget;
            AsiaObj.revenue += +d.Revenue;


        } else if (America.indexOf(d.Country) !== -1) {

            AmericaObj.country.push(d.Country);
            AmericaObj.budget += +d.Budget;
            AmericaObj.revenue += +d.Revenue;

        }
    });

    AsiaObj.sale = AsiaObj.revenue / AsiaObj.budget;
    AmericaObj.sale = AmericaObj.revenue / AmericaObj.budget;

    console.log('AsiaObj :: ', AsiaObj);
    console.log('AmericaObj :: ', AmericaObj);



    var basic_choropleth = new Datamap({
        element: document.getElementById('basic_choropleth'),
        projection: 'mercator',
        fills: {
            defaultFill: '#AAAAAA',
            authorHasTraveledTo: '#fa0fa0',
            minSale: 'red',
            mediumSale: 'orange',
            maxSale: 'green',

        },
        data: {
            BGD: {
                fillKey: 'minSale'
            },
            IND: {
                fillKey: 'minSale'
            },
            CAN: {
                fillKey: 'mediumSale'
            },
            USA: {
                fillKey: 'mediumSale'
            },
            FRA: {
                fillKey: 'maxSale'
            },
            DEU: {
                fillKey: 'maxSale'
            },
        }
    });

});


/*basic_choropleth.updateChoropleth({
    USA: colors(Math.random() * 10),
    RUS: colors(Math.random() * 100),
    AUS: {
        fillKey: 'authorHasTraveledTo'
    },
    BRA: colors(Math.random() * 50),
    CAN: colors(Math.random() * 50),
    ZAF: colors(Math.random() * 50),
    IND: colors(Math.random() * 50),
});*/

/*window.setInterval(function() {
    basic_choropleth.updateChoropleth({
        USA: colors(Math.random() * 10),
        RUS: colors(Math.random() * 100),
        AUS: {
            fillKey: 'authorHasTraveledTo'
        },
        BRA: colors(Math.random() * 50),
        CAN: colors(Math.random() * 50),
        ZAF: colors(Math.random() * 50),
        IND: colors(Math.random() * 50),
    });
}, 2000);*/


//Ad Spent
/*ASIA :  278000
EUROPE : 364000
America : 321000

Revenue
ASIA : 13900000
EUROPE : 18200000
America : 16050000*/
