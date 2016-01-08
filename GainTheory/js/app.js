angular.module('GainTheory', ['ngAnimate','ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {



        $urlRouterProvider.otherwise("/state2");
        $stateProvider
            .state('state1', {
                url: "/state1",
                templateUrl: "partials/state1.html"
            })
            .state('state2', {
                url: "/state2",
                templateUrl: "partials/annual-wise.html"
            }).state('state3', {
                url: "/state3",
                templateUrl: "partials/quarter-wise.html"
            });
    });
