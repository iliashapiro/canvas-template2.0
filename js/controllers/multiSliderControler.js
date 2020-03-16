app.controller('multiSliderController',['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http', '$tm1Ui',
function ($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http, $tm1Ui) {
   var vm = this;
   $rootScope.slider = this;
   vm.visible = false;
   $scope.loading = false;
   console.log("multi slider Controller")
   
   $scope.refreshData = function(){
      
      $scope.loading = true;
      $scope.sliderArray = [];
      $rootScope.dateMdxArray = [];
      $scope.resultData = [];
      $rootScope.resultData = [];
      
      if($rootScope.minValue != null && $rootScope.maxValue != null ){
         $scope.minValue =  $rootScope.minValue;
         $scope.maxValue =  $rootScope.maxValue;
       }else{
         // $scope.minValue =  1;
         // $scope.maxValue =  $scope.sliderArray.length;
       }
       $rootScope.reloadingChart  = true;
       
       
      
      $scope.resultData = $scope.dataset.headers[0].columns;
      console.log( "slider result", $scope.dataset.headers[0].columns, $scope.table.data());
      $rootScope.resultData = $scope.dataset.headers[0].columns;
      var count = 0;
      for(var hs = 0; hs < $scope.dataset.headers[0].columns.length; hs++){
          
          
            $scope.sliderArray.push({'value':hs+1,'key':$scope.dataset.headers[0].columns[hs].key,'legend':$scope.dataset.headers[0].columns[hs].element.attributes['Description']})
         
         
      }
      
      if($rootScope.minValue != null && $rootScope.maxValue != null ){
         
      }else{
       
            $scope.minValue =  1;
            $scope.maxValue =   $scope.sliderArray.length;
            $rootScope.minValue =  1;
            $rootScope.maxValue =   $scope.sliderArray.length;

        
        
         

      }
      $rootScope.sliderArray =  $scope.sliderArray;
      if($scope.maxValue === null){
         vm.slider_toggle = {
            minValue: $scope.minValue,
            options: {
               translate: function(value, sliderId, label) {
                  if(value != undefined && $scope.sliderArray[value-1] != undefined){
                  switch (label) {
                    case 'model':
                      return '' + $scope.sliderArray[value-1].legend;
                    case 'high':
                      return '' +  $scope.sliderArray[value-1].legend;
                    default:
                      return    $scope.sliderArray[value-1].legend
                  }
               }
                },
               stepsArray: $scope.sliderArray,
               floor: 1,
                
               
               ceil: $scope.sliderArray.length,
               showTicks: true, 
               noSwitching: true,
               draggableRange: true,
               onChange: vm.myChangeListener
            }
         };
      }else{
         vm.slider_toggle = {
            minValue: $scope.minValue,
            maxValue: $scope.maxValue,
            options: {
               translate: function(value, sliderId, label) {
                  if(value != undefined && $scope.sliderArray[value-1] != undefined){
                  switch (label) {
                    case 'model':
                      return '' + $scope.sliderArray[value-1].legend;
                    case 'high':
                      return '' +  $scope.sliderArray[value-1].legend;
                    default:
                      return    $scope.sliderArray[value-1].legend
                  }
               }
                },
               stepsArray: $scope.sliderArray,
               floor: 1,
                
               
               ceil: $scope.sliderArray.length,
               showTicks: true,
               
               noSwitching: true,
               draggableRange: true,
               onChange: vm.myChangeListener
            }
         };
      }
      
      $rootScope.slider = vm.slider_toggle;
      $scope.loading = false;
      vm.myChangeListener();
       
      
      
      
      
 
     
      
       
   }
   $rootScope.refreshSlider = function(){
      console.log("refresh slider", $rootScope.minValue, $rootScope.maxValue)
      $scope.refreshData();
      $rootScope.getConsolidatedData();

   }
   $scope.$watch(function () {
      return  $rootScope.minValue;

   }, function (newValue, oldValue) {
      vm.refreshSlider();
       

   });
   $scope.$watch(function () {
      return  $rootScope.maxValue;

   }, function (newValue, oldValue) {
      vm.refreshSlider();
      
      

   });
   $scope.$watch(function () {
      return  $rootScope.hideChart;

   }, function (newValue, oldValue) {
      
      if(newValue != oldValue && newValue != undefined){
         vm.refreshSlider();
      }
      
      
       
      
      

   });
   $scope.$on('slideEnded', function () {
      $rootScope.minValue = vm.slider_toggle.minValue;
      $rootScope.maxValue = vm.slider_toggle.maxValue

      $rootScope.getConsolidatedData();
  });
    
   vm.myChangeListener = function(sliderId) {
      $rootScope.dateMdxArray = []
    //  console.log(sliderId, 'has changed with ', vm.slider_toggle, vm.slider_toggle.minValue, vm.slider_toggle.maxValue);
      for(var ff = 0; ff < $scope.resultData.length; ff++){
         if(ff >= vm.slider_toggle.minValue-1 && ff <=  vm.slider_toggle.maxValue-1){
           
            $rootScope.dateMdxArray.push($scope.resultData[ff].UniqueName)
         }
      }
      if(!$rootScope.loaded){
         
         $rootScope.loaded = true;
            //console.log($rootScope.loaded, "load init")
         
      }
      // //console.log($rootScope.dragging)
      // console.log($scope.dateMdxArray,'data selected');
   };
   
   $scope.$watch(function () {
      return $rootScope.defaults.date;

   }, function (newValue, oldValue) {
     // console.log("defaults date changed ", newValue);
      
         $scope.refreshData();
         
       
       
      

   })
   vm.toggle = function () {
     vm.visible = !vm.visible;
     if (vm.visible)
       vm.refreshSlider();
   };
 
   vm.refreshSlider = function () {
     $timeout(function () {
       $scope.$broadcast('rzSliderForceRender');
     });
   };
}]);
