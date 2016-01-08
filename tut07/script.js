'use strict';
/* global $, dc,d3,crossfilter,colorbrewer */


$(function() {
    var chart = dc.barChart('#chart-revenue');

    d3.csv('data.csv', function(error, experiments) {




        experiments.forEach(function(x) {
            x.Speed = +x.Speed;
        });
        var ndx = crossfilter(experiments),
            runDimension = ndx.dimension(function(d) {
                return +d.Run;
            }),
            speedSumGroup = runDimension.group().reduce(function(p, v) {

                console.log('p :; ', p + ' ', v);

            });




        chart
            .width(768)
            .height(480)
            .x(d3.scale.linear().domain([1, 21]))
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
            .group(speedSumGroup, "1")
            .renderLabel(true);


            chart.render();

    });

    /*var data = [{
        Quarter: 'Q1-13',
        Sparklings: 161000,
        Juices: 54500,
    }, {
        Quarter: 'Q1-13',
        Sparklings: 105000,
        Juices: 146000,
    }, {
        Quarter: 'Q1-13',
        Sparklings: 133000,
        Juices: 71000,
    }, {
        Quarter: 'Q1-13',
        Sparklings: 120500,
        Juices: 172000,
    }];*/

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



    /*var ndx = crossfilter(data);


    var quarterDim = ndx.dimension(function(d) {
        return d.Quarter;
    });


    revenueChart.width(500).height(500)
        .dimension(quarterDim)
        .group(function(d) {
            return d.Juices;
        })
        .x(d3.scale.linear().domain(['Q1', 'Q2']))
        .yAxisLabel("This is the Y Axis!")
        .renderLabel(true);

    dc.renderAll();*/
});
