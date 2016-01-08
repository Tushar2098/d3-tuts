var hitslineChart = dc.lineChart("#chart-revenue");
d3.csv('data.csv', function(error, data) {
    console.info('data : ', data);

    var ndx = crossfilter(data);
    data.forEach(function(d) {
        d.total = +d.Coke + parseInt(d.Fanta);
    });
    var quarterDim = ndx.dimension(function(d) {
        return d.Quarter;
    });

    var coke = quarterDim.group().reduceSum(function(d) {
        return +d.Coke;
    });
    var fanta = quarterDim.group().reduceSum(function(d) {
        return +d.Fanta;
    });

    var revenue = quarterDim.group().reduceSum(function(d) {
        return d.total;
    });

    hitslineChart
        .width(500).height(200)
        .dimension(quarterDim)
        .group(revenue)
        .x(d3.scale.ordinal().domain(['','Q1', 'Q2', 'Q3']))
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxisLabel("Total Revenue");

    dc.renderAll();
});
