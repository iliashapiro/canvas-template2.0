// (function(){})();

// tm1 ui module
(function(){
	var app = angular.module('tm1Ui', ['ngDialog', 'acute.select', 'xeditable', 'nvd3']);	
	
	app.value('tm1UiSettings', {		
		debug: false,
		
		frameworkLogID: 'tm1.event.log',
		
		batcherRequestID: 'tm1.core.data.request',
		batcherResponseID: 'tm1.core.data.response',
		
		batcherElementRequestID: 'tm1.core.element.request',
		batcherElementResponseID: 'tm1.core.element.response',
		
		batchingElementRequestEnabled: false,
		batchingDbrRequestEnabled: true,
		
		windowResizeID: 'app.window.resize',
		
		storeReadyID: 'tm1.store.ready',
		storeUpdateSuccessID: 'tm1.store.update.success',
				
		t: 'X-CSRF-Token',
		tv: 'Fetch',
		tu: 'api/sec',
		tum: 'GET',
		
		version: '3.2.0',
		site: 'https://code.cubewise.com/canvas-help/',
		support: 'canvas@cubewise.com'
	});
	
	app.config(['$logProvider', '$sceProvider', function($logProvider, $sceProvider){
	    $logProvider.debugEnabled(true);
	    $sceProvider.enabled(false);
	}]);
	
	app.run(['AcuteSelectService', 'editableOptions', function(acuteSelectService, editableOptions) {
		acuteSelectService.updateSetting("templatePath", "assets/html");
		editableOptions.theme = 'bs3';
	}]);
	
	//Handle http errors
	app.factory('authHttpResponseInterceptor',['$q', '$location', '$rootScope', '$window', '$log', function($q, $location, $rootScope, $window, $log){
	    return {
	        'response': function(response){        	
	            return response || $q.when(response);
	        },
	        'responseError': function(rejection) {        	
	        	if (rejection.status === 401) {        		
	        		var parts = rejection.config.url.split("/");
	        		if(parts.length > 1 && (parts[0] == "tm1" || parts[0] == "api")){
	        			
	        			var instance = parts.length > 2 ? parts[2] : parts[1];
	        			var type = $rootScope.$state.current.name;
	        			var name = $rootScope.$stateParams.name;
	        			
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
	    	    					if(rejection.config.data[0].instance) _instance = rejection.config.data[0].instance;
	    	    				}
	    	    				else{ // Object
	    	    					if(rejection.config.data.instance) _instance = rejection.config.data.instance;
	    	    				}
	    	    			}
	    	    			else{
	    	    				_instance = instance;
	    	    			}
	            			
	            			$rootScope.$state.transitionTo("login", {instance: _instance});
	        			}
	        			
	        			return rejection;
	        		}
	            }
	            
	            if (rejection.status === 400 || rejection.status === 404 ) {
	            	// Allow status to flow through to the controller
	            	return rejection;
	            }
	            
	            if (rejection.status === 500) {
	            	$log.warn('TM1 Server Might Be Down. Please Check.');
	            	return rejection;
	            }
	            
	            return $q.reject(rejection);
	        }
	    };
	}]);
	
})();

