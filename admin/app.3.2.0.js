
var topOffset = 50;
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

var app = angular.module('app', 
		['ui.router', 'angularMoment', 'ngSanitize', 'ngFileUpload',
         'ngStorage', 'angularBootstrapNavTree', 'angularUUID2', 'nvd3', 'tm1Ui.provider',
         'ui.bootstrap', 'base64', 'tm1Ui', 'ui.bootstrap.contextMenu', 'textAngular', 'ngBootbox', 
         'hljs', 'ngTable', 'pascalprecht.translate','ui.ace', 'matchMedia', 'ngclipboard', 'ui.grid', 'ui.grid.edit', 'ngFileUpload']);

//Constants
var appConstants = {
	OIDC_STATE_SEPARATOR: '---'
};

app.config(['$stateProvider', '$logProvider', 'tm1UiRouterProvider', 'hljsServiceProvider', function($stateProvider, $logProvider, tm1UiRouterProvider, hljsServiceProvider) {
	
	$logProvider.debugEnabled(false);
	
	// default - required to have at least one
	$stateProvider
		.state('base', {url: '', templateUrl: 'admin/html/admin/home.html'})
		.state('admin', {url: '/', templateUrl: 'admin/html/admin/home.html'})
		.state('admin.login-tm1', {url: 'login-tm1/:instance?type&name', templateUrl: 'admin/html/admin/login-tm1.html'})
		.state('admin.slice', {url: 'slice?instance', templateUrl: 'admin/html/admin/slice.html'})
		.state('admin.active-form', {url: 'active-form?instance', templateUrl: 'admin/html/admin/active-form.html'})
		.state('admin.setting', {url: 'setting', templateUrl: 'admin/html/admin/setting.html'})
		.state('admin.login-admin', {url: 'login-admin', templateUrl: 'admin/html/admin/login-admin.html'})
		.state('admin.menu-management', {url: 'menu-management', templateUrl: 'admin/html/admin/menu-management.html'})
		.state('admin.page-creator', {url: 'page-creator', templateUrl: 'admin/html/admin/page-creator.html'})
		.state('admin.editor', {url: 'editor', templateUrl: 'admin/html/admin/editor.html'})		
		.state('admin.task-scheduler', {url: 'task-scheduler', templateUrl: 'admin/html/admin/task-scheduler.html'})
		.state('admin.task-editor', {url: 'task-editor/{taskId}', templateUrl: 'admin/html/admin/task-editor.html', params:{task: null}})
	;
	
	
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
        			var type = $rootScope.$state.current.name;
        			var name = $rootScope.$stateParams.name;
        			
        			if(type != 'admin.login-tm1'){
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
    	    			
    	    			$rootScope.$broadcast('admin.event.login-tm1', {instance: _instance});
        			}
        			
        			return rejection;
        		}
            }
        	else if (rejection.status === 403) {
        		var parts = rejection.config.url.split("/");
        		if(parts.length > 1 && (parts[0] == "tm1" || parts[0] == "api")){
        			
        			var instance = parts.length > 2 ? parts[2] : parts[1];
        			var type = $rootScope.$state.current.name;
        			var name = $rootScope.$stateParams.name;
        			
        			if(type != 'admin.login-admin'){
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
    	    					if(rejection.config.data[0].instance) _instance = rejection.config.data[0].instance;
    	    				}
    	    				else{ // Object
    	    					if(rejection.config.data.instance) _instance = rejection.config.data.instance;
    	    				}
    	    			}
    	    			else{
    	    				_instance = instance;
    	    			}
            			
            			$rootScope.$state.transitionTo('admin.login-admin', {instance: _instance});
        			}
        			
        			return rejection;
        		}
            }
            
            if (rejection.status === 400 || rejection.status === 404) {
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

app.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
    
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
    $httpProvider.interceptors.push('countHttpInterceptor');
    $httpProvider.defaults.withCredentials = true;    
    $locationProvider.hashPrefix('');
    
}]);

