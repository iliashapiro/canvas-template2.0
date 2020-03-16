app.controller('headerCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui', '$transitions','$location', '$timeout', 'globals','$window', 
function($scope, $rootScope, $log, $tm1Ui, $transitions,$location, $timeout, globals, $window) {
   /*
    *     defaults.* are variables that are declared once and are changed in the page, otherwise known as constants in programming languages
    *     lists.* should be used to store any lists that are used with ng-repeat, i.e. tm1-ui-element-list
    *     selections.* should be used for all selections that are made by a user in the page
    *     values.* should store the result of any dbr, dbra or other values from server that you want to store to use elsewhere, i.e. in a calculation
    * 
    *     For more information: https://github.com/cubewise-code/canvas-best-practice
    */
    
     //APP COLORS//
    $rootScope.applicationHeaderColor='#fff';
    $rootScope.applicationBodyColor='#fff';
    $rootScope.applicationComponentBorder = '2px solid #ccc';
    $rootScope.applicationActivePageColor = '#d83150';
    $rootScope.applicationActiveTextColor = '#fff';
    $rootScope.applicationTitleColor = '#333';
    $rootScope.applicationTextColor = '#fff';
    $rootScope.applicationActivePageDarkColor = '#a7213a';
    $rootScope.applicationHeaderColorSecondary='#333';
    $rootScope.applicationHeaderColorSelect = '#4F81BD';
    $rootScope.applicationHeaderColorBudget = ' #bdbdbd';
    $rootScope.applicationHeaderColorLastYear = '#e91042';
    $rootScope.dimensionLabelMapping = {"General Ledger Measure":"General_Ledger_Mapping"};
     
    $rootScope.dimensionAliases = { "Version":"Description","Period":"Short Description","Currency":"Description","Region":"Description","Department":"Short Description","Account":"Description"};
 $rootScope.filtersJson =[];
    $rootScope.cubeJson = {
        0:{Name:"General Ledger"},
        1:{Name:"Retail"}
       
    }
   
    $rootScope.scrollBarWidth = 15;
    $rootScope.scrollBarHeight = 10;
    $rootScope.loginActivated = false;
    //APP OFSETS//
    $rootScope.defaultOffSet = 50;
    $rootScope.zoomScale = 40;
    $rootScope.navTopOffset = 50; 
    $rootScope.topOffSet = $rootScope.defaultOffSet;

    // APP WIDTH AND HEIGHT //
    $rootScope.innerHeight = window.outerHeight;
    $scope.innerHeight = window.innerHeight;
    $rootScope.innerWidth = window.outerWidth;
    //DEFAULTS NAV PARAMETERS//
    
    $rootScope.selectedsubParentPage = '';
    $rootScope.topOffSetPageView = $rootScope.topOffSet+60;
    $rootScope.hasNum = [];
    $rootScope.subPageOver = '';
    $scope.print={};
    $rootScope.budgetVal = [];
    $rootScope.eventName = [];
    $rootScope.itemToView = [];
    $rootScope.itemToDisplay = 1;
     
    $scope.print.pageOrientation = "Landscape";
    $scope.print.pageSize = "A3";
    $rootScope.currentOver = -1;
    $rootScope.desktop = false;
    $rootScope.chartDimensionColors = {};
    $rootScope.lists = {

    }
    
    $rootScope.selection = {};
        var ua = navigator.userAgent;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)){
            $rootScope.desktop = false;

         } else if (/Chrome/i.test(ua)){
            $rootScope.desktop = false;

         }else{
            $rootScope.desktop = true;
         }
    $rootScope.pageUrlEncoded = function() {
		return encodeURIComponent($location.absUrl());
	};
	
	$rootScope.pageUrl = function() {
		return $location.absUrl();
	};
	$rootScope.goToNewPage = function(url){
        location.assign(url, '_blank')
    }
    $scope.clickedSubNav = function(num){
         
        $rootScope.activeSubTab = num;
       //console.log("sub nav clicked", $rootScope.activeSubTab, $rootScope.session.active);
    }
    $rootScope.values={
        user:[],
        year:''
    }; 
    
    $rootScope.defaults={
            searchActive : true,
            printOption:'pdf', 
            calendarCube:'Calendar',  
            settingsInstance: 'dev', 
            settingsCube: 'System User Settings',
            settingsMeasure: 'String',
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
            monthkey: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
             
    };
    $rootScope.planetOvalArray = [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1,]
    $rootScope.planetRadiusSize = [18,29,37,48,65,79,97,130,150,180,230,250,290,320,390,420,500,540,590,630,650,700,730];
    $rootScope.planetSize = [1,1.1,1.3,1.6,3,2,2.5,3.1,2,4.2,2.5,2.5,2,3,3,1.5,1.5,3,2.1,3.3,3.5,2,2.5,3,1.3,3,4,3,4,5];
    $rootScope.planetColour = ['#ebc415','#eb9515','#1592eb','#eb1550','#822830','#5b8798', '#2d4869','#081c3b', '#ebc415','#eb9515','#1592eb','#eb1550','#822830','#5b8798', '#2d4869','#ccc','#ebc415','#eb9515','#1592eb','#eb1550','#822830','#5b8798', '#2d4869','#081c3b'];
    $scope.on_request_success = function(response) {
  //console.debug('response', response);
    } 
     
    
    // Without JQuery
    // 
    $rootScope.getHalfPageHeightOfset = function(val){
        return ((window.innerHeight) - val)+'px';
    }
    $scope.on_request_error = function(r, text_status, error_thrown) {
  //console.debug('error', text_status + ", " + error_thrown + ":\n" + r.responseText);
    }
    $rootScope.pageUrl = function() {
		return $location.absUrl();
	};
	$rootScope.goToNewPage = function(url){
        window.open(url, '_blank');
    }
    $rootScope.goToPage = function(url){
       $timeout(
          function(){
            
             window.open(url, '_self');
          },1000
       )
      
  }
  $rootScope.goToParentPage = function(url){
      $rootScope.subPathBoolean = false;
      $rootScope.activeSubTab = 0;
      $timeout(
         function(){
            console.log(url)
            window.open(url, '_self');
              
            },1000
            )
      
  
}
    $rootScope.loadWeatherViaTi = function(regionName,userName){
        $scope.weatherCellsetPutArray = [];
        var path = location.pathname
      
       
         
        api_key = "feb028d6a3cf8710e58aaf25b2ed29f4"
        if($scope.capital){
            nurl = "https://api.openweathermap.org/data/2.5/weather?q="+$scope.capital+","+$rootScope.defaults.regionName+"&units=metric&appid="+api_key+"";
        }else{

            if($rootScope.defaults.regionName === 'Total Europe'){
                nurl = "https://api.openweathermap.org/data/2.5/weather?q=Europe&units=metric&appid="+api_key+"";
            }else{
                nurl = "https://api.openweathermap.org/data/2.5/weather?q="+$rootScope.defaults.regionName+"&units=metric&appid="+api_key+"";
            }
             
        }
        
        $rootScope.seeDataN = function(data){
            console.log(data)
        }
        $scope.readTextFile = function(file, callback) {
            
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }
         
            $.getJSON(nurl, function(data){
                
                var elementArrayToSend = {'city':data['name'],  'longitude':data['coord'].lon, 'latitude':data['coord'].lat, 'description':data['weather'][0].main,'clouds':data['clouds'].all, 'temperature':data['main'].temp }
                
                //console.log(elementArrayToSend, "WEATHER JSON NAMED MDX");
            
                _.forEach(elementArrayToSend, function(value, key) {
                    var request = {
                        value: (value+''), 
                        instance:$rootScope.defaults.settingsInstance, 
                        cube: "User Weather", 
                        cubeElements:[$rootScope.user.FriendlyName,key,"String"] 
                        }
                        $scope.weatherCellsetPutArray.push(request)
                  });
                 

                $tm1Ui.cellSetPut($scope.weatherCellsetPutArray).then(function(result){
                    if(result.success){
                        //console.log("Weather saved to TM1 ");
                        $tm1Ui.dataRefresh('weatherGroup');
                    }else{
                        //console.log("weather did not save")
                    }
                })
                 
                 
            }) // <=== was missing
        
         
    }
    $rootScope.cloudArray = [];
    $rootScope.showClouds = true;
    $rootScope.createCloudArray = function(num, weather){
        
        $rootScope.showClouds = true;
       //console.log("creating clouds array", num, weather )
        if(num > 15){
           if(weather === "Rain"){
                $scope.showRain = true;
                $scope.createRain(true);
                $rootScope.showClouds = true;
           }else{
            $rootScope.stopRain()
           }
            num = 15;
        }else{
            $rootScope.stopRain()
            if(weather === "Clear"){
                num = 0;
                $scope.showRain = false;
                $rootScope.cloudArray = [];
                $rootScope.showClouds = false;
            }
        }
        $rootScope.cloudArray = [];
            $timeout(
                function(){

                
                    
                    if(document.getElementsByClassName('cloud-group-container').length > 0){
                        for(bbb = 0; bbb < document.getElementsByClassName('cloud-group-container').length; bbb++ ){
                            if(document.getElementsByClassName('cloud-group-container')[bbb]){
                                
                            }
                            
                        }
                        
                    }
                
                    for(var gt = 0; gt < num; gt++){
                        $rootScope.cloudArray.push(gt)
                        
                    }
            }
        )


    }
    $rootScope.getWeather = function(region,userName){
        $timeout(
            function(){
              //  $rootScope.loadWeatherViaTi(region,userName);
            },3000
        )
        
    }
    $rootScope.applicationTriggerFindUser = function(){
        $rootScope.countIdel = 0;
        $rootScope.idelTimePassed = false;
        //console.log("checking the user loged in ");

        $tm1Ui.applicationUser($rootScope.defaults.settingsInstance).then(function(result){
            if(result){
                if(result['IsActive']){
                    $rootScope.user  = result;
                    $rootScope.userLoggedOut = false;
                    
               }else{
                    $rootScope.userLoggedOut = true;
               }
               
            }
           
            //console.log("USER", result)

           
              
        });
       
            
  
            
        
    }
    $rootScope.userLoggedOut = false;
    $rootScope.showView = true;
    
    $rootScope.closeApplication = function(view){
      
           $tm1Ui.applicationLogout($rootScope.defaults.settingsInstance).then(function(result){
                if(result['success']){
                   ////console.log("USE LOGGED OUT", $rootScope.user);
                  //  $rootScope.userLoggedOut = true;
                   // $rootScope.showView = false;
                  

                    
                }else{
                   
                   // $rootScope.showView = true;
                }
            });
            $rootScope.userLoggedOut = false;
             $rootScope.showView = true;
      
             
         
        

    }
    
    
    $rootScope.logout = function(sessionname){
       ////console.log(sessionname);

    }
     



  
    $scope.changeBg = function(){
       
       $timeout(
           function(){
            if(!$rootScope.nightTime){ 
          //console.log("color to use", "WHITE")  
                $rootScope.colortouse  = 'transparent'; 
            }else{
         //console.log("color to use", "DARK") 
               
                $rootScope.colortouse  =  '#000000c9' ;
              
                   
              
            }
        });
            
  
    
         
    } 
     $rootScope.findColorByHr = function(color){
             var m = moment($rootScope.overRideDate);
             
            //console.log(m);
            var g = null; //return g
            
            if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
            
            var split_afternoon = 12 //24hr time to split the afternoon
            var split_evening = 17 //24hr time to split the evening
            var currentHour = parseFloat(m.format("HH"));
           //console.log(currentHour)
            if(currentHour >= split_afternoon && currentHour <= split_evening) {
                g = "transparent";
                $rootScope.nightTime = false;
               
            } else if(currentHour >= split_evening) {
                $rootScope.nightTime = true;
                g = "#000000"+"c9";
            } else {
                $rootScope.nightTime = false;
                g ="transparent";
                
            }
           //console.log(g )
            return g;
        
    }
    
  
   
        $rootScope.query = function (loading) {
            var dimensionality = [];
                        $scope.loading = loading;
                        _.forEach($rootScope.cubeJson, function(dim, index) {
                             $tm1Ui.cubeDimensions($rootScope.defaults.settingsInstance, dim.Name).then(function(result){
                                if(result){
                                    
                                    _.forEach(result, function(el, index, arr) {
                                     // console.log(el,"result")
                                        
                                        var dimensionNameToUse =  (el+'')
                                     

                                         
                                        
                                        
                                        var elementNameToUse = (dimensionNameToUse+'').split(' ').join('_')
                                        var jsonElement = {
                                            name:elementNameToUse, 
                                            dimensionName:dimensionNameToUse,
                                            displayName:dimensionNameToUse,
                                            
                                            dimensionMdx:"{TM1SubsetAll(["+dimensionNameToUse+"].["+dimensionNameToUse+"])}",
                                            selectOnly:false,
                                            onlyShow:'Home,C3 Directive'
                                        };
                                        
                                         
                                        //   if($rootScope.dimensionAliases[dimensionNameToUse]){
                                        //     jsonElement['alias'] = $rootScope.dimensionAliases[dimensionNameToUse];
                                        //   }
                                           
                                         
                                           
                                        // $tm1Ui.dimensionElements($rootScope.defaults.settingsInstance, dimensionNameToUse).then(function(result){
                                        //     if(result.length > 0){
                                        //        // console.log("result from extracting elements", result, jsonElement)
                                        //        // jsonElement['defaultElement'] = result[0].Name;
                                                
                                        //     }else{
                                                
                                        //     }
                                            
                                        // })
                                            dimensionality.push(jsonElement);
                                             
                                       
                                    })
                                    
                                  
                                      $rootScope.filtersJson = dimensionality;
                        $scope.initializeVariables();
                                      
                                }else{
                                    //console.log("weather did not save")
                                }
                            })
                        })
                       

                      
                      
                    
                
           
          
            
                 
                    
                 
               
            
           
        }
      
      
   $rootScope.initialisedFilters = false;
    $rootScope.resetFilterJsonwithSystemInfo = function(){
        
    }

    
    /// REFRESH ALL COMPONENTS ON THE PAGE FUNCTION FIRED EVERY TIME THE 3 KPI OR THE MAIN CHART NEEDS TO SHOW NEW VALUES
        $scope.initializeVariables = function(){
             console.log("jsonparameters creating", $rootScope.filtersJson);
                                     

            $tm1Ui.applicationUser($rootScope.defaults.settingsInstance).then(function(data){

                $rootScope.values.user = data;
                  
                for( var f = 0; f < $rootScope.filtersJson.length; f++){
                 // console.log("filters update init", $rootScope.filtersJson.length);
                    if( $rootScope.filtersJson[f]['alias'] === '' ){
                        globals.updateSettings($rootScope.values, $rootScope.defaults, $rootScope.selections, $rootScope.filtersJson[f]['name'], {"tm1Dimension":$rootScope.filtersJson[f]['dimensionName']}, $rootScope.filtersJson[f]['defaultElement']);
                    }else{
                        globals.updateSettings($rootScope.values, $rootScope.defaults, $rootScope.selections, $rootScope.filtersJson[f]['name'], {"tm1Dimension":$rootScope.filtersJson[f]['dimensionName'], "tm1Alias":$rootScope.filtersJson[f]['alias']}, $rootScope.filtersJson[f]['defaultElement']);
                    }
                }
                  
                $rootScope.initialisedFilters = true;
              
            
                 
            
            });   
            
        }

        $rootScope.showFilter = false;
        $rootScope.showModel = function(){
            $rootScope.showFilter = !$rootScope.showFilter;
        }
        $rootScope.decideToShowFilter = function(array,key){
            var decider = false;   
            for(var ss = 0; ss < array.length;ss++){
           // console.log(array[ss],'  = ',key)
               if(array[ss] === key){
                  decider = true;
                    
               }
      
            }
      
            if(decider){
               return true;
      
            }else{
               false
            }
        }
        $scope.seeRegionalData = function(){
            console.log('see regional data')
        }
        $rootScope.updateRegionSetting = function(region){
            //console.log(region, $rootScope.selections.region);
            $rootScope.defaults.region = region;
            //$scope.updateSettings($rootScope.values, $rootScope.defaults, $rootScope.selections, "region", {"tm1Dimension":"Region", "tm1Alias":"Description"})
        }
            
            //Initialize all variables
        $scope.updateSettings = function (values, defaults, selections, parameter, options, defaultElement){
               
          // $rootScope.calendarDateSelected = $rootScope.dateNumber+"/"+ $rootScope.calendarMonthSelected+"/"+ $rootScope.selections.year;
          
            globals.updateSettings(values, defaults, selections, parameter, options, defaultElement); 
           // $rootScope.getWeather($rootScope.defaults.regionName, $rootScope.user.FriendlyName);
            
            // $rootScope.refreshCalendar();
            //console.log($scope.defaults.year, $scope.defaults.version, $scope.defaults.region, $scope.defaults.department, $scope.defaults.homeSubset, $scope.defaults.homeAccount);
          
        }
        
         
             

            //Run Initialization
        $rootScope.updateSettings = function (values, defaults, selections, parameter, options, defaultElement){
            
            // $rootScope.calendarDateSelected = $rootScope.dateNumber+"/"+ $rootScope.calendarMonthSelected+"/"+ $rootScope.selections.year;
            
                globals.updateSettings(values, defaults, selections, parameter, options, defaultElement); 
                // $rootScope.getWeather($rootScope.defaults.regionName, $rootScope.user.FriendlyName);
                
                // $rootScope.refreshCalendar();
                //console.log($scope.defaults.year, $scope.defaults.version, $scope.defaults.region, $scope.defaults.department, $scope.defaults.homeSubset, $scope.defaults.homeAccount);
            
            }
               
                   
       
        
  $scope.getLeftMargin = function(idname){
    if(document.getElementById(idname) ){
      // //console.log(document.getElementById(idname).getBoundingClientRect().left  );
        if(document.getElementById("pop-over-body")){
            document.getElementById("pop-over-body").style.left = ((document.getElementById(idname).getBoundingClientRect().left)*0.75) +"px";
        }
        
    }
  }
  
   $window.onscroll = function(){

            $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
             
              if( document.getElementById('dropdownbtns')){
                  
                document.getElementById('dropdownbtns').style.top=  ((document.getElementById('dropdownbtns').style.top) -$scope.scrollPos) +"px"
                  //console.log(document.getElementById('dropdownbtns').style.top);
              }
               
            $scope.$digest();
        };

  
  $rootScope.onChartElementClick = function(element){
     //console.log("element:", element);
  }
  $rootScope.selections={
    searchInput:'',
    searchInputClicked : false,
    year:'',
    version:'',
    region:'',
    department:''
    
};
 

  $transitions.onSuccess({}, function ($transitions) {
        
        
    $rootScope.colortouse = $rootScope.findColorByHr($rootScope.applicationHeaderColor);
    $rootScope.pathToUse = $transitions._targetState._identifier.name;
      //$rootScope.pathArray = $transitions._targetState._identifier.navigable.path;
      if($transitions._targetState._identifier.navigable){
        $rootScope.pathArray = $transitions._targetState._identifier.navigable.path;
      }
       
                      
    $timeout( function(){ 
       //console.log($rootScope.pathArray, "path array");
         
        if(($rootScope.pathArray[1].name).split("/").length > 1  ){
            $rootScope.subPathBoolean = true; 
            
           //console.log(($rootScope.pathArray[1].name).split("/").length, "sub path true");
        }else{
            if(($rootScope.pathArray[1].name) === 'base'){
                //console.log($rootScope.pathArray[1].name, "No Sub Path");
                 $rootScope.subPathBoolean = false;
            }else{
                //console.log($rootScope.pathArray[1].name, "No Sub Path");
                $rootScope.subPathBoolean = false;
            }
            
        }
        if(!$rootScope.activeTab && $rootScope.pathToUse === 'base'){
            $rootScope.activeTab = -1;
             $rootScope.subPathBoolean = false;
        }else{
             if($rootScope.menuData[0]['children'] ){
                for(var i = 0; i < $rootScope.menuData[0]['children'].length; i++){
                    if($rootScope.menuData[0]['children'][i]['data'].page === ($rootScope.pathArray[1].name).split("/")[0]){
                        $rootScope.activeTab = parseInt(i); 
                         $rootScope.selectedsubParentPage = (($rootScope.pathArray[1].name).split("/")[0]).split("-").join(" ")+" / ";
                        if(document.getElementById('level-two-'+($rootScope.pathArray[1].name).split("/")[0])){
                                // document.getElementById('level-two-'+($rootScope.pathArray[1].name).split("/")[0]).setAttribute("class", "active"); 
                        }
                            
                    }else{
                        if(document.getElementById('level-two-'+($rootScope.pathArray[0].name).split("/")[0])){
                            //document.getElementById('level-two-'+($rootScope.pathArray[0].name).split("/")[0]).setAttribute("class", "active"); 
                        }
                    
                   
                    }
               }
             }
             
             }
        
    }, 100);
  })
  $scope.animateSideBar = function(a, b, open){
       if(open){
        if($rootScope.innerWidth < 614){
            document.getElementById("righthandsidebar").style.marginLeft = -($rootScope.innerWidth)+"px";
         }else{
               document.getElementById("righthandsidebar").style.marginLeft = (-375)+"px";
         }
         
       }else{
             
           document.getElementById("righthandsidebar").style.marginLeft = (0)+"px";
       }
             
       
     
  }

  $scope.animatePaddingTopSideBar= function(number){
     
      document.getElementById("righthandsidebar").style.marginTop = (number+48)+"px";
  }
  $scope.animatePadding = function(number){
      document.getElementById("header").style.paddingTop = number+"px";
  }

    // STARTED new page transition///
    $transitions.onStart({}, function ($transitions) {

           $timeout( function(){ 
            
              $rootScope.pathToUse = $transitions._targetState._identifier.name;
                   if($transitions._targetState._identifier.navigable){
                        $rootScope.pathArray = $transitions._targetState._identifier.navigable.path;
                    }
                                    

                     if($rootScope.menuData){
                           
                          
                         //console.log("%%%%%%% R" ,   $rootScope.menuData[0]['children'][0]['data'].page, document.getElementById($rootScope.pathToUse));
                         
                        if( $rootScope.pathToUse === '' || $rootScope.pathToUse === 'base' ){
                                 $rootScope.activeTab = -1;
                        }else{
                            
                             if($rootScope.menuData[0]['children'] ){
                                for(var i = 0; i < $rootScope.menuData[0]['children'].length; i++){
                              
                                    if($rootScope.menuData[0]['children'][i]['data'].page === $rootScope.pathToUse){
                                         if(!$rootScope.subPathBoolean){
                                            $rootScope.activeTab = parseInt(i);
                                             
                                        // 
                                         }
                                    }else{
                                          
                                     
                                    }
                                }
                             }  
                            
                         }  
                 }    
            } ); 
             
     });

    $rootScope.createCSSSelector = function(selector, style) {
        if (!document.styleSheets) return;
        if (document.getElementsByTagName('head').length == 0) return;

        var styleSheet,mediaType;

        if (document.styleSheets.length > 0) {
            for (var i = 0, l = document.styleSheets.length; i < l; i++) {
            if (document.styleSheets[i].disabled) 
                continue;
            var media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType === 'string') {
                if (media === '' || (media.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }
            else if (mediaType=='object') {
                if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (typeof styleSheet !== 'undefined') 
                break;
            }
        }

        if (typeof styleSheet === 'undefined') {
            var styleSheetElement = document.createElement('style');
            styleSheetElement.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

            for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
            }

            mediaType = typeof styleSheet.media;
        }

        if (mediaType === 'string') {
            for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
            if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
            }
            styleSheet.addRule(selector,style);
        }
        else if (mediaType === 'object') {
            var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
            for (var i = 0; i < styleSheetLength; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
            }
            styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
        }
    }

    $rootScope.createCSSSelector('.tm1-login-modal','pointer-events:none; background-repeat: no-repeat; background-attachment: fixed; background-position: top center; background-color: '+$rootScope.applicationHeaderColor+';');
    $rootScope.createCSSSelector('.tm1-login-modal .panel-default > .panel-heading', 'color: #fff; padding-top: 40px; padding-bottom: 20px; background-repeat: no-repeat; background-position: 50% 50%; border-color: transparent; background-color: '+'rgba(0,0,0,0.3)'+' !important;');
    $rootScope.createCSSSelector('.right-hand-nav', 'position:fixed; left:100%; height:100%; width:300px; background-color: '+$rootScope.applicationHeaderColorSecondary+'; top:0px; -webkit-transition: margin-top 500ms ease-out ; -moz-transition: margin-top 500ms ease-out ; -o-transition: margin-top 500ms ease-out ; transition: margin-top 500ms ease-out ; ');
    $rootScope.createCSSSelector('.navbuttons .active', 'display: inline-block; vertical-align: top; background-color: #fff; border: 0px solid #ddd; color:'+$rootScope.applicationActiveTextColor+' !important; ');
    $rootScope.createCSSSelector('.navbuttons .active a', ' background-color: '+$rootScope.applicationActivePageColor+';  color:'+$rootScope.applicationActiveTextColor+' !important; ');
    $rootScope.createCSSSelector('.navbuttons li', 'display: inline-block; vertical-align: top; background-color: '+$rootScope.applicationHeaderColorSecondary+'; border: 0px solid #ddd; color: #fff !important; ');
    $rootScope.createCSSSelector('.selected-bg',' background-color: '+$rootScope.applicationHeaderColorSelect+'; color:#fff; ');
    $rootScope.createCSSSelector('.bullet .actual.a','  fill:  '+$rootScope.applicationHeaderColorSelect+'; ');
    $rootScope.createCSSSelector('.bullet .measure.d0','  fill: '+$rootScope.applicationHeaderColorBudget+' ');
    $rootScope.createCSSSelector('.bullet .marker','  stroke: '+$rootScope.applicationHeaderColorLastYear+'; stroke-width: 2px; ');
    $rootScope.createCSSSelector('.active-subtab',' margin-left:5px; background-color: '+$rootScope.applicationActivePageColor+'; color: '+ $rootScope.applicationActiveTextColor);
    $rootScope.createCSSSelector('.rolledOverTab','  background-color: '+$rootScope.applicationActivePageColor+'; color: '+ $rootScope.applicationActiveTextColor);
    $rootScope.createCSSSelector('#c3_waterfall_chart .c3-target-hide-line .c3-lines, #c3_waterfall_chart .c3-target-hide-line .c3-circles',' display:none');
    $rootScope.createCSSSelector('html, body',' background-color:'+$rootScope.applicationBodyColor+' !important');
    $rootScope.createCSSSelector('.rzslider .rz-tick.rz-selected',' background:'+$rootScope.applicationActivePageColor+' !important');
    $rootScope.createCSSSelector('.rzslider .rz-pointer.rz-active:after',' background-color:'+$rootScope.applicationActivePageDarkColor+' !important');
    $rootScope.createCSSSelector('.rzslider .rz-selection',' z-index: 2;  background: '+$rootScope.applicationActivePageColor+' !important;  border-radius: 2px; transition: background-color linear 0.3s;');
    $rootScope.createCSSSelector('.rzslider .rz-pointer',' top: -14px;    z-index: 3;    width: 32px;    height: 32px;    cursor: pointer;    background-color: '+$rootScope.applicationActivePageColor+' !important;    border-radius: 16px;    transition: all linear 0.3s;');
    $rootScope.createCSSSelector('.input-group-addon','  padding: 6px 12px; font-size: 14px; font-weight: normal; line-height: 1; color: '+$rootScope.applicationActiveTextColor+' !important; border:0px solid transparent !important;text-align: center; background-color: '+$rootScope.applicationActivePageColor+' !important; border: 1px solid #ccc;  border-radius: 4px;');
    $rootScope.createCSSSelector('.btn-primary' ,'color: #fff; background-color: '+$rootScope.applicationHeaderColorSecondary+' !important; color: #fff; border: none !important;');
    $rootScope.createCSSSelector('::-webkit-scrollbar-thumb','  cursor:pointer; background: '+$rootScope.applicationActivePageColor+'; box-shadow: 0px 5px 10px rgba(0,0,0,0.3) ;  background-image: linear-gradient('+$rootScope.applicationActivePageDarkColor+', '+$rootScope.applicationActivePageColor+', '+$rootScope.applicationActivePageDarkColor+');');
  $rootScope.createCSSSelector('::-webkit-scrollbar',' height: '+($rootScope.scrollBarHeight-4)+'px !important;  width: '+($rootScope.scrollBarWidth-4)+'px !important;');
