angular.module('GainTheory', ['ngAnimate', 'ui.router', 'gridster'])
    .config(function($stateProvider, $urlRouterProvider) {



        $urlRouterProvider.otherwise("/dashboard");
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "partials/dashboard.html"
            })
            .state('state2', {
                url: "/state2",
                templateUrl: "partials/annual-wise.html"
            })
            .state('state3', {
                url: "/state3",
                templateUrl: "partials/quarter-wise.html"
            })
            .state('nationBubbleChart', {
                url: "/nationBubbleChart",
                templateUrl: "partials/nation-bubbleChart.html"
            });
    });
