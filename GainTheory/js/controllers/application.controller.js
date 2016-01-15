var ApplicationController = function($scope, $rootScope) {
    /* $scope.quarterlyChart = {
         width: 1100,
         products: [],
         isStackActive: false,
         showBubble: false,
         selectedProducts: {
             quarter: '',
             products: []
         }
     };*/


    /*  $rootScope.$on('$stateChangeStart', function() {
          $scope.loading = true;

      });*/

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        $scope.page = toState.name;

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
    });

    
};



angular.module('GainTheory')
    .controller('ApplicationController', ApplicationController);







var DashboardController = function($scope, $rootScope) {

    $scope.map_bubble = {
        products: [],
        selectedProducts: {
            products: []
        }
    };

    $scope.gridsterOptions = {
        // margins: [15, 30],
        columns: 6,
        draggable: {
            handle: 'h3'
        }
    };


    $rootScope.$on('gridster-item-resized', function(item) {
        // item.$element
        // item.gridster
        // item.row
        // item.col
        // item.sizeX
        // item.sizeY
        // item.minSizeX
        // item.minSizeY
        // item.maxSizeX
        // item.maxSizeY
        console.info('gridster-item-resized Called');
    });
};


angular.module('GainTheory')
    .controller('DashboardController', DashboardController);


/*var GraphController = function($scope, $rootScope) {

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
};

*/

