app.controller('C3DirectiveCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui','$timeout', '$interval', function($scope, $rootScope, $log, $tm1Ui, $timeout, $interval) {
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
        "Version":$rootScope.defaults['Version'],
         "Year":$rootScope.defaults['Year'],
         "Period":$rootScope.defaults['Period'],
         "Region":$rootScope.defaults['Region'],
         "Account":$rootScope.defaults['Account'],
         "Department":$rootScope.defaults['Department'],
         "Measure":$rootScope.defaults['General_Ledger_Measure']
        } };
       
       $rootScope.useSlider = true;
       $rootScope.useMultiSlider = false;
        $('.modal-content').resizable({
         //alsoResize: ".modal-dialog",
         minHeight: 300,
         minWidth: 300
       });
       $('.modal-dialog').draggable();
   
       $('#myModal').on('show.bs.modal', function() {
         $(this).find('.modal-body').css({
           'max-height': '100%'
         });
       });
       $('.modal').on('show.bs.modal', function() {
         $(this).find('.modal-body').css({
           'max-height': '100%'
         });
       });
       $scope.reloadPage = function(){
          $rootScope.defaults.refresh = true;
          $timeout(
              function(){
                  $rootScope.defaults.refresh  = false;
              },100
  
          )
      } 
        $rootScope.openRefModel = function(elementString, cubeName){
          
                 //$rootScope.dimensionArray = elementString;
                 
                 if((elementString+'').split(',').length > 0){
                     
 
                      $rootScope.cellreferenceArray = (elementString+'').split(',');
                      $rootScope.cellreferenceCube = cubeName;
                      $tm1Ui.cubeDimensions($rootScope.defaults.settingsInstance,cubeName).then(function(result){
                          $rootScope.dimensionArray = result;
                          $("#myModal").modal({show: true});
                         
                         
                      })
                  }
                 
             
                 
             }
             $scope.alertMessage = function(){
                 bootbox.alert({
                     message: "TPlease wait for page to load before selecting another element!",
                     backdrop: true
                 });
             }
     
         $rootScope.mdxElements = [];
         $rootScope.columnToShowArray = [];
     
          
             $rootScope.addToArray = function(name, chartDriverId, chartDimensionDriver, chartDriver){
                  $rootScope.loading = true;
                 if($rootScope.columnToShowArray[chartDriverId] === undefined){
                     $rootScope.columnToShowArray[chartDriverId] = [];
                 }else{
 
                 }
                
                //console.log('$$$$$$$ ' , name,'') 
                 if($rootScope.columnToShowArray[chartDriverId].indexOf(name) > -1){
                     $rootScope.columnToShowArray[chartDriverId].splice(($rootScope.columnToShowArray[chartDriverId]).indexOf(name), 1);
                   }else{
                     $rootScope.columnToShowArray[chartDriverId].push(name);
                   }
                   
                   $rootScope.mdxElements[chartDriverId] = '';
                 
                   for(var tt = 0 ; tt < $rootScope.columnToShowArray[chartDriverId].length; tt++){
                                        
                         if(tt === $rootScope.columnToShowArray[chartDriverId].length-1){
                             $rootScope.mdxElements[chartDriverId] +=  '['+chartDimensionDriver+'].['+chartDimensionDriver+'].['+$rootScope.columnToShowArray[chartDriverId][tt]+']';
                            
                         }else{
                             $rootScope.mdxElements[chartDriverId] += '['+chartDimensionDriver+'].['+chartDimensionDriver+'].['+$rootScope.columnToShowArray[chartDriverId][tt]+'],';
                   
                         }  
                   }
                     
                      if($rootScope.mdxElements[chartDriverId] === ''){
                         
                         $rootScope.mdxElements[chartDriverId] =  '['+chartDimensionDriver+'].['+chartDimensionDriver+'].['+$rootScope.defaults[chartDriver] +'] '
                      }
               
                      
                     // scope.getData();
                    
                     $scope.mdxParam.parameters[chartDimensionDriver] =  $rootScope.mdxElements[chartDriverId]
                      
                    
                     $timeout(
                         function(){
                              $rootScope.loading = false;
             
                         },1000
                     )
                     console.log( $rootScope.mdxElements[chartDriverId], $rootScope.columnToShowArray[chartDriverId], "product selected individual");
            }
 
 
     $scope.$watchCollection( '$root.defaults', function(newNames, oldNames) {
         if($scope.loading){
 
         }else{
             $rootScope.loading = true;
             if($rootScope.defaults.measure === 'Amount M' || $rootScope.defaults.measure === 'Amount Percentage'  ){
                 $rootScope.defaults.decimalPlace = 2;
             }else{
                 $rootScope.defaults.decimalPlace = 0;
             }
              
                 $scope.mdxParam = { "parameters": {  
                    "Version":$rootScope.defaults['Version'],
                    "Year":$rootScope.defaults['Year'],
                    "Period":$rootScope.defaults['Period'],
                    "Region":$rootScope.defaults['Region'],
                    "Account":$rootScope.defaults['Account'],
                    "Department":$rootScope.defaults['Department'],
                    "Measure":$rootScope.defaults['General_Ledger_Measure']
                 
                 }}
             
                
             
             $timeout(
                 function(){
                      $rootScope.loading = false;
     
                 }
             )
               
         }
         //console.log("watch collection   ", newNames);
         
       
      });
 
     
       
 }
 ]);
 app.directive('ngRightClick', ['$parse', function($parse) {
     return function(scope, element, attrs) {
         var fn = $parse(attrs.ngRightClick);
         element.bind('contextmenu', function(event) {
             scope.$apply(function() {
                 event.preventDefault();
                 fn(scope, {$event:event});
                  
             });
         });
     };
 }]);