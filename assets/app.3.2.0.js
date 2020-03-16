
var topOffset = 50;
 
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

var appModules = ['ui.router', 'angularMoment', 'ngSanitize', 'ngFileUpload',
                  'ngStorage', 'angularBootstrapNavTree', 'angularUUID2', 'nvd3', 'tm1Ui.provider',
                  'ui.bootstrap', 'base64', 'tm1Ui', 'ui.bootstrap.contextMenu', 'textAngular', 'ngBootbox', 
                  'hljs', 'ngTable', 'pascalprecht.translate', 'matchMedia', 
                  'ngclipboard', 'angular-carousel','dndLists','vs-repeat'];

appModules.push('ui.ace');

// UI-Grid related libraries
appModules.push('ui.grid');
appModules.push('ui.grid.resizeColumns');
appModules.push('ui.grid.edit');
appModules.push('ui.grid.cellNav');
appModules.push('ui.grid.selection');
appModules.push('ui.grid.treeView');

// add custom module(s)
if(customAngularModules.length > 0){
	var checkIfExisting = function(collection, item){
		for(var i = 0; i < collection.length; i++){
			if(collection[i] == item){
				return true;
			}
		}
		
		return false;
	};
	
	for(var i = 0; i < customAngularModules.length; i++){
		if(customAngularModules[i].trim().length > 0 && !checkIfExisting(appModules, customAngularModules[i])){
			appModules.push(customAngularModules[i]);
		}
	}
}

var app = angular.module('app', appModules);

// Constants
var appConstants = {
	OIDC_STATE_SEPARATOR: '---'
};

app.config(['$stateProvider', '$logProvider', 'tm1UiRouterProvider', 'hljsServiceProvider', function($stateProvider, $logProvider, tm1UiRouterProvider, hljsServiceProvider) {
	
	$logProvider.debugEnabled(false);
	
	// default - required to have at least one
	if(appSettings.isDemo){
		$stateProvider.state("base", {url: '', templateUrl: 'html/samples/sample-home.html'});
	}
	else{
		$stateProvider.state("base", {url: '', templateUrl: 'html/home.html'});
	}
	
	tm1UiRouterProvider.setCollectionUrl('api/app/states');
	
}]);

app.config(['$translateProvider', function ($translateProvider) {
	
	var lang = "en";
	$translateProvider.useSanitizeValueStrategy('sanitize');
	
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/locale-',
        suffix: '.json'
    });
    
    $translateProvider.preferredLanguage(lang);
    $translateProvider.fallbackLanguage('en');
    
}]);
 


