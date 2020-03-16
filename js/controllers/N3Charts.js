app.controller('N3ChartsCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui', function($scope, $rootScope, $log, $tm1Ui) {
   /*
    *     defaults.* are variables that are declared once and are changed in the page, otherwise known as constants in programming languages
    *     lists.* should be used to store any lists that are used with ng-repeat, i.e. tm1-ui-element-list
    *     selections.* should be used for all selections that are made by a user in the page
    *     values.* should store the result of any dbr, dbra or other values from server that you want to store to use elsewhere, i.e. in a calculation
    * 
    *     For more information: https://github.com/cubewise-code/canvas-best-practice
    */
    
    $scope.defaults = {};
    $scope.selections = {};
    $scope.lists = {};
    $scope.values = {};
    $rootScope.pageTitle = 'N3 Charts'
    
    $scope.options = {
        series: [
          {
            axis: "y",
            dataset: "dataset0",
            key: "val_0",
            label: "Series 1",
            color: "#1f77b4",
            type: ['column'],
            id: 'mySeries0'
          },
          {
              axis: "y",
              dataset: "dataset0",
              key: "val_1",
              label: "Series 2",
              color: "red",
              type: ['line', 'dot', 'area'],
              id: 'mySeries1'
            }
        ],
  
        axes: {x: {key: "x"}}
      };
      $scope.loadN3Chart = function(){
          $scope.data = {
              dataset0: [
                {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
                {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
                {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
                {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
                {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
                {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
                {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
                {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625}
              ]
            };
      }
       
      $rootScope.showView = false; 
       
}]);
