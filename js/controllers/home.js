app.controller('HomeCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http','$tm1Ui', 
                            	function($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http,$tm1Ui) {
	$rootScope.pageTitle = "Home";
     
     $scope.defaults = {
        lineColorArray:["4181c3","40af9c","ffffff"],
        
     }
     $scope.filterSelections = [];
      $rootScope.showView = false; 

      $rootScope.charts = [];
     $rootScope.timeDriver = "period";
     $rootScope.pageTitle = 'C3 Directive';
     $rootScope.dimensionAlias = { "alias": { "Account":"Description", "Period":"Short Description", "Department":"Description", "Region":"Description" } };
     
     $scope.dimensionAlias = { "alias": { "Account":"Description", "Period":"Description", "Department":"Description", "Region":"Description" } };
     $rootScope.dimensionRowChartTypesOverride = {  "Budget":"bar",  "Actual":"bar", "Last Year":"bar", "Commissions":"bar", "Telephone":"bar","Utilities":"bar"}
     $rootScope.dimensionRowChartElementsGrouped= ["Telephone","Utilities"];
     $rootScope.percentageFormatElementArray = ["Amount Percentage","Amount M", "LY %", "Var %"]
     $rootScope.dimensionColors = { "Utilities":"red", "Amount":$rootScope.applicationActivePageColor,"OperatingExpenses":"darkorange", "Commissions":"steelblue","SalesandMarketing":"red", "OfficeFurniture&Equipment":"#1355ce" };
     $scope.mdxParam = { "parameters": {  
        "Version":$rootScope.defaults.version,
         "Year":$rootScope.defaults.year,
         "Period":$rootScope.defaults.period,
         "Region":$rootScope.defaults.region,
         "Account":$rootScope.defaults.account,
         "Department":$rootScope.defaults.department,
         "Measure":$rootScope.defaults.measure
        } };
       
        $scope.$watchCollection( '$root.defaults', function(newNames, oldNames) {

            
       console.log("PARAMETEERS HAVE CHANGED", newNames)
         $rootScope.loading = true;
         
          
         $scope.mdxParam = { "parameters": {  
            "Version":$rootScope.defaults.version,
             "Year":$rootScope.defaults.year,
             "Period":$rootScope.defaults.period,
             "Region":$rootScope.defaults.region,
             "Account":$rootScope.defaults.account,
             "Department":$rootScope.defaults.department,
             "Measure":$rootScope.defaults.measure
            } };
           
         
            //console.log("DEFAULTS FROM THE WATCHER", $scope.mdxParam)
         
         $timeout(
             function(){
                  $rootScope.loading = false;
   
             },100
         )
           
    
     //console.log("watch collection   ", newNames);
     
   
   });


      // $rootScope.bulletData = [
      //    {"title":"Revenue","subtitle":"US$, in thousands","ranges":[300],"measures":[270],"markers":[250]},
      //    {"title":"Profit","subtitle":"%","ranges":[30],"measures":[23],"markers":[26]},
      //    {"title":"Order Size","subtitle":"US$, average","ranges":[600],"measures":[320],"markers":[550]},
      //    {"title":"New Customers","subtitle":"count","ranges":[2500],"measures":[1650],"markers":[2100]},
      //    {"title":"Satisfaction","subtitle":"out of 5","ranges":[5],"measures":[4.7],"markers":[4.4]}
      //  ]  ;
      
       
}]);
