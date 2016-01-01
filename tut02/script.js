'use strict';

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