//Handle http errors
app.factory('authHttpResponseInterceptor',['$q', '$location', '$rootScope', '$window', '$log', function($q, $location, $rootScope, $window, $log){
    return {
        'response': function(response){        	
            return response || $q.when(response);
        },
        'responseError': function(rejection) {        	
        	if (rejection.status === 401 || rejection.status === 302) {        		
        		var parts = rejection.config.url.split("/");
        		if(parts.length > 1 && (parts[0] == "tm1" || parts[0] == "api")){
        			
        			var instance = parts.length > 2 ? parts[2] : parts[1];
        			var type = $rootScope.$state ? $rootScope.$state.current.name : '';
        			var name = $rootScope.$stateParams ? $rootScope.$stateParams.name : '';
        			
        			if(type != "login"){
        				var isInstanceFound = false; 
 			   			var _instance = '';
 			   			
    	    			_.each($rootScope.instances, function(s){				
    						if(s.name.toLowerCase() === instance.toLowerCase()){
    							s.isLoggedIn = false;
    							s.cam = null;
    							s.userName = null;
    							
    							isInstanceFound = true;
    						}			
    					});
    	    			
    	    			// check and get first instance
    	    			if(!isInstanceFound && rejection.config && rejection.config.data){
    	    				if(angular.isArray(rejection.config.data) && rejection.config.data.length > 0){ // Array
    	    					
    	    					// check if we can find the one that caused the 401 (applicable for DBRs only)
    	    					_.forEach(rejection.config.data, function(_dbrRequest){
    	    						if(_.isEmpty(_instance) && _dbrRequest.cube && _dbrRequest.elements && rejection.data && rejection.data[_dbrRequest.id] && rejection.data[_dbrRequest.id].statusCode && (rejection.data[_dbrRequest.id].statusCode == 401 || rejection.data[_dbrRequest.id].statusCode == 302)){
    	    							_instance = _dbrRequest.instance;
    	    						}
    	    					});
    	    					
    	    					if(_.isEmpty(_instance) && rejection.config.data[0].instance){
    	    						_instance = rejection.config.data[0].instance;
    	    					}    	    						
    	    				}
    	    				else{ // Object
    	    					if(rejection.config.data.instance) _instance = rejection.config.data.instance;
    	    				}
							
    	    			}
    	    			else{
    	    				_instance = instance;
    	    			}
            			
    	    			if(appSettings.isPopupLoginMode){
    	    				$rootScope.showApplication = false;
    	    				$rootScope.$broadcast('tm1.event.login', {instance: _instance});
    	    			}
    	    			else{
    	    				$rootScope.$state.transitionTo("login", {instance: _instance});
    	    			}            		
        			}
        			return rejection;
        		}
            }
            
            if (rejection.status === 400 || rejection.status === 404 || rejection.status === 403) {
            	// Allow status to flow through to the controller
            	return rejection;
            }
            
            if (rejection.status === 500) {
            	// $log.warn('TM1 Server Might Be Down. Please Check.');
            	return rejection;
            }
            
            return $q.reject(rejection);
        }
    }
}]);


// keep track of requests
app.factory('countHttpInterceptor',['$rootScope', '$q', function($rootScope, $q){
	
	if(!$rootScope.requestCount){
		$rootScope.requestCount = 0;
	}
	
	return {
		// optional method
	    'request': function(config) {
	    	$rootScope.requestCount++;
	    	return config;
	    },

	    // optional method
	    'requestError': function(rejection) {
	    	$rootScope.requestCount++;
	    	return $q.reject(rejection);
	    },
	    
	    'response': function(response) {
	    	$rootScope.requestCount--;
	    	return response;
    	},

	    // optional method
    	'responseError': function(rejection) {
    		$rootScope.requestCount--;
    		return $q.reject(rejection);
	    }
	};
}]);


//for Pulse Logging
if(appSettings.isToLogAPIs){	
	app.factory('pulseHttpInterceptor',['$rootScope', '$q', function($rootScope, $q){
		return {
			// optional method
		    'request': function(config) {
		    	$rootScope.$broadcast('tm1.pulse.log.request', {url: config.url, method: config.method, data: config.data});	    		    	
		    	return config;
		    },
		    
		    'response': function(response) {	    	
		    	return response;
	    	}	    
		};
	}]);
}

app.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {    
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
    $httpProvider.interceptors.push('countHttpInterceptor');
    
    if(appSettings.isToLogAPIs){
    	$httpProvider.interceptors.push('pulseHttpInterceptor');
    }
    
    $httpProvider.defaults.withCredentials = true;
    $locationProvider.hashPrefix('');
      
}]);
  
