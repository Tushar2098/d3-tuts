var ApplicationController = function($scope) {
    $scope.quarterlyChart = {
        width : 1100,
        products:[]        
    };

    $scope.getProductInfo = function() {
        $scope.quarterlyChart = {
            width : 530,
            products:[]
        };
    };
};



angular.module('GainTheory')
    .controller('ApplicationController', ApplicationController);
