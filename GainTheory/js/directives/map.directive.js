var worldMap = function($compile, $filter) {
    function link(scope, ele, attr) {

        var countryNames = ['IND', 'CAN', 'USA'];
        var colors = ['red', 'orange', 'green'];
        scope.mapObj = scope.mapProp;

        /********************************************
            Watch the product item selection
        *********************************************/
        scope.$watch('mapObj.selectedProducts', function(newVal, oldVal) {
            console.log('newVal :: ', newVal);
            console.log('oldVal :: ', oldVal);

            if (newVal !== oldVal) {
                var checked, unchecked;
                checked = $filter('filter')(newVal.products, {
                    'value': true
                });
                unchecked = $filter('filter')(newVal.products, {
                    'value': false
                });



                console.log('checked :: ', checked);
                console.log('unchecked :: ', unchecked);

                if (checked.length) {
                    scope.mapObj.products = [];
                    for (var i = 0; i < checked.length; i++) {

                        scope.mapObj.products.push(checked[i].name);
                    }

                    scope.drawMap(scope.mapObj.products);
                    console.info('After Pushing [productArr] :: ', scope.mapObj.products);

                } else if (checked.length === 0) {
                    // scope.mapObj.reset();

                }
            }
        }, true);


        /********************************************
           Returns all Country Names
        *********************************************/
        var getCountryNames = function(csv) {

            angular.forEach(csv, function(d) {

                var country = d.Country;
                if (countryNames.indexOf(country) === -1) {
                    countryNames.push(country);
                }
            });
        };



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



        /********************************************
            Draws the Bubble chart and World Map
        *********************************************/
        scope.drawMap = function(prods) {


            var numberFormat = d3.format('.2f');
            var products = scope.mapObj.products;

            var worldChart = dc.geoChoroplethChart('#world-map');
            var industryChart = dc.bubbleChart('#bubble-chart');
            // var hitslineChart = dc.lineChart('#line-chart');

            d3.csv('./data/country.csv', function(csv) {

                if (typeof prods === 'undefined') {


                    angular.forEach(csv, function(d) {
                        var product = d.Product;

                        if (products.indexOf(product) === -1) {

                            products.push(product);
                            var selectedProduct = {};
                            selectedProduct['name'] = product;
                            selectedProduct['value'] = true;
                            scope.mapObj.selectedProducts.products.push(selectedProduct);
                        }
                    });
                } else {

                    var i = csv.length;
                    while (i--) {
                        var product = csv[i].Product;
                        products = prods;
                        if (products.indexOf(product) === -1) {
                            csv.splice(i, 1);
                        }
                    }
                }

                // getCountryNames(csv);
                var countryArr = formatData(csv).sort(sortByExpenditure);

                var countryColor = assignColor(countryArr);
                cc = countryColor;

                var data = crossfilter(csv);



                // W O R L D   M A P
                var countries = data.dimension(function(d) {
                    return d['Country'];
                });

                var stateRaisedSum = countries.group().reduceSum(function(d) {
                    return d['Rev'];
                });


                // B U B B L E   C H A R T
                var productDim = data.dimension(function(d) {

                    return d['Product'];
                });


                var statsByProduct = productDim.group().reduce(
                    function(p, v) {
                        p.amountRaised += +v['Rev'];
                        p.amountSpent += +v['Adv'];

                        return p;
                    },
                    function(p, v) {
                        p.amountRaised -= +v['Rev'];
                        p.amountSpent -= +v['Adv'];
                        return p;
                    },
                    function() {
                        return {
                            amountRaised: 0,
                            amountSpent: 0
                        };
                    }
                );


                // L I N E   C H A R T

                var expenditureGroup = productDim.group().reduceSum(function(d) {
                    return d.Adv;
                });


                d3.json('./json/world.json', function(statesJson) {
                    var width = 400;
                    var height = 345;
                    worldChart.width(width)
                        .height(height)
                        .dimension(countries)
                        .group(stateRaisedSum)
                        .projection(d3.geo.mercator()
                            .scale((height + 1) / 2 / Math.PI)
                            .translate([height / 2, height / 2])
                            .precision(0.1))
                        // .colors(d3.scale.quantize().range(['#b1fded', '#e3e6ff', '#ccff9a', '#fbeab4']))
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



                    industryChart.width(500)
                        .height(300)
                        .margins({
                            top: 10,
                            right: 50,
                            bottom: 30,
                            left: 40
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

                    /*hitslineChart
                        .width(500).height(330)
                        .dimension(productDim)
                        .margins({
                            top: 10,
                            right: 50,
                            bottom: 25,
                            left: 40
                        })
                        .group(expenditureGroup)
                        .x(d3.scale.ordinal().domain(['Q1', 'Q2', 'Q3', 'Q4']))
                        .xUnits(dc.units.ordinal)
                        .dotRadius(10)
                        .brushOn(false)
                        .renderHorizontalGridLines(true);*/

                    dc.renderAll();

                });
                // $compile(ele)(scope);
            });
        };

        scope.drawMap();
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            mapProp: '='
        },
        templateUrl: './templates/worldmap.tmpl.html',
        replace: true
    };
};

angular.module('GainTheory')
    .directive('worldMap', worldMap);
