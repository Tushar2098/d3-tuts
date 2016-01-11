var quartelyStacked = function($compile, $filter) {
    function link(scope, ele, attr) {
        scope.chartObj = scope.value;

        scope.value.groupStackedChart = function() {
            console.info('scope.value : :', scope.value);
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

            var svg = d3.select('#quartely-stack-group-chart').append('svg')

            .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('id', 'quarter-wise')
                .attr('xmlns', "xmlns = 'http://www.w3.org/2000/svg'")
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
                    .attr('role', 'quarter-stack')
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
                    .attr('xmlns:prodInfo', function(d) {
                        return [d.name, d.quarter];
                    })
                    .attr('ng-click', function(d) {
                        return "chartObj.setShadowToChart('" + d.quarter + "')";
                    })
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


        scope.value.groupStackedChart();







        scope.value.setShadowToChart = function(quarterId) {
            $('#quartely-stack-group-chart').html('');


            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                width = 500,
                height = 311;
            // height = (window.innerHeight - margin.top - margin.bottom) / 3;

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

            var svg = d3.select('#quartely-stack-group-chart').append('svg')

            .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('id', 'quarter-wise')
                .attr('xmlns', "xmlns = 'http://www.w3.org/2000/svg'")
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var yBegin;

            //SHADOW CODE
            var defs = svg.append("defs");

            var shadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "130%");

            shadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 5)
                .attr("result", "blur");

            shadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 5)
                .attr("dy", 5)
                .attr("result", "offsetBlur");


            var blurFilter = defs.append('filter')
                .attr('id', "blur-filter")
                .attr('x', 0)
                .attr('y', 0);

            blurFilter.append('feGaussianBlur')
                .attr('in', 'SourceGraphic')
                .attr('stdDeviation', 15);

            var feMerge = shadowFilter.append("feMerge");

            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur");
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");

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
                    .attr('class', function(d) {
                        if (d.Quarter === quarterId) {
                            return "g active";
                        } else {
                            return "g inactive";
                        }
                    })

                .style("filter", function(d) {
                        if (d.Quarter === quarterId)
                            return "url(#drop-shadow)";
                        return 'url(#blur-filter)';
                    })
                    .style("pointer-events", function(d) {
                        if (d.Quarter === quarterId)
                            return "auto";
                        return 'none';
                    })
                    .attr('role', 'quarter-stack')
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
                    .attr('xmlns:prodInfo', function(d) {
                        return [d.name, d.quarter];
                    })
                    .attr('ng-click', function(d) {
                        return "chartObj.drawMap('" + d.quarter + "'" + ',' + "'" + d.name + "')";
                    })
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
                scope.chartObj.isStackActive = true;
                scope.chartObj.showBubble = true;
                scope.$apply();
                $compile(ele)(scope);
            });
        }; // setShadowToChart Ends

        scope.value.drawMap = function(quarter, product) {

            $('#quartely-stack-chart').css({
                'border-right': '1px solid #ccc'
            });


            var products = scope.chartObj.products;
            if (typeof product === 'string') {

                if (products.indexOf(product) === -1) {

                    products.push(product);
                    scope.chartObj.selectedProducts.quarter = quarter;
                    var selectedProduct = {};
                    selectedProduct['name'] = product;
                    selectedProduct['value'] = true;
                    scope.chartObj.selectedProducts.products.push(selectedProduct);
                }

            } else if (typeof product === 'object' && product.length) {

                products = product;
            }


            console.log('scope.chartObj.selectedProducts.products[drawMap] :: ', scope.chartObj.selectedProducts.products);


            var numberFormat = d3.format('.2f');


            var worldChart = dc.geoChoroplethChart('#heat-map');
            var industryChart = dc.bubbleChart('#bubble-chart');

            d3.csv('./data/country.csv', function(csv) {
                var data = crossfilter(csv);

                var countries = data.dimension(function(d) {
                    return d['Country'];
                });

                var stateRaisedSum = countries.group().reduceSum(function(d) {
                    return d['Rev'];
                });

                var productDim = data.dimension(function(d) {
                    var index = products.indexOf(d['Product']);

                    if (index === -1) {
                        return product;
                    } else {
                        return products[index];
                    }
                });


                var statsByProduct = productDim.group().reduce(
                    function(p, v) {
                        if (v['Quarter'] == quarter && products.indexOf(v['Product']) !== -1) {
                            p.amountRaised += +v['Rev'];
                            p.amountSpent += +v['Adv'];
                        }

                        return p;
                    },
                    function(p, v) {
                        if (v['Quarter'] == quarter && products.indexOf(v['Product']) !== -1) {
                            p.amountRaised -= +v['Rev'];
                            p.amountSpent -= +v['Adv'];
                        }
                        return p;
                    },
                    function() {
                        return {
                            amountRaised: 0,
                            amountSpent: 0
                        };
                    }
                );

                d3.json('./json/world.json', function(statesJson) {
                    var width = 400;
                    var height = 320;
                    worldChart.width(width)
                        .height(height)
                        .dimension(countries)
                        .group(stateRaisedSum)
                        .projection(d3.geo.mercator()
                            .scale((height + 1) / 2 / Math.PI)
                            .translate([height / 2, height / 2])
                            .precision(0.1))
                        // .colors(d3.scale.quantize().range(['#b1fded', '#e3e6ff', '#ccff9a', '#fbeab4']))
                        // .colors(d3.scale.quantize().range(['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5']))
                        .colors(d3.scale.quantize().range(['red','green']))
                        // .colorDomain([0, 200])
                        .colorCalculator(function(d) {
                            console.log('colorCalculator :: ',d);
                            return d ? worldChart.colors()(d) : '#ccc';
                        })
                        .overlayGeoJson(statesJson.features, 'state', function(d) {
                            return d.id;
                        })
                        .title(function(d) {
                            return 'Country: ' + d.key + '\nTotal Amount Raised: ' + numberFormat(d.value ? d.value : 0) + 'M';
                        });



                    industryChart.width(430)
                        .height(350)
                        .margins({
                            top: 10,
                            right: 50,
                            bottom: 30,
                            left: 60
                        })
                        .dimension(productDim)
                        .group(statsByProduct)
                        .colors(d3.scale.category10())
                        .keyAccessor(function(p) {
                            return p.value.amountSpent;
                        })
                        .valueAccessor(function(p) {
                            return p.value.amountRaised;
                        })
                        .radiusValueAccessor(function(p) {
                            return p.value.amountRaised;
                        })
                        .x(d3.scale.linear().domain([0, 5000]))
                        .r(d3.scale.linear().domain([0, 4000]))
                        .minRadiusWithLabel(15)
                        .elasticY(true)
                        .yAxisPadding(100)
                        .elasticX(true)
                        .xAxisPadding(200)
                        .maxBubbleRelativeSize(0.07)
                        .renderHorizontalGridLines(true)
                        .renderVerticalGridLines(true)
                        .renderLabel(true)
                        .renderTitle(true)
                        .title(function(p) {
                            return p.key + '\n' + 'Amount Raised: ' + numberFormat(p.value.amountRaised) + 'M\n' + 'Amount Spent : ' + numberFormat(p.value.amountSpent);
                        });




                    industryChart.yAxis().tickFormat(function(s) {
                        return s + ' E';
                    });
                    industryChart.xAxis().tickFormat(function(s) {
                        return s + ' S';
                    });




                    dc.renderAll();

                });
                // $compile(ele)(scope);
            });
        }; // drawMap Ends



        scope.value.reset = function() {
            var self = this;
            scope.chartObj.products = [];
            scope.chartObj.selectedProducts = {
                quarter: '',
                products: []
            };

            $('#bubble-chart').fadeOut('slow', function() {
                $(this).html('');
            });

            $('#quartely-stack-chart').css({
                'border-right': '0'
            });

            $('#heat-map').fadeOut('slow', function() {
                $(this).html('');
            });

            $('#quartely-stack-group-chart').html('');
            this.groupStackedChart();
            scope.chartObj.isStackActive = false;
            scope.chartObj.showBubble = false;

        };

        /********************************************
            Watch the product item selection
        *********************************************/
        scope.$watch('chartObj.selectedProducts', function(newVal, oldVal) {
            console.log('newVal :: ', newVal);
            console.log('oldVal :: ', oldVal);
            var checked, unchecked;
            if (newVal.products !== oldVal.products) {
                var quarter = newVal.quarter;
                debugger;
                checked = $filter('filter')(newVal.products, {
                    'value': true
                });
                unchecked = $filter('filter')(newVal.products, {
                    'value': false
                });

                console.log('checked :: ', checked);
                console.log('unchecked :: ', unchecked);

                if (checked.length) {
                    scope.chartObj.products = [];
                    for (var i = 0; i < checked.length; i++) {

                        scope.chartObj.products.push(checked[i].name);
                    }

                    scope.chartObj.drawMap(quarter, scope.chartObj.products);
                    console.info('After Pushing [chartObj.products] :: ', scope.chartObj.products);

                } else if (checked.length === 0) {
                    scope.chartObj.reset();

                }
            }
        }, true);




    } //link Function ends

    return {
        link: link,
        restrict: 'EA',
        scope: {
            value: '='
        },
        templateUrl: './templates/quarterwise.tmpl.html',
        replace: true
    };
};

angular.module('GainTheory')
    .directive('quartelyStacked', quartelyStacked);
