var lineChart = function($compile) {


    function link(scope, ele, attr) {

        d3.csv('./data/line-chart.csv', function(error, data) {

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




            var quarterDim = ndx.dimension(function(d) {
                return d.Quarter;
            });

            var expenditureGroup = quarterDim.group().reduceSum(function(d) {
                return d.Expenditure;
            }); // shorthand var hits = dateDim.group().reduceSum(dc.pluck('total')); 








            var hitslineChart = dc.lineChart('#line-chart');

            hitslineChart
                .width(500).height(330)
                .dimension(quarterDim)
                .margins({top: 10, right: 50, bottom: 25, left: 40})
                .group(expenditureGroup)
                .x(d3.scale.ordinal().domain(['Q1', 'Q2', 'Q3', 'Q4']))
                .xUnits(dc.units.ordinal)
                .dotRadius(10)
                .brushOn(false)
                .renderHorizontalGridLines(true);



            dc.renderAll();
        });
    } //link ends

    return {
        link: link,
        restrict: 'EA',
        scope: {},
        template: '<div><div id=\'line-chart\'/><div>',
        replace: true
    };
};

angular.module('GainTheory')
    .directive('lineChart', lineChart);
