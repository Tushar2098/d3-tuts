var ApplicationController = function($scope) {
    $scope.quarterlyChart = {
        width: 1100,
        products: [],
        isStackActive : false,
        showBubble : false,
        selectedProducts: {
            quarter: '',
            products: []
        }
    };
};



angular.module('GainTheory')
    .controller('ApplicationController', ApplicationController);
