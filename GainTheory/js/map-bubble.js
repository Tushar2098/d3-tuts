/* global d3,dc,$,crossfilter */


var products = [];

var drawMap = function(quarter, product, selector) {
    var numberFormat = d3.format('.2f');
    products.push(product);


    var worldChart = dc.geoChoroplethChart('#' + selector);
    var industryChart = dc.bubbleChart('#bubble-chart');
    // var roundChart = dc.bubbleChart('#round-chart');

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

                    /*console.warn('p +:: statsByProduct', p);
                    console.warn('v +:: statsByProduct', v);*/

                }

                return p;
            },
            function(p, v) {
                if (v['Quarter'] == quarter) {
                    p.amountRaised -= +v['Rev'];
                    p.amountSpent -= +v['Adv'];

                    /*console.info('p -:: statsByProduct', p);
                    console.info('v -:: statsByProduct', v);*/
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
            var height = 200;
            worldChart.width(width)
                .height(height)
                .dimension(countries)
                .group(stateRaisedSum)
                .projection(d3.geo.mercator()
                    .scale((height + 1) / 2 / Math.PI)
                    .translate([height / 2, height / 2])
                    .precision(0.1))
                // .colors(d3.scale.quantize().range(['#b1fded', '#e3e6ff', '#ccff9a', '#fbeab4']))
                .colors(d3.scale.quantize().range(['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5']))
                .colorDomain([0, 200])
                .colorCalculator(function(d) {
                    return d ? worldChart.colors()(d) : '#ccc';
                })
                .overlayGeoJson(statesJson.features, 'state', function(d) {
                    return d.id;
                })
                .title(function(d) {
                    return 'Country: ' + d.key + '\nTotal Amount Raised: ' + numberFormat(d.value ? d.value : 0) + 'M';
                });



            industryChart.width(400)
                .height(280)
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
            $('#bubble-chart').fadeIn('slow',function(){
                $(this).removeClass('hide');
            });

            $('#heat-maps .row').fadeIn('slow');
        });
    });
};
