var yearlyStacked = function($compile) {
    function link(scope, ele, attr) {

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 1100,
            height = (window.innerHeight - margin.top - margin.bottom) / 2.5;

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

        var color = d3.scale.ordinal()
            .range(['#b1fded', '#e3e6ff', '#ccff9a', '#fbeab4']);

        var svg = d3.select(ele[0]).append('svg')

        .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var yBegin;


        var innerColumns = {
            'column1': ['Coke', 'Fanta'],
            'column2': ['Orange', 'Lemon']
        };

        d3.csv('./data/annual-group-stack.csv', function(error, data) {

            console.info('data :: ', data);
            var columnHeaders = d3.keys(data[0]).filter(function(key) {
                return key !== 'Date';
            });
            color.domain(d3.keys(data[0]).filter(function(key) {
                return key !== 'Date';
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
                return d.Date;
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
                // .attr('id', '2013')
                .attr('ui-sref', 'state3')
                .attr('class', 'g')
                .attr('transform', function(d) {
                    return 'translate(' + x0(d.Date) + ',0)';
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

            $compile(ele)(scope);
        });
    }

    return {
        link: link,
        restrict: 'EA',
        template: '<div id=\'annual-stack-group-chart\'/>',
        replace: true
    };
};

angular.module('GainTheory')
    .directive('yearlyStacked', yearlyStacked);
