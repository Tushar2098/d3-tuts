'use strict';
/* global $, dc,d3,crossfilter,colorbrewer */


var chart = dc.barChart('#chart-revenue');

d3.csv('data1.csv', function(error, data) {


    function print_filter(filter) {
        var f = eval(filter);
        if (typeof(f.length) !== 'undefined') {} else {}
        if (typeof(f.top) !== 'undefined') {
            f = f.top(Infinity);
        } else {}
        if (typeof(f.dimension) !== 'undefined') {
            f = f.dimension(function(d) {
                return '';
            }).top(Infinity);
        } else {}
        console.log(filter + '(' + f.length + ') = ' + JSON.stringify(f).replace('[', '[\n\t').replace(/}\,/g, '},\n\t').replace(']', '\n]'));
    }


    var ndx = crossfilter(data);


    var parseDate = d3.time.format('%m/%d/%Y').parse;

    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Year = d.Date.getFullYear();
    });

    var yearDim = ndx.dimension(function(d) {
        return d.Year;
    });

    var typeDim = ndx.dimension(function(d) {
        return d.Type;
    });

    var total = yearDim.group().reduceSum(function(d) {
        return +d.Cost;
    });
    var sparkling_filter = yearDim.filter("Sparklings");
    // print_filter("sparkling_filter");

    console.log(yearDim.bottom(1)[0].Year);
    var minYear = yearDim.bottom(1)[0].Year;
    var maxYear = yearDim.top(1)[0].Year;
    // print_filter("yearDim");

    chart
        .width(768)
        .height(480)
        .dimension(yearDim)
        .x(d3.time.scale().domain([minYear, maxYear]))
        .margins({
            left: 50,
            top: 10,
            right: 10,
            bottom: 20
        })
        .brushOn(false)
        .clipPadding(10)
        .group(total)
        .yAxisLabel("This is the Y Axis!");

    dc.renderAll();

});







/*data.forEach(function(d) {
            d.total = +d.Coke + parseInt(d.Fanta);
        });


        console.log('data :: ', data);


        var ndx = crossfilter(data),
            runDimension = ndx.dimension(function(d) {
                return d.Quarter;
            }),
            speedSumGroup = runDimension.group().reduceSum(function(p, v) {
                return p.total;
            });

        function sel_stack(i) {
            return function(d) {
                console.log('d :: ', d);
                return d.value[i];
            };
        }
        chart
            .width(768)
            .height(480)
            .x(d3.scale.ordinal().domain(['Q1', 'Q2', 'Q3']))
            .margins({
                left: 50,
                top: 10,
                right: 10,
                bottom: 20
            })
            .brushOn(false)
            .clipPadding(10)
            .yAxisLabel("This is the Y Axis!")
            .dimension(runDimension)
            .group(speedSumGroup, "1", sel_stack('1'))
            .renderLabel(true);
        for (var i = 2; i < 6; ++i)
            chart.stack(speedSumGroup, '' + i, sel_stack(i));
        chart.render();
    });*/
