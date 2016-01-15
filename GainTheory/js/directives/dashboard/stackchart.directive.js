var dashStackChart = function($compile, $filter) {
    function link(scope, ele, attr) {

        scope.groupStackedChart = function() {
            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                // width = scope.chartObj.width,
                // height = (window.innerHeight - margin.top - margin.bottom) / 2.5;
                width = 530,
                height = 320;

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.5);

            var x1 = d3.scale.ordinal();

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient('bottom')
                .tickSize(0, 0);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickFormat(d3.format('.2s'))
                .tickSize(0, 0);

            // var color = d3.scale.ordinal()
            // .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
            var color = d3.scale.ordinal()
                .range(['#b1fded', '#e3e6ff', '#ccff9a', '#fbeab4']);

            var svg = d3.select('#dash-stackChart').append('svg')

            .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var yBegin;

            var innerColumns = {
                'column1': ['Coke', 'Fanta'],
                'column2': ['Orange', 'Lemon']
            };

            d3.csv('./data/quarter-group-stack.csv', function(error, data) {

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
                                    quarter: d.Quarter
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
                    .attr('id', function(d) {
                        return d.Quarter;
                    })
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

                $compile(ele.contents())(scope);
            });
        };


        scope.groupStackedChart();

    } //link Function ends

    return {
        link: link,
        restrict: 'EA',
        scope: {},
        template: '<div id="dash-stackChart"></div>',
        replace: true
    };
};

angular.module('GainTheory')
    .directive('dashStackChart', dashStackChart);
