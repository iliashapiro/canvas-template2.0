
// app.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$http', '$localStorage', '$base64', function($scope, $rootScope, $state, $stateParams, $timeout, $http, $localStorage, $base64) {
//     $rootScope.searchFilterDropdownSelected  = false;
//      $rootScope.selections.searchInputClicked = false;
//      $rootScope.showView = false;
// }]);

app.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$http', '$localStorage', '$base64', '$tm1Ui', function($scope, $rootScope, $state, $stateParams, $timeout, $http, $localStorage, $base64,$tm1Ui) {
    
  //   $rootScope.searchFilterDropdownSelected  = false;
  //   $rootScope.selections.searchInputClicked = false;
  //   $rootScope.showView = false;
  //   $rootScope.loginActivated = true;
    
  //   $rootScope.storage = $localStorage;
  //    $rootScope.loginAttempt = 0;
  //    // $rootScope.uiPrefs['user'] = null;
  //    // $rootScope.uiPrefs['password'] = null;
  //    // $rootScope.storage['u'] = null;
  //    // $rootScope.storage['p'] = null;
  //    //console.log($rootScope.storage)
      
  //    let code = (function(){
  //       return{
  //         encryptMessage: function(messageToencrypt = '', secretkey = ''){
  //           var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
  //           return encryptedMessage.toString();
  //         },
  //         decryptMessage: function(encryptedMessage = '', secretkey = ''){
  //           var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
  //           var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
  //           return decryptedMessage;
  //         }
  //       }
  //   })();
    
    
  //   if( $rootScope.storage['_d'] != null &&  $rootScope.storage['_d'] != null){

  //   // var username =  $rootScope.storage['user'];
  //     if($rootScope.storage['_d']['p'] != 'undefined' && $rootScope.storage['_d']['p'] != null && $rootScope.storage['_d']['u'] != 'undefined' && $rootScope.storage['_d']['u'] != null){
  //       var pvar = code.decryptMessage($rootScope.storage['_d']['p'],'FFF');
  //       var pu = code.decryptMessage($rootScope.storage['_d']['u'],'FFF');
  //     //
  //       $tm1Ui.applicationLogin($rootScope.defaults.settingsInstance, pu, pvar).then(function(data){
  //          passvar = '';
  //           if(data.success === true){
  //               //console.log(pvar, pu, data, "trying to reload ")
  //             $timeout(
  //                function(){
                      
  //                      //console.log("attempt to log in count ",  $rootScope.loginAttempt )
  //                      $rootScope.loginAttempt++;
  //                      $rootScope.loginActivated = false;  
  //                      window.history.go(-1);
  //                }
  //             )
            
              
  //           }else{
  //             $rootScope.storage['_d'] = [];
  //             $rootScope.uiPrefs['_d'] = [];
  //           }
                     
                
              
            
            
  //        });
  //     }
     
  // }else{
  //    //console.log($rootScope.storage['_d']['p'], $rootScope.storage['_d']['u'])
  // }
    
  //   $scope.runThisafterUserhasLoggedIn = function(instance){
       
       
  //     $rootScope.loginActivated = false; 
  //      //window.history.go(1);
    
  //   }
    
     
  //   $scope.logInApp = function(uu,pp){
     
      
    
         
           
         
  //          $tm1Ui.applicationLogin($rootScope.defaults.settingsInstance, uu, pp ).then(function(data){
  //           if(data){

  //              if(data.success === true){
  //                 var str = code.encryptMessage(pp,'FFF');
  //                 var u = code.encryptMessage(uu,'FFF');
                   
  //                  $rootScope.storage['_d'] = [];
  //                  $rootScope.storage['_d']['u'] = u ;
  //                  $rootScope.storage['_d']['p'] =  str;
  //                  console.log($rootScope.storage['_d']['p'], $rootScope.storage['_d']['u'], data.success)
                   
                 
  //                  $rootScope.loginActivated = false; 
  //                  window.history.go(-1);  
  //                  console.log((window.location.href).split('?')[0], "HREFFFFFFF" )
               
                      
                  
  //              }else{
  //                 console.log("error message", data);
  //                 $rootScope.tryLogInLimit--;
  //                 $scope.errorMessage = 'Username '+uu+' or password "'+pp+'" is not correct.';
                   
                    
  //              }
                        
  //           }
            
               
             
           
           
  //       });
      
      
  //   }
        
    
     
   
}]);