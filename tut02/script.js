/*'use strict';

var width = 1020,
    height = 200,
    barWidth = 20,
    barOffset = 5;



var widthScale = d3.scale.linear()
    .domain([0, 400])
    .range([0, width]);



var colorScale = d3.scale.linear()
    .domain([0, 255])
    .range(['red','blue','green']);

var axis = d3.svg.axis()
    .scale(widthScale);


var svg = d3.select('#bar-chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#ccc')
    .append('g');

var bars = d3.csv('DATA.csv', function(products) {
    // console.info('products :: ', products);
    svg.selectAll('rect')
        .data(products)
        .enter()
        .append('rect')
        .attr('fill',function(data){
          return colorScale(data.Budget/200);
        })
        .attr('width', function(data) {
            return data.Budget / 1000;
        })
        .attr('height', function(data) {
            return data.Budget / 100;
        }).attr('x', function(data, i) {
            return i * (barWidth + barOffset);
        });
});

svg.append('g').attr('transform','translate(0,250)').call(axis);
*/

$(document).on('click', '#2013', function(e) {
    $('#charts').html('');
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = (window.innerWidth - margin.left - margin.right)/4,
        height = (window.height - margin.top - margin.bottom)/2;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('.2s'));

    var color = d3.scale.ordinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    var svg = d3.select('#charts').append('svg')

    .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var yBegin;

    var innerColumns = {
        'column1': ['Coke', 'Fanta'],
        'column2': ['Orange', 'Lemon']
    };

    d3.csv('quarter.csv', function(error, data) {
        var columnHeaders = d3.keys(data[0]).filter(function(key) {
            return key !== 'Quarter';
        });
        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== 'Quarter';
        }));
        data.forEach(function(d) {
            var yColumn = new Array();
            d.columnDetails = columnHeaders.map(function(name) {
                for (ic in innerColumns) {
                    if ($.inArray(name, innerColumns[ic]) >= 0) {
                        if (!yColumn[ic]) {
                            yColumn[ic] = 0;
                        }
                        yBegin = yColumn[ic];
                        yColumn[ic] += +d[name];
                        return {
                            name: name,
                            column: ic,
                            yBegin: yBegin,
                            yEnd: +d[name] + yBegin,
                        };
                    }
                }
            });
            d.total = d3.max(d.columnDetails, function(d) {
                return d.yEnd;
            });
        });

        x0.domain(data.map(function(d) {
            return d.Quarter;
        }));
        x1.domain(d3.keys(innerColumns)).rangeRoundBands([0, x0.rangeBand()]);

        y.domain([0, d3.max(data, function(d) {
            return d.total;
        })]);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')

        .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.7em')
            .style('text-anchor', 'end')
            .text('');

        var project_stackedbar = svg.selectAll('.project_stackedbar')
            .data(data)
            .enter().append('g')
            .attr('class', 'g')
            .attr('transform', function(d) {
                return 'translate(' + x0(d.Quarter) + ',0)';
            });

        project_stackedbar.selectAll('rect')
            .data(function(d) {
                return d.columnDetails;
            })
            .enter().append('rect')
            .attr('width', x1.rangeBand())
            .attr('x', function(d) {
                return x1(d.column);
            })
            .attr('y', function(d) {
                return y(d.yEnd);
            })
            .attr('height', function(d) {
                return y(d.yBegin) - y(d.yEnd);
            })
            .style('fill', function(d) {
                return color(d.name);
            });

        var legend = svg.selectAll('.legend')
            .data(columnHeaders.slice().reverse())
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                return 'translate(0,' + i * 20 + ')';
            });

        legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function(d) {
                return d;
            });

    });
});
