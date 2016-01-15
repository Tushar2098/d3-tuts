var quartelyStacked = function($compile, $filter) {
    function link(scope, ele, attr) {
        scope.chartObj = scope.value;
        var countryNames = ['IND', 'CAN', 'USA'];
        var colors = ['red', 'orange', 'green'];

        
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



                scope.$apply(function() {
                    scope.chartObj.showBubble = true;
                    scope.chartObj.isStackActive = true;
                    $compile(angular.element('#quartely-stack-group-chart'))(scope);
                });
            });
        }; // setShadowToChart Ends

        /********************************************
            Calculates Revenue Expenditure for
            each Country
        *********************************************/
        var computeExpenditure = function(countryArr) {
            var arr = [];
            angular.forEach(countryArr, function(country) {

                for (var key in country) {
                    var products = country[key];
                    products.total = 0;
                    for (var p in products) {
                        if (p !== 'total') {

                            var amountRaised = products[p].amountRaised;
                            var amountSpent = products[p].amountSpent;
                            products[p].expenditure = amountRaised / amountSpent;
                            products.total += products[p].expenditure;
                        }
                    }
                    products.total = products.total / Object.keys(products).length - 1;
                }
            });
            return countryArr;
        };



        /********************************************
            Formats the RAW data and add some fields
        *********************************************/
        var formatData = function(csv) {
            var expd_countries = [];
            var countryObj = {};
            angular.forEach(csv, function(d) {


                var product = d.Product,
                    country = d.Country,
                    spent = +d.Adv,
                    raised = +d.Rev;


                if (!countryObj.hasOwnProperty(country)) {
                    countryNames.push(country);
                    countryObj = {};
                    countryObj[country] = {};
                    countryObj[country][product] = {

                        amountSpent: spent,
                        amountRaised: raised
                    };

                    expd_countries.push(countryObj);

                } else {
                    if (!countryObj[country].hasOwnProperty(product)) {
                        countryObj[country][product] = {
                            amountSpent: spent,
                            amountRaised: raised
                        };
                    } else {
                        countryObj[country][product] = {
                            amountSpent: countryObj[country][product].amountSpent + spent,
                            amountRaised: countryObj[country][product].amountRaised + raised
                        };
                    }
                }
            });

            return computeExpenditure(expd_countries);

        };

        /********************************************
            Sorts the countries based on Revenue
            Expenditure in ASC Order
        *********************************************/
        var sortByExpenditure = function(country1, country2) {


            var total1, total2;
            for (var i = countryNames.length - 1; i >= 0; i--) {

                if (country1.hasOwnProperty(countryNames[i])) {

                    total1 = country1[countryNames[i]].total;
                }

                if (country2.hasOwnProperty(countryNames[i])) {

                    total2 = country2[countryNames[i]].total;
                }

            }

            return total1 - total2; //ASC 
        };



        /********************************************
            Augment color to each country based on 
            their ranking.
        *********************************************/
        var assignColor = function(countries) {
            var countryColor = {};
            angular.forEach(countries, function(countryObj, index) {

                for (var key in countryObj) {
                    var products = countryObj[key];
                    products.color = colors[index];
                    countryColor[key] = products;
                }

            });

            return countryColor;
        };


        scope.value.drawMap = function(quarter, product) {
            //Repaint the shadow stacked chart only once.
            if (scope.chartObj.products.length === 0) {

                this.setShadowToChart(quarter);
            }


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

            } else if (product.constructor === Array && product instanceof Array) {

                products = product;
            }


            // console.log('scope.chartObj.selectedProducts.products[drawMap] :: ', scope.chartObj.selectedProducts.products);


            var numberFormat = d3.format('.2f');

            var countryObj = {};
            var arr = [];
            var worldChart = dc.geoChoroplethChart('#heat-map');
            var industryChart = dc.bubbleChart('#bubble-chart');

            d3.csv('./data/country.csv', function(csv) {


                var countryArr = formatData(csv).sort(sortByExpenditure);

                var countryColor = assignColor(countryArr);


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
                            amountSpent: 0,
                        };
                    }
                );

                d3.json('./json/world.json', function(statesJson) {

                    var height = 320;
                    var width = 400;
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
                        .colors(['red', 'orange', 'green'])
                        .colorDomain([0, 200])
                        .overlayGeoJson(statesJson.features, 'state', function(d) {
                            cid = d.id;
                            return d.id;
                        })
                        .colorCalculator(function(d) {
                            return countryColor[cid] ? countryColor[cid].color : '#ccc';
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

                // scope.chartObj.isStackActive = true;
                // scope.chartObj.showBubble = true;
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

            $('#bubble-chart').html('');


            $('#quartely-stack-chart').css({
                'border-right': '0'
            });

            $('#heat-map').html('');


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
            if (newVal !== oldVal) {
                var quarter = newVal.quarter;
                scope.chartObj.selectedProducts.quarter = quarter;
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

                } else {
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
        controller: function($scope) {
            $scope.quarterlyChart = {
                width: 1100,
                products: [],
                isStackActive: false,
                showBubble: false,
                selectedProducts: {
                    quarter: '',
                    products: []
                }
            };
        },
        replace: true
    };
};

angular.module('GainTheory')
    .directive('quartelyStacked', quartelyStacked);