app.run(['$transitions', '$rootScope', '$localStorage', '$http', '$filter', '$templateCache', 'amMoment', '$state', '$stateParams', '$tm1UiHelper', 'tm1UiRouter', '$location', '$urlRouter', '$timeout', '$tm1UiSetting', '$window', '$tm1Ui', '$log', '$ngBootbox',
         function($transitions, $rootScope, $localStorage, $http, $filter, $templateCache, amMoment, $state, $stateParams, $tm1UiHelper, tm1UiRouter, $location, $urlRouter, $timeout, $tm1UiSetting, $window, $tm1Ui, $log, $ngBootbox) {
	
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
		$transitions.onBefore({ to: 'admin.login-tm1' }, function($transition) {
			var previousStateParams = $transition.params();
			if(previousStateParams){
				$rootScope.previousStateParams = _.cloneDeep($transition.params());
			}		
		});
		
		$tm1UiSetting.applicationName().then(function(data){
			$rootScope.appName = data.name;	
		});
		
		$rootScope.uiPrefs = $localStorage.$default({instances: []});
		
		if($rootScope.uiPrefs.menu == undefined){
			$rootScope.uiPrefs.menu = true;
		}
		
		$rootScope.isLoading = false;
		
		// function(s)
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
		
		
		$rootScope.showHideMenu = function (collapsed){
			
			if(collapsed == null){
				collapsed = $(".sidebar-nav").hasClass("in");
			}
			
			if(collapsed){
				$("#page-wrapper").addClass("navbar-collapse");
				$("#tab-wrapper").addClass("navbar-collapse");
				$(".sidebar-nav").addClass("collapse");
				$(".sidebar-nav").addClass("in");
				$rootScope.uiPrefs.menu = false;
			}
			else {
				$("#page-wrapper").removeClass("navbar-collapse");
				$("#tab-wrapper").removeClass("navbar-collapse");
				$("#page-wrapper").removeClass("collapse");
				$("#tab-wrapper").removeClass("collapse");
				$(".sidebar-nav").removeClass("in");
				$rootScope.uiPrefs.menu = true;
			}
			
		};

		$rootScope.navbarToggle = function(){
			
			var width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - topOffset;
			
			
	        if(width >= 768){
				$rootScope.showHideMenu($rootScope.uiPrefs.menu);
				if($(".sidebar-nav").hasClass("in")){
					$(".sidebar").css("height", 0);
		        }
		        else {
		        	$(".sidebar").css("height", height);
		        }
			}
			else {
				$(".sidebar").css("height", "");
				$rootScope.showHideMenu($rootScope.uiPrefs.menu);
			}
			
		};
		
		$rootScope.resizeSideBar = function(){
			
			var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	        var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - topOffset;
	        
	        if (width < 768) {
	            $('div.navbar-collapse').addClass('collapse');
	            $('nav').addClass('navbar-static-top');
	            $('nav').removeClass('navbar-fixed-top');
	            topOffset = 100; // 2-row-menu
	            $(".sidebar").css("height", "");
	            $rootScope.showHideMenu(false);
	        } else {
	            $('nav').addClass('navbar-fixed-top');
	            $('nav').removeClass('navbar-static-top');
	            $rootScope.showHideMenu(!$rootScope.uiPrefs.menu);
	            if($(".sidebar-nav").hasClass("in")){
	            	$(".sidebar").css("height", 0);
	            }
	            else {
	            	$(".sidebar").css("height", height);
	            }
	        }     
			
		}
		
		$rootScope.$panelToggle = function($event){
			
			var id = $($event.target).parent("a").attr("id");
			if($rootScope.uiPrefs[id]){
				$rootScope.uiPrefs[id] = false;
			}
			else {
				$rootScope.uiPrefs[id] = true;
			}
			
		};
		
		$(".dropdown-menu").on("click", function(e) {
	        e.stopPropagation();
	    });
		
		$(window).bind("load resize", function() {        
			$rootScope.resizeSideBar();   
			
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	        height = height - 150;
			
			$(".ace_editor").each(function(index, element){
	        	var top =  $(this).position().top;
	        	var editorHeight = height - top;
	        	if(editorHeight < 0){
	        		editorHeight = 0;
	        	}
	        	$(this).css("height", editorHeight);
	        });
	        
	    });
		
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
		
		// moved
		$http.get("api/license").then(function(success, error) {		
			$rootScope['license'] = success.data;
		});
	}	
}]);

/*
 * This filter helps to capitalize the first character of a text
 * */
app.filter('formatCapitalize', function() {
	return function(value) {
		return _.capitalize(value);
	};
});

