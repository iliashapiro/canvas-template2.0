app.controller('C3ChartsCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui','$compile',  function($scope, $rootScope, $log, $tm1Ui, $compile) {
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
         $rootScope.pageTitle = 'C3 Charts';
     
         $scope.chart = null;
         $scope.config = {};
         $scope.config.data1=" 30, 20, 50, 40, 60, 50";
         $scope.config.data2="200, 130, 90, 240, 130, 220";
         $scope.config.data3=" 300, 200, 160, 400, 250, 250";
         $scope.config.data4="200, 130, 90, 240, 130, 220";
         $scope.config.data5="130, 120, 150, 140, 160, 150";
         $scope.config.data6="90, 70, 20, 50, 60, 120";
 
         $scope.typeOptions=["bar","bar","spline","line","bar","area"];
         
         $scope.config.type1=$scope.typeOptions[0];
         $scope.config.type2=$scope.typeOptions[1];
         $scope.config.type3=$scope.typeOptions[2];
         $scope.config.type4=$scope.typeOptions[3];
         $scope.config.type5=$scope.typeOptions[4];
         $scope.config.type6=$scope.typeOptions[5];
     
     
     
         $scope.creatChart = function() {
         var config = {}; 
         config.bindto = '#c3chart';
         config.data = { onclick: function (d, element) { console.log(d, element) }};
         config.data.json = {};
         config.area = {};
         config.data.labels= { format: { y: d3.format('$') } };
         config.data.json.data1 = $scope.config.data1.split(",");
         config.data.json.data2 = $scope.config.data2.split(",");
         config.data.json.data3 = $scope.config.data3.split(",");
         config.data.json.data4 = $scope.config.data4.split(",");
         config.data.json.data5 = $scope.config.data5.split(",");
         config.data.json.data6 = $scope.config.data6.split(",");
         config.axis = {"y":{"label":{"text":"Number of items","position":"outer-middle"}}};
         config.data.types={
             "data1":$scope.config.type1,
             "data2":$scope.config.type2, 
             "data3":$scope.config.type3, 
             "data4":$scope.config.type4, 
             "data5":$scope.config.type5, 
             "data6":$scope.config.type6 
         };
          
         config.data.groups=[['data1','data2']];
         config.regions = [{start:0, end:1}];
          config.area = { zerobased: false};
         $scope.chart = c3.generate(config);	
         
         
     }
     $scope.creatChart();
       
 }]);
 