////  .rzslider .rz-selection {   z-index: 2;  background: steelblue; border-radius: 2px; transition: background-color linear 0.3s;}   ////
    $rootScope.countIdel = 0;
    $rootScope.mouseMovedSetXY = function($event){
       $rootScope.windowclientX = event.clientX;     // Get the horizontal coordinate
        $rootScope.windowclientY = event.clientY; 
       ////console.log(event.x, event.y);
        $scope.mouseMovedXY = event.x+' '+event.y;
        if($rootScope.idelTimePassed){
            if(!$rootScope.loggedOut){
                $tm1Ui.applicationUser($rootScope.defaults.settingsInstance).then(function(result){
                if(result){
                    if(result['IsActive']){
                   ////console.log(result, "LOGIN INFO");
                        $rootScope.alpha = 0; 
                        $rootScope.loggedOut = false;
                        $rootScope.idelTimePassed =false;
                        $rootScope.runTimeout(); 
                    }else{
                        
                         
                            $rootScope.loggedOut = true;
                             
                    }
                }else{
                        
                       $rootScope.loggedOut = true;
                            
                }
                 
                
            });
            }
            
        }
         

        
      
        
       
    }
    $rootScope.scheduleShow = false;
    $rootScope.idelTimePassed =false;
    $rootScope.alpha = 0;
    $rootScope.runTimeout = function(){
    if(!$rootScope.scheduleShow  ){
        $timeout(
            function(){
 
                if($rootScope.countIdel > 60){
                      
                    if($scope.mouseMovedXY === $scope.lastMovedXY){
                         //console.log("running timeout",$rootScope.alpha, $rootScope.countIdel,  $scope.lastMovedXY, $scope.mouseMovedXY);
                        if($rootScope.alpha >= 0.9){
                            $rootScope.idelTimePassed = true;
                            $rootScope.countIdel = 251;
                            $rootScope.alpha  = 0.9;
                        }else{
                              $rootScope.idelTimePassed = true;
                              $rootScope.countIdel = 0;
                              $rootScope.runTimeout();
                        }
                        
                        
                          
                    }else{
                        //console.log($rootScope.countIdel, $scope.mouseMovedXY,  $scope.lastMovedXY,  "mouse moved");
                        $rootScope.loggedOut = false;
                         
                        $rootScope.idelTimePassed = false;
                        $rootScope.countIdel = 0;
                        
                        $rootScope.runTimeout();
                    }
                    $scope.lastMovedXY = $scope.mouseMovedXY;

                }else{
                    if($rootScope.countIdel === 0){
                        $scope.lastMovedXY = $scope.mouseMovedXY;
                    }
                   
                    if( $rootScope.idelTimePassed  ){ 
                           
                           ////console.log("STARTED PAUSE HIDING INFO");
                           if($scope.mouseMovedXY === $scope.lastMovedXY){
                                $rootScope.alpha = 0.9; 
                               // $rootScope.closeApplication(false);
                                 $rootScope.showView = false;
                           //$rootScope.activeTab = -2;
                           }
                        
                    } 
                  //console.log("count",  $rootScope.desktop, $rootScope.countIdel,$scope.lastMovedXY, $scope.mouseMovedXY); 
                    $rootScope.countIdel++; 
                    $rootScope.runTimeout();
                }
                
            },1000
        )
        }
    }
     
    //$rootScope.runTimeout();
    $rootScope.birdsKilled = 0;
    $rootScope.birdKilledArray = [];
    $rootScope.birdsCapturedCount = 0;
    $rootScope.doBirdKill = function(bird){
        $rootScope.birdsKilled = $rootScope.birdsKilled +1;
        //console.log("kill bird ",bird );
    }
    $rootScope.getRandomArbitrary = function(min, max) {
        return Math.abs( Math.random() * (max - min) + min);
    }
    
    $rootScope.seeData = function(cell){
      //  console.log(cell, "menu data")
    }
    
      


    $rootScope.findLengthOfJsonObg=  function(data){
        return _.keys(data).length
    }
    $rootScope.getContainerTop = function(id, bottomOffset){
        
        if(document.getElementById(id)){
           // //console.log(id, bottomOffset, document.getElementById(id));
            var tempObjToTrack = document.getElementById(id);
            if(tempObjToTrack != null || tempObjToTrack != undefined ){
                return tempObjToTrack.getBoundingClientRect().top;
            }
        }
    }
    
    $rootScope.setContainerHeight = function(id, bottomOffset){
        if(document.getElementById(id)){
            var tempObjToTrack = document.getElementById(id);
            if(tempObjToTrack != null || tempObjToTrack != undefined ){
                return (( (window.outerHeight) - (tempObjToTrack.getBoundingClientRect().top)-bottomOffset ));
            }
        }
    }
    $rootScope.triggerResize = function(){
        $timeout(function() {
            $window.dispatchEvent(new Event("resize"));
        }, 100);
     }
    $(window).resize(function() { 
        $timeout(
            function(){
                $scope.innerHeight = window.innerHeight;
                $rootScope.innerHeight = window.outerHeight;
                $rootScope.innerWidth = window.outerWidth ;
                $scope.innerWidth = window.innerWidth;
                $scope.innerHeight = window.innerHeight
            }
        )
    });

    // number of drops created.
    var nbDrop = window.outerHeight/10; 

    // function to generate a random number range.
    $rootScope.randRange = function ( minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }

     
    // function to generate drops
  
    
    $rootScope.refreshData = function(){
            $tm1Ui.dataRefresh()
    }
    $rootScope.galaxySelected = function(index){
        //console.log(index, "galaxy selected")
    }
    $rootScope.showPrint = function(){
        if($rootScope.printOpened === true){
            $rootScope.printOpened = false;
        }else{
            $rootScope.printOpened = true;
        }

    } 
    if(!$rootScope.loginActivated){
        $scope.initializeVariables();
       }

 
        
}]);

 
app.filter('capitalize', function() {
    return function(token) {
        var stringTotest = '';
        if(token != undefined ){
            for(var tt = 0; tt < (token).split(" ").length; tt++){
                var tok = (token).split(" ")[tt];
                stringTotest += tok.charAt(0).toUpperCase() + tok.slice(1) +" ";
            }
              return   stringTotest;
        }else{
            return stringTotest;
        }
       
    
   }
});

 