app.run(['$rootScope', '$localStorage', '$http', '$filter', '$templateCache', 'amMoment', '$state', '$stateParams', '$tm1UiHelper', 'tm1UiRouter', '$location', '$urlRouter', '$timeout', '$tm1UiSetting', 'tm1UiSettings', '$window', '$log', '$tm1Ui', '$ngBootbox',
         function($rootScope, $localStorage, $http, $filter, $templateCache, amMoment, $state, $stateParams, $tm1UiHelper, tm1UiRouter, $location, $urlRouter, $timeout, $tm1UiSetting, tm1UiSettings, $window, $log, $tm1Ui, $ngBootbox) {
	
	// initialize
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
    
	// to prevent later, any other logic that will trigger a 401 - this will flag whether the whole page can proceed or not
	$rootScope.applicationIsReady = true;
	$rootScope.showApplication = true;
	
	// generic function to redirect user to login page
	$rootScope.resetAndRedirectToLogin = function(){
		$ngBootbox.confirm(appSettings.ssoInactiveMessage).then(
			function() {
				$tm1Ui.applicationResetSessionLoginInstance().then(function(result){				
					$tm1Ui.applicationInstances().then(function(instanceObjects){					
						var targetOrigin = $location.protocol() + '://';
						targetOrigin += $location.host();
						targetOrigin += ':' + $location.port();
						
						$window.location.href = targetOrigin + instanceObjects[0].baseApp;
					});
				});	
			}, 
			function(){
				$rootScope.$broadcast('tm1.event.sso.login.cancelled');
			}
		);
	};
	
	// check first if this is spawned from another window
	var url = $location.absUrl();
	if(url.indexOf('cam_passport') != -1){
		
		// this is to prevent any other logic from firing, if there is a cam_passport			
		$rootScope.applicationIsReady = false;
		
		// login with CAM passport
		var camPassport = $tm1Ui.applicationExtractCamPassportFromUrl(url);
		if(!_.isEmpty(camPassport)){
			var targetOrigin = $location.protocol() + '://';
			targetOrigin += $location.host();
			targetOrigin += ':' + $location.port();
			
			$log.info('Origin: ' + targetOrigin);
			$tm1Ui.applicationGetSessionLoginInstance().then(function(sessionObj){
				
				$log.info('Instance');
				$log.info(sessionObj);				
				if(sessionObj && angular.isString(sessionObj.name)){
					$tm1Ui.applicationInstanceSettings(sessionObj.name).then(function(instanceObj){
						if(instanceObj.useSSOWithRedirect){
							$log.info('UsingRedirect');
							
							// login with the CAM Passport								
							var camNamespaceToUse = undefined;
							if(instanceObj && instanceObj.camNamespaces && instanceObj.camNamespaces.length > 0){
								camNamespaceToUse = instanceObj.camNamespaces[0];
							}
							$tm1Ui.applicationLoginWithCAMPassport(instanceObj.name, camNamespaceToUse, camPassport).then(function(camLoginStatus){
								if(camLoginStatus && camLoginStatus.success){						
									
									var targetUrl = targetOrigin + instanceObj.baseApp;
									if(!_.isEmpty(sessionObj.lastLoginUrl)){
										targetUrl = sessionObj.lastLoginUrl;
									}									
									$log.info('ReloadingUrl: ' + targetUrl);
									
									// refresh user info
									$tm1Ui.applicationUser(instanceObj.name).then(function(userInfo){
										$window.location.href = targetUrl;
									});									
								}
								else{									
									$log.error('Unable to login via CAM on the Session');
									$log.error(camLoginStatus);
									
									// reset session, and then retry again
									$rootScope.resetAndRedirectToLogin();
								}
							});
						}
						else if($window.opener){
							$log.info('ClosingWindowAndReturningWithOrigin: ' + targetOrigin);
							
							$window.opener.postMessage(camPassport, targetOrigin);
						}
					});
				}
				else{
					$log.error('Unable to retrieve instance in Session');
					$log.error(sessionObj);
					
					// reset session, and then retry again
					$rootScope.resetAndRedirectToLogin();	
				}
			});
		}
		else{
			$log.warn('"cam_passport" detected but unable to extract. Check URL.');
		}		
	}
	else if(url.indexOf('code') != -1 && url.indexOf('state') != -1){
		
		// this is to prevent any other logic from firing, if there is a cam_passport
		$rootScope.applicationIsReady = false;
		var oidcUrlInfo = $tm1Ui.applicationExtractOIDCInfoFromUrl(url, appConstants);		
		$tm1Ui.applicationLoginWithOIDCAndAuthorization(oidcUrlInfo.instance, {code: oidcUrlInfo.code, state: oidcUrlInfo.state, appBaseUrl: oidcUrlInfo.appBaseUrl}).then(function(oidcLoginResult){			
			if(oidcLoginResult.success){
				$rootScope.applicationIsReady = true;
				$window.location.href = decodeURIComponent(oidcUrlInfo.lastUrlBeforeAuthorization);
			}
			else{
				if(appSettings.showOIDCErrorDisplay){
					try{
						$rootScope.oidcError = oidcLoginResult.message.message;					
						$rootScope.oidcError = JSON.parse(oidcLoginResult.message.message);
					}
					catch(err){}
				}
				
				$log.error(oidcLoginResult);
			}
		});
	}
	
	if($rootScope.applicationIsReady){
		$tm1UiSetting.applicationName().then(function(data){
			$rootScope.appName = data.name;	
		});
		
		$rootScope.$on('$viewContentLoaded', function(){
			$rootScope.printDate = new Date();
		});
		
		// UI Prefs initialization
		$rootScope.uiPrefs = $localStorage.$default({instances: []});
		
		// UI Prefs: Menu
		if(appSettings){
			if($location.search().print){
				// Used when printing
				$rootScope.isPrinting = true;
				appSettings.showSideBar = false;
			}
			$rootScope.appSettings = appSettings;
			 
			if(appSettings.showSideBar === false){
				$rootScope.uiPrefs.menu = false;
			}
		}
		
		if($rootScope.uiPrefs.menu == null){
			if(appSettings){
				$rootScope.uiPrefs.menu = appSettings.showSideBar;
				$rootScope.uiPrefs.systmenu = appSettings.showSystemMenu;
			}
			else {
				$rootScope.uiPrefs.menu = true;
				$rootScope.uiPrefs.systmenu = true;
			}
		}
		
		// UI Prefs: Pin Settings
		if($rootScope.uiPrefs.isPinned == null){
			$rootScope.uiPrefs.isPinned = false;
		}
		
		$rootScope.isLoading = false;
		
		$rootScope.$watch('requestCount', function(){
			
			if($rootScope.isLoadingTimer){
				// Cancel the timer if it exists
				$timeout.cancel($rootScope.isLoadingTimer);
				$rootScope.isLoadingTimer = null;
			}
			
			if($rootScope.requestCount > 0){
				$rootScope.isLoading = true;
			}
			else {
				if($rootScope.isLoading){
					
					// Use a timer to wait 1s to make sure there aren't subsequent requests
					$rootScope.isLoadingTimer = $timeout(function(){
						if($rootScope.requestCount == 0){
							$rootScope.isLoading = false;
						}
					}, 1000);
				}
			}
		});
		
		$rootScope.useFluidContainer = appSettings.showSideBar;
		$rootScope.useCustomNav = appSettings.useCustomNavigation;
		$rootScope.navisopened = false;
		$rootScope.colorUserLogedIn = "#666";
		$rootScope.mobileview = false;
		$rootScope.mobileviewopenindicator = false;
		$rootScope.mobilenavdecider = false;
		 
		if(!$rootScope.useCustomNav){
			$("#page-wrapper").removeClass("start");
			$("#mininav").removeClass("ministart");		 
		}
		
	 	$rootScope.scrollPositionCaptured = 0;	

		$rootScope.showHideMenu = function (collapsed){
			if(!$rootScope.useCustomNav){
				var pagewidth = window.innerWidth;			
				if(pagewidth < 768){
					$rootScope.mobileview = true;
					
					$(".mobilenavbtn").removeClass("collapsed");
				}
				else{
					$rootScope.mobileview = false;
					$(".mobile-nav").removeClass("mobile-open");
				    $(".mobilenavbtn").addClass("collapsed");
				}
				
				if(collapsed === null){
					if(document.getElementsByClassName("sidebar-nav").length > 0){ 
						collapsed = $(".sidebar-nav").hasClass("in");						
					}
					else{
						if(document.getElementsByClassName("sidebar-v2-nav").length > 0){
							collapsed = $(".sidebar-v2-nav").hasClass("in");						
						}
					}
				}
				
				if(collapsed){	
					
					if(document.getElementsByClassName("sidebar-v2-nav").length > 0){
						if(appSettings.showSideBar){
							$("#page-wrapper").addClass("nav-collapse");
						}
						else{
							$rootScope.initColor();
						}
						
						$(".sidebar-v2-nav").addClass("collapse");
						$(".sidebar-v2-nav").addClass("in");
					}
					else{
						if(appSettings.showSideBar){
							$("#page-wrapper").addClass("nav-collapse");
						}
						 
						$("#tab-wrapper").addClass("navbar-collapse");
						$(".sidebar-nav").addClass("collapse");
						$(".sidebar-nav").addClass("in");
						$(".navbar-toggle ").removeClass("opened");					
					}
					
					if(document.getElementById("left-nav-section-v2")){
						$rootScope.scrollPositionCaptured = document.getElementById("left-nav-section-v2").scrollTop;
					}
					
					$rootScope.uiPrefs.menu = false;
				} 
				else {
					if(document.getElementById("left-nav-section-v2")){
						$('#left-nav-section-v2').animate({ scrollTop: $rootScope.scrollPositionCaptured}, 'slow');
					}	
					
					if(document.getElementsByClassName("sidebar-v2-nav").length > 0){
						$("#tab-wrapper-v2").removeClass("navbar-collapse");
						if(appSettings.showSideBar){
							$("#page-wrapper").removeClass("collapse");
							$("#page-wrapper").removeClass("nav-collapse");
						}
						
						$("#tab-wrapper-v2").removeClass("collapse");
						$(".sidebar-v2-nav").removeClass("in");
					}
					else{					
						$("#tab-wrapper").removeClass("navbar-collapse");
						if(appSettings.showSideBar){
							$("#page-wrapper").removeClass("collapse");
							$("#page-wrapper").removeClass("nav-collapse");
						}
						
						$("#tab-wrapper").removeClass("collapse");
						$(".sidebar-nav").removeClass("in");
						$(".navbar-toggle ").addClass("opened");					
					}
					
					$rootScope.uiPrefs.menu = true;
				}
			}
			else{		
				 
					  
				 if(document.getElementById("custom-nav-section-v2") ){
					
					if(!$rootScope.uiPrefs.menu){
						document.getElementById("custom-nav-section-v2").style.marginRight = "0px";
						$rootScope.uiPrefs.menu = true;					
					}
					else{
						document.getElementById("custom-nav-section-v2").style.marginRight = "-330px";					
						$rootScope.uiPrefs.menu = false;
					}			 
			 	}
			}	

			if(!$rootScope.useFluidContainer){
				if(!$rootScope.mobileview){
					document.getElementById("page-wrapper").style.marginLeft = "60px";	
				}			
			}
			
			if(!$(".sidebar-v2-nav").hasClass("in")){ 
				$rootScope.navisopened = true;
				
				var leftSection = document.getElementById("left-nav-section-v2");
				if(leftSection){
					leftSection.style.width = "300px";
				}
			}
			
			if(!appSettings.showSideBar || appSettings.useCustomNavigation){
				document.getElementById("page-wrapper").style.marginLeft = "0px";
			}		
		};
		
		$rootScope.navbarMobileToggle = function(){			 
			if($rootScope.mobileview){
				$rootScope.mobilenavdecider = !$rootScope.mobilenavdecider;
			}

	        // trigger resize
	        $rootScope.$broadcast(tm1UiSettings.windowResizeID);
	        
	        $timeout(function() {
			    $window.dispatchEvent(new Event("resize"));			
			}, 100);        
		};


		$rootScope.navbarToggle = function(){
			 
			var width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - topOffset;
			
			if(!$rootScope.mobileview){
				$rootScope.showHideMenu($rootScope.uiPrefs.menu);
			
				 // trigger resize
	        	$rootScope.$broadcast(tm1UiSettings.windowResizeID);
			}
		
	       
	        
	        $timeout(function() {
			    $window.dispatchEvent(new Event("resize"));
			}, 100);        
		};
		
		$rootScope.numHover = -1;
		
		$rootScope.initColor = function(){		
			document.getElementById("mininavinternal").style.backgroundColor = window.getComputedStyle(document.getElementsByClassName("navbar-canvas navbar-default navbar-fixed-top")[0], null).getPropertyValue('background-color');
			if(document.getElementById("mininavinternal").getElementsByTagName("li").length > 1){
				for(var i = 0; i < document.getElementById("mininavinternal").getElementsByTagName("li").length; i++){	 				
					$rootScope.tmpheight = window.getComputedStyle( document.getElementById("mininavinternal").getElementsByTagName("li")[i] ,null).getPropertyValue('height');
					document.getElementById("mininavinternal").getElementsByTagName("li")[i].style.backgroundColor =  window.getComputedStyle( document.getElementsByClassName("navbar-canvas navbar-default navbar-fixed-top")[0] ,null).getPropertyValue('background-color');				
				}
				
				if($rootScope.tmpheight == "auto"){
					$rootScope.tmpheight = "51px";
				}
			}
			else{
				$rootScope.tmpheight = "0px";
			}
		};
		
		$rootScope.showTooltip = function(numbover, name){
			
			// Find the scroll value of the mini nav
			if(document.getElementById("left-nav-section-v2")){
				var offsetnavscroll = document.getElementById("left-nav-section-v2").scrollTop;
			}
			
			$rootScope.numHover = parseInt(numbover) + 1;
			if(document.getElementById("mininavinternal").getElementsByTagName("li").length > 1){
				if(document.getElementById("mini-tooltip")){
					document.getElementById("mini-tooltip").style.display = "block";
					document.getElementById("mini-tooltip").style.opacity = 1;			 
					document.getElementById("mini-tooltip").style.marginLeft = "0px";
					document.getElementById("mini-tooltip").style.backgroundColor = window.getComputedStyle( document.getElementsByClassName("navbar-canvas navbar-default navbar-fixed-top")[0], null).getPropertyValue('background-color');
					document.getElementById("mini-tooltip").style.color = window.getComputedStyle( document.body, null).getPropertyValue('color');
					document.getElementById("mini-tooltip").style.top = (parseInt(150)-(offsetnavscroll)) + (parseInt(numbover) * parseInt($rootScope.tmpheight, 10)) + "px";
					document.getElementById("mini-tooltip").innerHTML = "<p style='padding:5px;'>" + name + "</p>";
					document.getElementById("mini-tooltip").style.width = "auto";
					document.getElementById("mini-tooltip").style.borderColor = "transparent";
				}
			}		
		};
		
		$rootScope.hideTooltip = function(num){
			var offsetnavscroll2 = 0;
			if(document.getElementById("left-nav-section-v2")){
				offsetnavscroll2 = document.getElementById("left-nav-section-v2").scrollTop;
			}
			
			document.getElementById("mini-tooltip").style.top = (parseInt(150) - (offsetnavscroll2)) + parseInt(num) * parseInt($rootScope.tmpheight, 10) + "px";
			document.getElementById("mini-tooltip").style.opacity = 0;		 
			document.getElementById("mini-tooltip").style.marginLeft = "-200px";		
		};
		 
		$rootScope.clickedNav = function(numb){
			if(document.getElementById("mininavinternal").getElementsByTagName("li").length > 1){
				for(var ff = 0; ff< document.getElementById("mininavinternal").getElementsByTagName("li").length; ff++){
					var tmp = document.getElementById("mininavinternal").getElementsByTagName("li")[ff];
					document.getElementById("mininavinternal").getElementsByTagName("li")[ff].setAttribute("style","");
					document.getElementById("mininavinternal").getElementsByTagName("li")[ff].getElementsByTagName("i")[0].setAttribute("style", "");
					document.getElementById("mininavinternal").getElementsByTagName("li")[ff].style.backgroundColor = window.getComputedStyle( document.getElementsByClassName("navbar-canvas navbar-default navbar-fixed-top")[0], null).getPropertyValue('background-color');
				}
				if(document.getElementsByClassName("navbar navbar-default navbar-fixed-top").length > 0){
					document.getElementById("mininavinternal").getElementsByTagName("li")[numb + 1].style.backgroundColor =  window.getComputedStyle( document.getElementsByClassName("navbar-canvas navbar-default navbar-fixed-top")[0], null).getPropertyValue('background-color');		 
				}	
			}
		};
		
		$rootScope.resizeSideBar = function(){
			
			var width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
	        var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - topOffset;
	        
			if(!$rootScope.useCustomNav){
				if(width < 768){
					//width of the page is in mobile view
					$rootScope.mobileview = true;				
					
					$("#openednav").css("display", "none");
					
					if(appSettings.showSideBar){
						$("#page-wrapper").removeClass("nav-collapse");
					}
					
					$("#tab-wrapper-v2").removeClass("navbar-collapse");
					$(".sidebar-v2-nav").removeClass("collapse");
					$(".sidebar-v2").css("width", "0px");
					if($rootScope.mobileview){
						document.getElementById("page-wrapper").style.marginLeft = "0px";
						$("#searchcon").removeClass("opened");
						
						
					}
					else{
						$("#searchcon").addClass("opened");
						document.getElementById("page-wrapper").style.marginLeft = "60px";
					}
				
					$(".sidebar-v2").css("height", height);
				}
				else{
					if($rootScope.mobilenavdecider === true){
						$rootScope.navbarMobileToggle();
					}
					
					$rootScope.mobileview = false;				
					$rootScope.navisopened = $rootScope.mobileviewopenindicator; 
					
					$("#openednav").css("display", "block");
					
					if(!$rootScope.appSettings.showSideBar){
						$rootScope.showHideMenu(true);
					}
					else{	
						$rootScope.navisopened = false;			
						$rootScope.showHideMenu(!$rootScope.uiPrefs.menu);
						
						if($(".sidebar-v2-nav").hasClass("in")){
							$rootScope.navisopened = false;
							
							$(".sidebar-v2").css("width", "60px");
							$(".sidebar-v2").css("height", height);
						}
						else{
							$rootScope.navisopened = true;
							document.getElementById("page-wrapper").style.marginLeft = "300px";
							$(".sidebar-v2").css("width", "300px");				
							$(".sidebar-v2").css("height", height);				
						}
					}
					if($(".sidebar-v2-nav").hasClass("in")){
						$rootScope.navisopened = false;						
					}
					else{
						$rootScope.navisopened = true;					 		
					}
				}			
				// navigation if sidebar-nav has class 'in' than the nav is closed else opened			
			}
			else{
				if(!$rootScope.useFluidContainer){
					if(!$rootScope.mobileview){
						document.getElementById("page-wrapper").style.marginLeft = "60px";
					}
				}
				
				if(!appSettings.showSideBar){
					document.getElementById("page-wrapper").style.marginLeft = "0px";
				}
				
				if(appSettings.useCustomNavigation){
					document.getElementById("page-wrapper").style.marginLeft = "0px";
				}
				
				if(document.getElementsByClassName("sidebar-v2-nav").length > 0){
					document.getElementsByClassName("sidebar-v2-nav")[0].style.display = "none";
				}
			}
		};
		
		// setup routes
		tm1UiRouter.setUpRoutes();
		$rootScope.$on('tm1.event.states.loaded', function(event, args){		
			$urlRouter.sync();
			
			$rootScope.$panelToggle = function($event){			
				var id = $($event.target).parent("a").attr("id");
				if($rootScope.uiPrefs[id]){
					$rootScope.uiPrefs[id] = false;
				}
				else {
					$rootScope.uiPrefs[id] = true;
				}			
			};
			
			$rootScope.findClickthrough = function(e){
				if(e === "sample"){
					e = "samples";
				}
				
				return e;
			};
			
			$(".dropdown-menu").on("click", function(e) {
		        e.stopPropagation();
		    });
			
			$(window).bind("load resize", function() {	        
				$rootScope.resizeSideBar();	        
		    });
		});
		
		// initialize loggers
		$tm1UiHelper.initLoggers();
		
		// initialize batcher
		$tm1UiHelper.initBatcher({
			'maxTime': 50,
			'maxRequestCount': 500,			
			'maxRequestElementCount': 3
		});
		
		// set global settings for DBR
		$http.get('api/instances').then(function(success, error){
			if(success.status == 200){
				$rootScope['instanceSettings'] = {};
				angular.forEach(success.data, function(instance){
					$rootScope['instanceSettings'][instance.name] = {};
					angular.forEach(instance, function(value, key){
						if(key != 'name'){
							$rootScope['instanceSettings'][instance.name][key] = value;
						}
					});
				});			
			}
		});
		
		$rootScope.moveNavOut = function(){		
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - topOffset;
			if($rootScope.mobileview){
				
				$(".sidebar-v2").css("width", "0px");
				$(".sidebar-v2").css("height", height);
				document.getElementById("page-wrapper").style.marginLeft = "0px";
				document.getElementById("left-nav-section-v2").style.width = "0px";
				 
			}else{
				if(!$rootScope.uiPrefs.isPinned){
					$rootScope.uiPrefs.menu = false;
					$rootScope.navisopened = false ;
					$(".sidebar-v2").css("width", "60px");
					$(".sidebar-v2").css("height", height);
					
					if(!$rootScope.appSettings.showSideBar){
						$rootScope.showHideMenu(true);			
					}
					else{				
						$rootScope.showHideMenu(!$rootScope.uiPrefs.menu);
					}
					
					if(!$rootScope.useCustomNav){
						$(".sidebar-v2").css("width", "60px");
						$(".sidebar-v2").css("height", height);
						
						document.getElementById("left-nav-section-v2").style.width = "60px";
					}
					else{
						if(document.getElementById("custom-nav-section-v2")){
							document.getElementById("custom-nav-section-v2").style.marginRight = "-330px";
							$rootScope.uiPrefs.menu = false;
						}
					}
				}
			}
		};
		
		// moved
		$rootScope.licenseStatus = {isReady: false};
		$http.get("api/license").then(function(success, error) {		
			$rootScope['license'] = success.data;
			
			$rootScope.licenseStatus.isReady = true;
		});
		
		// versions
		$rootScope['framework'] = {
			angular:{version: angular.version},
			bootstrap:{version: '3.2.0'},
			fontAwesome:{version: '4.5.0'}
		};
		
		// watcher count
		try{
			if(appSettings.showWatchCounter){
				setInterval(function(){
					$log.log('TotalWatcherCount: ' + $tm1UiHelper.getWatchersCount());
				}, 1 * 1000);
			}
		}
		catch(err){}
		
		// accounting.js global format
		// http://openexchangerates.github.io/accounting.js/#methods
		accounting.settings.currency.symbol = '';
		accounting.settings.currency.format = {pos:'%v', neg:'(%v)', zero:'-'};	
	}	
}]);



