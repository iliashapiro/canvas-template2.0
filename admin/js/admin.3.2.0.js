
app.controller('AdminActiveFormCtrl', ['$scope', '$rootScope', '$tm1Ui', '$http', '$timeout', '$location', '$stateParams',
                                  function($scope, $rootScope, $tm1Ui, $http, $timeout, $location, $stateParams) {
	
	// variable(s)
	$scope.options = {};
	$scope.page = {instance:'', cube:'', view:'', rowOptimalElementSize: 100};
	
	$scope.options.views = [];
	
	// function(s)
	$scope.updateCubes = function(){
		if(!_.isEmpty($scope.page.instance)){
			$tm1Ui.cubes($scope.page.instance).then(function(value){
				$stateParams.instance = $scope.page.instance;				
				$location.search('instance', $scope.page.instance);
				
				$scope.options.cubes = value;
			});
		}		
	};
	
	$scope.updateViews = function(){
		$tm1Ui.cubeViews($scope.page.instance, $scope.page.cube).then(function(views){			
			$scope.options.views.length = 0;
			_.forEach(views, function(viewObj){ // this creator only works with native views
				if(viewObj['@odata.type'].toLowerCase().indexOf('nativeview') != -1){
					$scope.options.views.push(viewObj);
				}
			});
		});
	};
	
	$scope.getView = function(){
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			$scope.view = value;
		});
	};
	
	$scope.create = function(){
		
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			
			// Update the view in case it has changed.
			$scope.view = value;
			
			var stateConfig = {states:{}};
			stateConfig.states[$scope.page.menuState] = {};
			stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
			stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
			
			var menuItemConfig = {
					label:$scope.page.pageName,
					icon_class:$scope.page.menuIconClass,
					data:{
						page:$scope.page.menuState
					}
			};
			
			var data = {
				pageName: $scope.page.pageName,
				view: $scope.view,
				
				state: stateConfig,
				menuItem: menuItemConfig,
				
				useDBRRows: $scope.page.useDBROnRow,
				usePaging: $scope.page.usePaging,
				
				pageType: 'active-form',
				instance: $scope.page.instance
			};
			
			$scope.isDone = false;
			
			$http.post('api/admin/pages/create', data).then(function(value){
				
				$scope.isDone = true;
				$scope.page.cube = '';
				$scope.page.view = '';
				$scope.page.pageName = '';
				
				$timeout(function(){
					$scope.isDone = false;
				}, 3000);
				
			});
			
		});
		
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
		}
		catch(err){}
	};
	
	// on a successful login
	$scope.$on('login.success', function(event, args){
		if(args && args.name){
			$scope.updateCubes();
		}
	});
	
	// on page load	
	$scope.page.instance = '';
	$tm1Ui.applicationInstances().then(function(value){		
		$scope.options.instances = _.cloneDeep(value);
		
		var fromLogin = false; 
		var urlInstance = '';
		if($rootScope.previousStateParams && $rootScope.previousStateParams.instance){
			urlInstance = $rootScope.previousStateParams.instance;
		}
		
		if(urlInstance){
			$scope.page.instance = urlInstance;
			$scope.updateCubes();
		}
		else{
			$scope.options.instances.unshift({name:''});
		}
	});
}]);
app.controller('EditorCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$tm1UiSetting', '$translate', '$window', '$tm1UiApp', '$log', '$http',
                             function($scope, $rootScope, $timeout, $state, $tm1UiSetting, $translate, $window, $tm1UiApp, $log, $http) {
	
	$scope.page = {};
	
	$scope.aceLoaded = function(_editor){
		
		setTimeout(function(){
			// Resize
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var top =  $(_editor.container).position().top;
      	  	var editorHeight = height - (top + 150);
	      	if(editorHeight < 0){
	      	  editorHeight = 0;
	      	}
	      	$(_editor.container).css("height", editorHeight);
		}, 500);
		
		$scope.$editor = _editor;
		$scope.$editor.$blockScrolling = Infinity;
		
		// Include auto complete
		ace.require("ace/ext/language_tools");
		$scope.$editor.setOptions({
		    enableBasicAutocompletion: true,
		    tabSize: 2
		});
		
		// set the content from the ace control
		$scope.updatedFileContents = function(){
			if($scope.page.file){				
				$scope.page.file.content = $scope.$editor.getValue();
				return true;
			}			
			return false;
		};
		
		$scope.$editor.on("blur", function(){
			$scope.updatedFileContents();		
		});
	    
		// bind keyboard shortcut for saving
		$scope.$editor.commands.addCommand({
		    name: 'save',
		    bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
		    exec: function(editor) {
		    	if($scope.updatedFileContents()){
		    		$scope.save();
		    	}		    	    	
		    }
		});
	};
	
	$scope.selected = function(){		
		$http.get("api/admin/editor?name=" + encodeURIComponent($scope.page.fileName)).then(function(success){
			var mode = $scope.page.fileName.split('.').pop();
			if(mode == "js") {
				mode = "javascript";
			}
			$scope.$editor.getSession().setMode("ace/mode/" + mode);
			$scope.page.file = success.data;
			$scope.$editor.setValue($scope.page.file.content, -1);
			
			// save for preference
			$rootScope.uiPrefs.editorPageSelected = $scope.page.fileName;
		});
	};
	
	$scope.save = function(){
		$scope.saved = false;
		$scope.saving = true;
		$http.post("api/admin/editor", $scope.page.file).then(function(success){
			
			$scope.saving = false;
			if(success.status == 200){
				$scope.saved = true;
			}
			else {
				$scope.message = success.data.message;
			}
			
			$timeout(function(){
				$scope.saved = false;
			}, 5000);
			
		});
	};
	
	$tm1UiSetting.get().then(function(settings){
		$scope.appSettings = settings;
		$scope.setTheme();
	});
	
	$scope.setTheme = function(){
		$timeout(function(){
			if($scope.$editor){
				$scope.$editor.setTheme("ace/theme/" + $scope.appSettings.editorTheme);
			}
			else {
				$scope.setTheme();
			}
		}, 200);
	};
	
	$http.get("api/admin/editor/list").then(function(success){
		$scope.page.files = success.data;
		
		// reload last selected item
		if($rootScope.uiPrefs.editorPageSelected){
			$scope.page.fileName = $rootScope.uiPrefs.editorPageSelected;
			$scope.selected();
		}
	});
	
}]);
app.controller('AdminHomeCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$translate', '$window', '$tm1Ui', '$log', '$ngBootbox', '$compile',
                             function($scope, $rootScope, $timeout, $state, $translate, $window, $tm1Ui, $log, $ngBootbox, $compile) {
	// variable(s)
	$scope.$state = $state;
	$scope.STATE_LOGIN_ADMIN = 'admin.login-admin';
	$scope.STATE_SETTING = 'admin.setting';
	$scope.STATE_ADMIN = 'admin';
	$scope.STATE_BASE = 'base';
	
	$scope.page = {
			currentUser: ''
	};
	
	// function(s)
	$scope.getCurrentState = function(){
		return $state.current.name;
	};
	
	$scope.logoutAdminConsole = function(){
		$tm1Ui.applicationAdminLogout().then(function(data){
			$state.go($scope.STATE_LOGIN_ADMIN);
		});
	};
	
	$scope.redirect = function(newValue, oldValue, scope){
		if(newValue == $scope.STATE_ADMIN || newValue == $scope.STATE_BASE){
			$state.go($scope.STATE_SETTING);
		}
		else if(newValue != $scope.STATE_LOGIN_ADMIN){ // ensure that the user is logged in
			$tm1Ui.applicationInfo().then(function(data){
				if(angular.isUndefined(data.currentAdminUsername)){
					$state.go($scope.STATE_LOGIN_ADMIN);
				}
			});
		}
	};
	
	// watcher(s)
	$scope.$watch($scope.getCurrentState, $scope.redirect);
	
	// on Page Load
	// Update User info
	$tm1Ui.applicationInfo().then(function(data){
		if(data.currentAdminUsername){
			$scope.page.currentUser = data.currentAdminUsername;
		}
	});
	
	$scope.$on('admin.login.success', function(event, args){
		$tm1Ui.applicationInfo().then(function(data){
			$scope.page.currentUser = data.currentAdminUsername;
		});
	});	
	
	$scope.$on('admin.event.login-tm1', function(event, args){		
		if(!$scope.showingLogin){
			$scope.showingLogin = true;
			
			if($scope.loginSuccess == undefined){
				$scope.loginSuccess = function(instance){
					$scope.showingLogin = false;
					$ngBootbox.hideAll();
					$scope.loginScope.$destroy();
				};
			}
			
			var loginElement = $compile('<div style="margin-top: 5%;"><tm1-ui-login tm1-after-login="loginSuccess(instance)" tm1-default-instance="' + args.instance + '"></tm1-ui-login></div>');
			$scope.loginScope = $scope.$new();
	    	
	    	$scope.loginOptions = {
		        message: loginElement($scope.loginScope),
		        buttons: {},
		        onEscape: function() { 
		        	$scope.loginSuccess('');
		        },
		        className: 'tm1-login-modal'
		    };
		
			$ngBootbox.customDialog($scope.loginOptions);	
			
			// https://getbootstrap.com/docs/3.3/javascript/#modals
			// fix on autofocus not working on popup mode			
			$('.tm1-login-modal').on('shown.bs.modal', function() {
				$(this).find('#tm1-login-user').focus();
			});
		}		
	});
}]);

app.controller('AdminLoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$localStorage', '$tm1Ui', '$window', '$translate',
                             function($scope, $rootScope, $state, $stateParams, $timeout, $localStorage, $tm1Ui, $window, $translate) {
	$scope.isAuthorized = false;
	$scope.errorMessage = '';
	$scope.loginEnabled = true;
	$scope.loginButtonText = 'LOGIN';
	
	$scope.credentials = {
			userName: '',
			password: ''
	};
	
	// page events
	$scope.onUpdate = function(){
		$scope.errorMessage = '';
	};
	
	$scope.login = function(){		
		$tm1Ui.applicationAdminLogin($scope.credentials.userName, $scope.credentials.password).then(function(data){
			if(data.success){
				$scope.isAuthorized = true;				
				$scope.$emit('admin.login.success');				
				$window.history.back(-1);
			}
			else{				
				$scope.errorMessage = '';
				if(data.message && data.message.message){
					$scope.errorMessage = data.message.message;
				}
				else{
					$translate('UNAUTHORISED').then(function(translation){
						$scope.errorMessage = translation;
					});
				}
				
				$timeout(function(){			
					$scope.isLoggingIn = false;
				}, 2 * 1000);	
			}
		});				
	};
}]);
app.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$http', '$localStorage', '$base64', function($scope, $rootScope, $state, $stateParams, $timeout, $http, $localStorage, $base64) {
		
}]);
app.controller('MainCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http', '$translate',
                            function($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http, $translate) {
	
	// Contains the menu control
	$scope.menu = {};
	// contains the menu items
	$scope.menuData = [];	
	
	// Store search box stuff
	var searchLast = 0;
	$scope.menuSearch = {};
	$scope.menuSearchData = [];
	$scope.parameters = { search: "" };
	
	// this controller reference
	var _controller = this;
	
	// 1. Menu Definition with Translation
	$translate(['SETTINGS', 'MENUADMINROOT', 'PAGECREATOR', 'MENUMANAGEMENT','EDITOR', 'MENUREPORTSMANAGER', 'MENUTASKMANAGER']).then(function (translation) {
		var _menus = {
				label:translation.MENUADMINROOT,
				data:{page: 'admin'},
				expanded: true,
				children:[]
		};	
		$scope.menuData.push(_menus);
		
		var _settingsMenu = {
				label:translation.SETTINGS,
				icon_class:'fa-paint-brush',
				data:{page: 'admin.setting'}
		};	
		_menus.children.push(_settingsMenu);
		
		var _sliceMenu = {
				label:translation.PAGECREATOR,
				icon_class:'fa-edit',
				data:{page: 'admin.page-creator'}
		};	
		_menus.children.push(_sliceMenu);
		
		var _editorMenu = {
				label:translation.EDITOR,
				icon_class:'fa-code',
				data:{page: 'admin.editor'}
		};	
		_menus.children.push(_editorMenu);
		
		var _menuManagementMenu = {
				label:translation.MENUMANAGEMENT,
				icon_class:'fa-bars',
				data:{page: 'admin.menu-management'}
		};	
		_menus.children.push(_menuManagementMenu);
		
		var _taskManager = {
				label:translation.MENUTASKMANAGER,
				icon_class:'fa-list-alt',
				data:{page: 'admin.task-scheduler'}
		};	
		_menus.children.push(_taskManager);
		
		// 2. Create Menu Cache
		// Add the menu to a cache to be used for searching
		$scope.menuCache = _.cloneDeep($scope.menuData);
		
	});
	
	// Get the details of the instances from the java servlet
	$http.get("api/instances")
		.then(function(success, error) {
			
			$rootScope.instances = success.data;

		});
	
	var searchTimeout = false;
	
	$scope.search = function(){
		
		if(_.isEmpty($scope.parameters.search)){
			// Reset the menu
			$scope.menuSearchData = [];
			$scope.selectBranch($state.current.name, $stateParams);
		}
		else {
			
			var now = new Date();
			if(now.getTime() - searchLast < 500){
				// Search again later if it has been less than 500 ms and one hasn't already been scheduled
				if(searchTimeout == false){
					searchTimeout = true;
					$timeout(function(){
						searchTimeout = false;
						$scope.search();
					}, 500);
				}
				return;
			}
			
			var searchTerm = $scope.parameters.search.toLowerCase();
			
			// Search for items
			$scope.menuSearchData = [];
			searchBranch($scope.menuCache, searchTerm, $scope.menuSearchData);
		
			now = new Date();
			searchLast = now.getTime();
		}
		
	}
	
	var searchBranch = function(children, searchTerm, result){
		// Search recursively for leaf elements containing the search term
		if(children){
			for(var i = 0; i< children.length; i++){
				var branch = children[i];		
				if(branch.label.toLowerCase().indexOf(searchTerm) > -1){
					// Add the item to the search result
					result.push(branch);
				}
				searchBranch(branch.children, searchTerm, result);
			}
		}
	};
	
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){			
		// save last known state
		$rootScope.priorState = {
				state: fromState,
				param: fromParams
		};
		
		// This is used to select the item in the menu when navigating to a page
		
		// Get the parameters
		$scope.page = toState.name;
		$scope.parameters = toParams;
		
		// Select the branch in the menu
		$scope.selectBranch($scope.page, $scope.parameters);
	});
		
	$scope.menuSelect = function(branch){
		// Menu item clicked event handler
		// Navigate to the page
		
		if(!branch){			
			return;
		}
		
		if(branch.data && branch.data.page){			
			$rootScope.$broadcast('menu.branch.select', branch);	
			$state.transitionTo(branch.data.page, branch.data.parameters);
		}		
	};
	
	$scope.menuGenerateUrl = function(branch){
		
		if(!branch){			
			return "";
		}
		
		try {
			var url = $state.href(branch.data.page, branch.data.parameters);
			return url;
		}
		catch (e) {
			return "";
		}
	};
	
	$scope.selectBranch = function(page, parameters){
		
		// Used to select the menu item when a user navigates via the address bar
		
		var branch = null;
		
		if(page == "home" || page == "admin.login" || page == "notfound"){	
			$scope.menu.deselect_branch();
			return;
		}
		else if(!page){
			$scope.menu.deselect_branch();
			return;
		}
		
		var branch = findBranch($scope.menuData, page, parameters);
		if(branch){			
			$scope.menu.select_branch(branch);
		}
		
	};
	
	var findBranch = function(children, page, parameters){
		// Recursively look for the menu
		if(children){
			for(var i = 0; i< children.length; i++){
				var branch = children[i];
				if(branch.data && branch.data.page && branch.data.page == page && _.eq(branch.data.parameters, parameters)){
					return branch;
				}
				var result = findBranch(branch.children, page, parameters);
				if(result){
					branch.expanded = true;
					return result;
				}
			}
		}
		return null;
	};
	
}]);

app.controller('AdminMenuManagementCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$translate', '$window', '$tm1Ui', '$ngBootbox', '$log',
                             function($scope, $rootScope, $timeout, $state, $translate, $window, $tm1Ui, $ngBootbox, $log) {
	// variable(s)	
	$scope.userMenus = [];
	$scope.userMenusFlat = [];
	$scope.userStates = {};
	
	$scope.menuSelected = {};
	$scope.isSaveNeeded = false;
	
	$scope.menuErrorMessage = '';
	$scope.errors = [];
	
	// function(s)
	$scope.randomKey = function(){
		return _.random(1, true);
	};
	
	$scope.displayErrorMessage = function(message){
		$scope.menuErrorMessage = message;		
		$timeout(function(){
			$scope.menuErrorMessage = '';
		}, 3 * 1000);
	};
	
	$scope.validateUserMenus = function(){
		var errorIndex = _.findIndex($scope.errors, function(o) { return o.isInvalidUrl; });
		if(errorIndex != -1){
			$scope.displayErrorMessage('Invalid Page Urls found. Please rectify before saving.');
			
			return false;
		}
		
		return true;
	};
	
	$scope.saveUserMenu = function(){
		if($scope.validateUserMenus()){
			$tm1Ui.applicationSaveUserMenus($scope.userMenus).then(function(data){
				if(data.success){
					
					// now save states
					$tm1Ui.applicationSaveUserStates($scope.userStates).then(function(data){
						if(data.success){
							$scope.reloadMenu();
						}
						else{
							$scope.displayErrorMessage('Unable to save states. Please check logs.');
						}
					});					
				}
				else{
					$scope.displayErrorMessage('Unable to save menu. Please check logs.');
				}			
			});	
		}
	};
	
	$scope.onMenuUpdate = function(menuSelected){
		$scope.menuSelected.isUpdated = true;
		$scope.isSaveNeeded = true;
	};
	
	$scope.onMenuTemplateUrlUpdate = function(menuSelected){
		$scope.onMenuUpdate(menuSelected);
		
		// check if HTML page exist
		$tm1UiHelper.doesPageExists($scope.userStates[menuSelected.data.page].templateUrl).then(function(data){
			var errorIndex = _.findIndex($scope.errors, function(o) { return o.state == menuSelected.data.page; });
			if(errorIndex == -1){
				$scope.errors.push({state:menuSelected.data.page, isInvalidUrl:false});
				errorIndex = $scope.errors.length - 1;
			}
			
			$scope.errors[errorIndex].isInvalidUrl = false;
			$scope.menuSelected.isInvalidUrl = false;
			if(!data.status){
				$scope.errors[errorIndex].isInvalidUrl = true;
				$scope.menuSelected.isInvalidUrl = true;
				$scope.displayErrorMessage('Cannot find "' + $scope.userStates[menuSelected.data.page].templateUrl + '", please check.');
			}
		});
	};
	
	$scope.findMenuByKey = function(menuKey){
		$scope.menuReference = undefined;
		var findMenuReference = function(_userMenus, _key){
			_.forEach(_userMenus, function(_userMenu){
				if(angular.isUndefined($scope.menuReference)){
					if(_userMenu.key == _key){
						$scope.menuReference = _userMenu;				
					}
					else if(_userMenu.children && _userMenu.children.length > 0){
						findMenuReference(_userMenu.children, _key);
					}
				}
			});
		};
		
		findMenuReference($scope.userMenus, menuKey);
		
		return $scope.menuReference;
	};
	
	$scope.updateAddModal = function(menuSelected){
		if(!menuSelected.targetPage){
			menuSelected.targetPage = $scope.userMenusFlat[0];
		}		
	};
	
	$scope.updateFlattenedUserMenus = function(menuSelected){
		$scope.userMenusFlat.length = 0; 
		var flatFunction = function(flatArray, __userMenus){
			_.forEach(__userMenus, function(_userMenu){
				flatArray.push(_userMenu);
				 
				if(_userMenu.children && _userMenu.children.length > 0){
					flatFunction(flatArray, _userMenu.children); 
				}
			});
		};
		
		if(menuSelected.level && menuSelected.level > 1){
			$scope.userMenusFlat.push({key:$scope.randomKey(), label:'ROOT', levelDesc:'ROOT'});
		}
		
		flatFunction($scope.userMenusFlat, $scope.userMenus);		
	};
	
	$scope.deleteMenu = function(menuSelected){		
		$scope.deleteMenuWithOptions(menuSelected, {showPrompt:true});	
	};
	
	$scope.deleteMenuWithOptions = function(menuSelected, options){
		var deleteMenu = function(_key, _userMenus){
			_.remove(_userMenus, function(n) {return n.key == _key;});
			
			_.forEach(_userMenus, function(_userMenu){
				if(_userMenu.children && _userMenu.children.length > 0){
					deleteMenu(_key, _userMenu.children);
				}
			});			
		};
		
		if(options && options.showPrompt){
			$ngBootbox.confirm('Are you sure you wanted to delete menu entry <strong>' + menuSelected.label + '</strong>?').then(
					function() {						
						deleteMenu(menuSelected.key, $scope.userMenus);
						$scope.onMenuUpdate();
					}, 
					function() {
						$log.log(menuSelected);
						$log.log('is not deleted');
					}
				);	
		}
		else{
			deleteMenu(menuSelected.key, $scope.userMenus);
			$scope.onMenuUpdate();
		}
	};
	
	$scope.moveMenu = function(menuSelected){		
		if(menuSelected.targetPage){
			var menuCopy = _.cloneDeep(menuSelected);
			menuCopy.key = $scope.randomKey();
			
			// find target menu
			var menuReference = $scope.findMenuByKey(menuSelected.targetPage.key);
			if(menuSelected.targetPage.label == 'ROOT'){ // if moving or copying to the main 			
				if(menuSelected.copyOnly){
					if(!(menuSelected.includeChildren && menuSelected.includeChildren)){
						menuCopy.children = undefined;
					}					
				}
				else{
					// delete menu
					$scope.deleteMenuWithOptions(menuSelected, null);
				}
				
				$scope.userMenus.push(menuCopy);
			}
			else{
				if(angular.isUndefined(menuReference.children)){
					menuReference.children = [];
				}
				
				menuReference.isUpdated = true;
				if(menuSelected.copyOnly){
					if(!(menuSelected.includeChildren && menuSelected.includeChildren)){
						menuCopy.children = undefined;
					}
					menuReference.children.push(menuCopy);				
					menuReference.expanded = true;
				}
				else{ // move everything
					menuReference.children.push(menuCopy);				
					menuReference.expanded = true;
					
					// delete menu
					$scope.deleteMenuWithOptions(menuSelected, null);
				}
			}			
		}
		
		$scope.onMenuUpdate();
	};
	
	$scope.addPage = function(){
		$state.go('admin.page-creator');
	};
	
	$scope.reloadMenu = function(){
		$scope.userMenus.length = 0;
		$scope.userStates = {};
		
		$scope.isSaveNeeded = false;
		$scope.menuSelected = undefined;
		
		// user menus and states
		$tm1Ui.applicationUserMenus().then(function(data){
			$scope.userMenus = data;			
		});
		
		$tm1Ui.applicationUserStates().then(function(data){
			$scope.userStates = data;
		});
	};
	
	$scope.selectMenu = function(menu){
		$scope.menuSelected = menu;
		
		$scope.menuSelected.isSystemPage = false;
		if($scope.userStates[$scope.menuSelected.data.page].isSystem){
			$scope.menuSelected.isSystemPage = true;
		};
	};
	
	// On Page Load
	$scope.reloadMenu();
}]);

app.controller('AdminPageCreatorCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$http', '$translate', '$window', '$tm1Ui', '$log',
                             function($scope, $rootScope, $timeout, $state, $http, $translate, $window, $tm1Ui, $log) {
	// variable(s)
	$scope.page = {};
	
	$scope.page.success = false;
	$scope.page.message = '';		
	$scope.page.type = '';
	
	$scope.button = {
			isEnabled: true,
			text: 'CREATE'
	};
	
	// function(s)
	$scope.isPageTypeSupported = function(pageType){
		if(pageType == 'blank' || pageType == 'dashboard'){
			return true;
		}
		
		return false;
	};
	
	$scope.resetPageProperty = function(){
		$scope.page.pageName = '';
		$scope.page.menuState = '';
		$scope.page.menuName = '';
		$scope.page.menuPageLocation = '';	
		$scope.page.menuIconClass = undefined;
	};
	
	$scope.resetButton = function(){
		$translate('CREATE').then(function (translation) {
			$scope.button.text = translation;
		});
	};
	
	$scope.resetErrorMessage = function(){
		$scope.page.message = '';
	};
	
	$scope.displayPageCreationStatus = function(successStatus, translateId){
		$scope.page.success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope.page.message = translation;
			
			// reset if successful
			if($scope.page.success){
				$timeout(function(){
					$scope.page.type = '';
					$scope.button.isEnabled = true;
					
					$scope.resetErrorMessage();
					$scope.resetPageProperty();					
				}, 3 * 1000);
			}
			else{
				$scope.button.isEnabled = true;
			}
			
			$scope.resetButton();
		});
	};
	
	$scope.createPage = function(pageType){
		
		// check if state already exists, prevent user from using this
		$tm1Ui.applicationStates().then(function(data){
			if(angular.isUndefined(data[$scope.page.menuState])){
				// button
				$scope.button.isEnabled = false;
				$translate('MESSAGEWAIT').then(function (translation) {
					$scope.button.text = translation;
				});
				
				// state
				var stateConfig = {states:{}};
				stateConfig.states[$scope.page.menuState] = {};
				stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
				stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
				
				// menu
				var menuItemConfig = {
						label:$scope.page.menuName,
						icon_class:$scope.page.menuIconClass,
						data:{
							page:$scope.page.menuState
						}
				};
				
				var data = {
						pageName: $scope.page.pageName,
						state: stateConfig,
						menuItem: menuItemConfig,
						pageType: pageType
				};
				
				$http.post('api/admin/pages/create', data).then(function(success, error){
					if($tm1Ui.helperIsSuccessful(success)){
						$scope.displayPageCreationStatus(true, 'PAGECREATED');
					}
					else{
						$scope.displayPageCreationStatus(false, 'PAGECREATEERROR');
					}
				});	
			}
			else{
				$scope.displayPageCreationStatus(false, 'PAGECREATESTATEEXISTERROR');
			}
		});
		
			
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
			
			$scope.resetErrorMessage();
		}
		catch(err){}
	};
	
	// On Page Load
	$scope.resetButton();
}]);

app.controller('AdminSettingCtrl', ['$scope', '$rootScope', '$tm1UiSetting', '$http', '$timeout', '$log', '$uibModal', '$base64', '$tm1Ui', '$translate',
                                    function($scope, $rootScope, $tm1UiSetting, $http, $timeout, $log, $uibModal, $base64, $tm1Ui, $translate) {
	
	// variables
	$scope.appSettings = {};
	$scope.admin = {
			password:{
				current:'',
				confirm1:'',
				confirm2:''
			}
	};
	
	$scope.currentConsoleUser = '';
	
	// for emails
	$scope.openEmailTest = function(){
		$scope.emailModal = $uibModal.open({
				animation : true,
				templateUrl: 'send-test-email.html',
				size: 'md',
				controller:['$scope', function($scope){
					$scope.sendingEmail = false;
					$scope.sendEmailError = '';
					$scope.showError = false;
					
					$scope.emailCancel = function(){
						$scope.$close();
					};
					
					$scope.emailSend = function(){
						$scope.sendingEmail = true;
						
						$tm1Ui.emailSend({
							toList: $scope.values.testEmail.to, 
							subject: $scope.values.testEmail.subject, 
							body: $scope.values.testEmail.body
						}).then(function(status){
							$scope.sendingEmail = false;
							
							if(!status.success){
								if(status.message && status.message.error && status.message.error.message){
									$scope.sendEmailError = status.message.error.message;									
								}														
							}
						});
					};
				}]
		});
		
		// prevent the error when clicking on backdrop
		$scope.emailModal.result.then(function(){}, function(result){})
	};
	
	
	$scope.savePassword = {
			message: '',
			success: false
	};
	
	// PASSWORD
	$scope.displayUpdatePasswordStatus = function(successStatus, translateId){
		$scope.savePassword.success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope.savePassword.message = translation;			
			$timeout(function(){
				$scope.savePassword.message = '';
			}, 3 * 1000);
		});
	};
	
	// update password
	$scope.updateAdminPassword = function(){
		if($scope.admin.password.confirm1 != $scope.admin.password.confirm2){
			$scope.displayUpdatePasswordStatus(false, 'PASSWORDNOTMATCHING');
		}
		else{
			var userUpdate = {user:{}};
			userUpdate.username = $scope.currentConsoleUser;
			userUpdate.encryptedPassword = $base64.encode($scope.admin.password.current);
			userUpdate.encryptedNewPassword = $base64.encode($scope.admin.password.confirm1);
			
			$http.post('api/admin/users/update', userUpdate).then(function(success, error){
				if($tm1Ui.helperIsSuccessful(success)){
					$scope.admin.password.current = '';
					$scope.admin.password.confirm1 = '';
					$scope.admin.password.confirm2 = '';
					
					$scope.displayUpdatePasswordStatus(true, 'PASSWORDUPDATESUCCESS');
				}
				else{
					$scope.admin.password.confirm2 = '';
					if(success.data.error && success.data.error.message){
						$scope.displayUpdatePasswordStatus(false, success.data.error.message);						
					}
					else{
						$scope.displayUpdatePasswordStatus(false, 'PASSWORDUPDATEERROR');
					}
					
					$log.error(success);
				}
			});
		}		
	};
	
	$scope.onPasswordUpdate = function(){
		$scope.savePassword.message = '';
	};
	
	// MENU
	$scope.displaySaveSettingsStatus = function(sectionID, successStatus, translateId){
		$scope[sectionID] = $scope[sectionID] == undefined ? {} : $scope[sectionID];		
		$scope[sectionID].success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope[sectionID].message = translation;			
			$timeout(function(){
				$scope[sectionID].message = '';
			}, 3 * 1000);
		});
	};
	
	$scope.updateSMTPPort = function(appSettings){
		appSettings.smtpPort = appSettings.smtpSSL ? 587 : 25;
	};
	
	// save settings
	$scope.saveSettings = function(sectionID, needServerRestart){
		if(_.isEmpty($scope.appSettings.fileUploadDirRelativePath)){
			$scope.displaySaveSettingsStatus(sectionID, false, 'FILEPATHEMPTY');
		}
		else{
			$tm1Ui.applicationSettingsSave($scope.appSettings).then(function(data){
				if(!data.success){
					$scope.displaySaveSettingsStatus(sectionID, false, 'SETTINGSSAVEERROR');		
				}
				else{
					if(needServerRestart){
						$scope.displaySaveSettingsStatus(sectionID, true, 'SETTINGSSAVESUCCESSREQUIRESERVERRESTART');
					}
					else{
						$scope.displaySaveSettingsStatus(sectionID, true, 'SETTINGSSAVESUCCESS');
					}					
				}
			});
		}		
	};
	
	// GENERAL
	// check settings
	$tm1Ui.applicationSettings().then(function(settings){
		$scope.appSettings = settings;
	});
	
	// get current user's name
	$tm1Ui.applicationInfo().then(function(data){
		if(data.currentAdminUsername){
			$scope.currentConsoleUser = data.currentAdminUsername;
		}
	});
	
	
}]);

app.controller('AdminSliceCtrl', ['$scope', '$rootScope', '$tm1Ui', '$http', '$timeout', '$location', '$stateParams',
                                  function($scope, $rootScope, $tm1Ui, $http, $timeout, $location, $stateParams) {
	
	// variable(s)
	$scope.options = {};
	$scope.page = {instance:'', cube:'', view:''};
	
	$scope.options.views = [];
	
	// function(s)
	$scope.updateCubes = function(){
		$tm1Ui.cubes($scope.page.instance).then(function(value){
			$stateParams.instance = $scope.page.instance;				
			$location.search('instance', $scope.page.instance);
			
			$scope.options.cubes = value;
		});
	};
	
	$scope.updateViews = function(){
		$tm1Ui.cubeViews($scope.page.instance, $scope.page.cube).then(function(views){
			$scope.options.views.length = 0;
			
			_.forEach(views, function(viewObj){ // this creator only works with native views
				if(viewObj['@odata.type'].toLowerCase().indexOf('nativeview') != -1){
					$scope.options.views.push(viewObj);
				}
			});
		});
	};
	
	$scope.getView = function(){
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			$scope.view = value;
		});
	};
	
	$scope.create = function(){
		
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			
			// Update the view in case it has changed.
			$scope.view = value;
			
			if($scope.view.rows.length > 1 || $scope.view.columns.length > 1){
				return;
			}
			
			var stateConfig = {states:{}};
			stateConfig.states[$scope.page.menuState] = {};
			stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
			stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
			
			var menuItemConfig = {
					label:$scope.page.pageName,
					icon_class:$scope.page.menuIconClass,
					data:{
						page:$scope.page.menuState
					}
			};
			
			var data = {
				pageName: $scope.page.pageName,
				view: $scope.view,
				
				state: stateConfig,
				menuItem: menuItemConfig
			};
			
			$scope.isDone = false;
			
			$http.post("api/admin/view/" + $scope.page.instance, data).then(function(value){
				
				$scope.isDone = true;
				
				$timeout(function(){
					$scope.isDone = false;
				}, 3000);
				
			});
			
		});
		
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
		}
		catch(err){}
	};
	
	// on a successful login
	$scope.$on('login.success', function(event, args){
		if(args && args.name){
			$scope.updateCubes();
		}
	});
	
	// on page load	
	$scope.page.instance = '';
	$tm1Ui.applicationInstances().then(function(value){
		$scope.options.instances = _.cloneDeep(value);
		if($scope.options.instances){
			var fromLogin = false; 
			var urlInstance = '';
			if($rootScope.previousStateParams && $rootScope.previousStateParams.instance){
				urlInstance = $rootScope.previousStateParams.instance;
			}
			
			if(urlInstance){
				$scope.page.instance = urlInstance;
				$scope.updateCubes();
			}
			else{
				$scope.options.instances.unshift({name:''});
			}
		}
	});
}]);
/*
 * 
 * 
 * (structure)
 * task-editor -> 	task-editor-chore		
 * 					task-editor-process
 * 					task-editor-action
 * 					task-editor-report		-> 	task-editor-report-email
 * 												task-editor-report-attachment
 * 												task-editor-report-burst		->	task-editor-report-burst-subset
 * 																					task-editor-report-burst-mdx
 * 																					task-editor-report-burst-csv
 * */

/*
 * This directive helps remove the <ng-include></ng-include> element and push its contents only into the DOM
 * */
app.directive('ngIncludeReplace', function(){
	return {
		restrict: 'A',
		require: 'ngInclude',
		link: function($scope, $elements, $attributes){			
			$elements.replaceWith($elements.children());		
		}
	};
});

/*
 * This is a validator that checks if the value you passed on to it is empty, and will add a class if so
 * */
app.directive('tm1AdminValidatorEmpty', ['$tm1Ui', function($tm1Ui){
	return {
		restrict: 'A',
		scope:{
			tm1AdminValidatorEmpty: '@',
			tm1ErrorClass: '@'
		},
		link: function($scope, $elements, $attributes){			
			$attributes.$observe('tm1AdminValidatorEmpty', function(newValue){
				var parts = $tm1Ui.helperConvertElementsToArray(newValue);
				var hasEmpty = false;
				_.forEach(parts, function(part){
					if(!hasEmpty && _.isEmpty(part)){
						hasEmpty = true;
					}
				});
				
				if(hasEmpty || _.isEmpty(newValue)){					
					if(angular.isDefined($attributes.tm1ErrorClass)){
						$elements.addClass($scope.tm1ErrorClass);
					}
					else{
						$elements.addClass('has-error');
					}
				}
				else{
					if(angular.isDefined($attributes.tm1ErrorClass)){
						$elements.removeClass($scope.tm1ErrorClass);
					}
					else{
						$elements.removeClass('has-error');
					}					
				}				
			});			
		}
	};
}]);

app.directive('tm1AdminTaskProcess', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-process.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskChore', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-chore.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskAction', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-action.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskReport', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskReportEmail', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-email.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskReportAttachment', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-attachment.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			$scope.addAttachment = function(task){				
				if(task.attachments == undefined){
					task.attachments = [];
				}
				
				var attachmentCount = task.attachments.length + 1;
				
				var attachment = {
						name: 'Attachment ' + attachmentCount,
		   		    	pageSize: 'A4',
		   		    	orientation: 'LANDSCAPE',
		   		    	outputType: 'pdf'
				};
				
				if($scope.values.taskDetail.credentials && $scope.values.taskDetail.credentials.length == 1){
					attachment.instance = $scope.values.taskDetail.credentials[0].instance;
				}
				
				task.attachments.push(attachment);				
			};
		}
	};
}]);

app.directive('tm1AdminTaskReportBurst', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			$scope.addBurstConfig = function(task, type){
				if(task.burstTypes == undefined){
					task.burstTypes = [];
				}
				
				var burstType = {'type': type};
				if(type == 'csvRemote'){
					burstType.csvFieldSeparator = ',';
					burstType.overwriteExistingFile = false;
				}
				
				if($scope.values.taskDetail.credentials && $scope.values.taskDetail.credentials.length == 1){
					burstType.instance = $scope.values.taskDetail.credentials[0].instance;
				}
				
				task.burstTypes.push(burstType);				
			};
			
			$scope.deleteBurstConfig = function(task, index){				
				task.burstTypes.splice(index, 1);
			};
		}
	};
}]);

app.directive('tm1AdminTaskReportBurstSubset', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst-subset.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskReportBurstMdx', ['$rootScope', function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst-mdx.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			
		}
	};
}]);

app.directive('tm1AdminTaskReportBurstCsvRemote', ['$tm1Ui', '$compile', '$ngBootbox', function($tm1Ui, $compile, $ngBootbox){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst-csv-remote.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			$scope.onAfterFileUpload = function(file, burstType){
				var pathTokens = _.split(file.path, '/');				
				burstType.csvPath = pathTokens[pathTokens.length - 1];
			};
			
			$scope.getTextFile = function(burstItem, relativeFilePath){
				$tm1Ui.applicationGetTextFile(burstItem.instance, relativeFilePath).then(function(fileContent){
					if(fileContent.failed){
						$ngBootbox.alert('<h5 class="text-danger">Unable to preview file: ' + fileContent.message + '</h5>').then(function(){});
					}
					else{
						burstItem.tempContent = fileContent;
						
						var parsedData = Papa.parse(fileContent);					
						$elements.find('div').each(function(index, element){
							if(angular.element(element).hasClass('burst-csv-remote-data')){
								angular.element(element).empty();
								
								var htmlTable = '<table class="table table-bordered">';
								
								// header
								htmlTable += '<thead>';							
								htmlTable += '<tr>';
								_.forEach(parsedData.data[0], function(text){
									htmlTable += '<th>' + text + '</th>';
								});
								htmlTable += '</tr>';							
								htmlTable += '</thead>';
								
								// body
								htmlTable += '<tbody>';
								for(var r = 0; r < parsedData.data.length; r++){
									if(r != 0){
										htmlTable += '<tr>';									
										_.forEach(parsedData.data[r], function(text){
											htmlTable += '<td>' + text + '</td>';
										});
										htmlTable += '</tr>';
									}
								}
								htmlTable += '</tbody>';
								
								htmlTable += '</table>';
								
								
								var tableElement = $compile(htmlTable)($scope);
								angular.element(element).append(tableElement);							
							}						
						});	
					}					
				});	
			};
		}
	};
}]);

app.directive('tm1AdminTaskReportBurstView', ['$rootScope', '$tm1Ui', function($rootScope, $tm1Ui){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst-view.html',
		scope:false,
		link:function($scope, $elements, $attributes){			
			$scope.updateCubeList = function(instance){
				if(instance != undefined){
					$tm1Ui.cubes(instance).then(function(cubes){					
						$scope.cubes = cubes;
					});
				}
			};
			
			$scope.updateCubeViewList = function(instance, cube){
				$tm1Ui.cubeViews(instance, cube).then(function(views){
					$scope.views = views;
				});
			};
			
			$scope.updatePlaceholderList = function(instance, cube, view){
				$scope.burstType.viewRowData = [];		
				var query = '$expand=Axes($expand=Hierarchies($select=Name;$expand=Dimension($select=Name)),Tuples($expand=Members($select=Name,UniqueName,Ordinal,Attributes;$expand=Parent($select=Name);$expand=Element($select=Name,Type,Level))))';
				$tm1Ui.cubeExecuteView(instance, cube, view, query).then(function(viewData){
					var queryToRetrieveViewAlias = '$expand=tm1.NativeView/Rows/Subset($select=Alias,UniqueName,Elements;$expand=Elements($select=Name,Attributes))';
					$tm1Ui.cubeView(instance, cube, view, queryToRetrieveViewAlias).then(function(cubeViewData){
						if(viewData.Axes != undefined && viewData.Axes.length > 1){
							var dimensions = [];
							
							_.forEach(viewData.Axes[1].Hierarchies, function(dimObj){
								dimensions.push(dimObj.Name);
							});						
							
							function getRowElementAlias(dimensionIndex, elementName){
								var elementAlias = elementName;
								if(cubeViewData && cubeViewData.Rows && cubeViewData.Rows.length > 0 && cubeViewData.Rows[dimensionIndex] 
										&& cubeViewData.Rows[dimensionIndex].Subset
										&& cubeViewData.Rows[dimensionIndex].Subset.Elements && cubeViewData.Rows[dimensionIndex].Subset.Elements.length > 0
										&& !_.isEmpty(cubeViewData.Rows[dimensionIndex].Subset.Alias)){
									
									var elementIndex = _.findIndex(cubeViewData.Rows[dimensionIndex].Subset.Elements, function(o) { return o.Name == elementName; });
									
									if(elementIndex != -1){
										elementAlias = cubeViewData.Rows[dimensionIndex].Subset.Elements[elementIndex].Attributes[cubeViewData.Rows[dimensionIndex].Subset.Alias];
									}								
								}
								
								return elementAlias;
							}
							
							_.forEach(viewData.Axes[1].Tuples, function(tuple){
								var rowData = {};
								for(var m = 0; m < dimensions.length; m++){
									rowData[dimensions[m]] = getRowElementAlias(m, tuple.Members[m].Name);
								}			
								
								$scope.burstType.viewRowData.push(rowData);
							});
						}						
					});					
				});			
			};
			
			$scope.initPlaceholderList = function(instance, cube, view){
				if($scope.burstType.viewRowData == undefined){
					$scope.updatePlaceholderList(instance, cube, view);
				}				
			};
			
			$scope.initBurstItem = function(burstItem){
				if(burstItem.instance != undefined){
					$scope.updateCubeList(burstItem.instance);					
					if(burstItem.cube != undefined){
						$scope.updateCubeViewList(burstItem.instance, burstItem.cube);						
						if(burstItem.view != undefined){
							$scope.initPlaceholderList(burstItem.instance, burstItem.cube, burstItem.view);
						}
					}
				}				
			};
			
			$scope.initBurstItem($scope.burstType);
		}
	};
}]);

app.directive('tm1AdminTaskReportBurstCsv', ['$rootScope', '$ngBootbox', '$timeout', function($rootScope, $ngBootbox, $timeout){
	return {
		restrict: 'E',
		templateUrl: 'admin/html/admin/task-editor-report-burst-csv.html',
		scope:false,
		link:function($scope, $elements, $attributes){
			$scope.values.lastFileUploaded = '';			
			$scope.values.fileUploadColumns = [];			
			$scope.values.csvAction = 1;
			
			$scope.gridOptions = {};
			$scope.gridOptions.columnDefs = $scope.values.fileUploadColumns;
			$scope.gridOptions.enableSorting = true;			
			$scope.gridOptions.data = [];
			
			$scope.gridOptions.onRegisterApi = function(gridApi){
				$scope.values.gridApi = gridApi;
			};
			
			// initialize data
			if($scope.values.modalObject.burstTypes[$scope.$index].csvData){
				$scope.gridOptions.data = $scope.values.modalObject.burstTypes[$scope.$index].csvData;
			}
			
			// grid operations
			$scope.addColumn = function(task, burstTypeIndex){
				$ngBootbox.prompt('Name of column to add:')
			    .then(function(result){
			    	$scope.gridOptions.columnDefs.push({field: result});				
					task.burstTypes[burstTypeIndex].csvData = $scope.gridOptions.data;
			    }, function(){});				
			};
			
			$scope.addRow = function(task, burstTypeIndex){
				$scope.gridOptions.data.push({});
				
				task.burstTypes[burstTypeIndex].csvData = $scope.gridOptions.data;
			};
			
			// file uploads
			$scope.onReceivedFile = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, task, burstTypeIndex){
				if($file){
					$ngBootbox.confirm($scope.values.messages.TASKEDITORPROMPTLOADCSV)
			    	.then(function() {
				    	
				    	task.burstTypes[burstTypeIndex].lastFileUploaded = $file.name;
						
						// now to convert to ui-grid compatible data
						Papa.parse($file, {
							complete: function(results) {
								if(results.data){
									$scope.gridOptions.data.length = 0;
									
									var i = 0;
									_.forEach(results.data, function(dataArray){
										if(i != 0){ // data
											var rowData = {};
											for(var a = 0; a < results.data[0].length; a++){
												rowData[results.data[0][a]] = dataArray[a];								
											}
											
											$scope.gridOptions.data.push(rowData);
										}
										else{ // header
											$scope.values.fileUploadColumns.length = 0;
											_.forEach(dataArray, function(header){
												$scope.values.fileUploadColumns.push({name: header, enableCellEdit: true});
											});
											
											$scope.gridOptions.columnDefs = $scope.values.fileUploadColumns;
										}
										
										i++;
									});			
									
									task.burstTypes[burstTypeIndex].csvData = $scope.gridOptions.data;							
									$timeout(function(){});
								}
							}
						});
				    	
				    }, 
				    function(){
				    	// do nothing
				    });	
				}
				
			};
		}
	};
}]);

app.controller('AdminTaskEditorCtrl', ['$scope', '$rootScope', '$tm1Ui', '$stateParams', '$ngBootbox', '$log', '$timeout', '$location', '$element', '$compile', '$translate',
                                    function($scope, $rootScope, $tm1Ui, $stateParams, $ngBootbox, $log, $timeout, $location, $element, $compile, $translate) {	
	// Variable(s)
	$scope.defaults = {};
	$scope.values = {};	
	$scope.list = {};
	$scope.functions = {};
	
	$scope.values.currentTaskId = '';
	$scope.values.activeModal = '';
	$scope.values.activeReportTab = 1;
	
	$scope.values.taskRunStatus = 0;
	
	$scope.defaults.PRINTPATHBASE = 'WEB-INF/print';
	$scope.finalFilePath = $scope.defaults.PRINTPATHBASE;
	
	$scope.values.lastTaskIdRunning = '';
	$scope.values.isTaskUpdated = false;
	$scope.values.rawTaskDetail = {};
	
	$scope.values.translationIDs = [];
	$scope.values.translationIDs.push('ACTIVATE');
	$scope.values.translationIDs.push('DEACTIVATE');
	$scope.values.translationIDs.push('DELETE');
	$scope.values.translationIDs.push('EDIT');
	$scope.values.translationIDs.push('SAVE');
	$scope.values.translationIDs.push('TASKEDITORADDNEWINSTANCE');
	$scope.values.translationIDs.push('TASKEDITORMOVEUP');
	$scope.values.translationIDs.push('TASKEDITORMOVEDOWN');
	$scope.values.translationIDs.push('TASKEDITORADDNEWATTACHMENT');
	$scope.values.translationIDs.push('TASKEDITORADDNEWSCHEDULE');	
	$scope.values.translationIDs.push('TASKEDITORADDNEWTASK');
	$scope.values.translationIDs.push('TASKEDITORADDNEWBURSTITEM');
	$scope.values.translationIDs.push('TASKEDITORLASTFILELOAD');
	$scope.values.translationIDs.push('TASKEDITORLOADCSV');
	$scope.values.translationIDs.push('TASKEDITORPROMPTLOADCSV');
	$scope.values.translationIDs.push('TASKEDITOROVERRIDEEXISTINGFILE');
	
	$scope.values.translationIDs.push('ATTACHMENTSAVEASIMAGE');
	$scope.values.translationIDs.push('ATTACHMENTSAVEASPDF');
	
	$scope.list.instances = [];
	$scope.list.processes = [];
	
	$scope.values.taskDetail = {name:'...'};
	$scope.values.isTaskDetailNew = false;
	
	$scope.values.appSettings = {};
	
	// Translations
	$translate($scope.values.translationIDs).then(function(translations){
		$scope.values.messages = {};		
		$scope.values.messages.ACTIVATE = translations.ACTIVATE;
		$scope.values.messages.DEACTIVATE = translations.DEACTIVATE;
		$scope.values.messages.DELETE = translations.DELETE;
		$scope.values.messages.EDIT = translations.EDIT;
		$scope.values.messages.SAVE = translations.SAVE;
		$scope.values.messages.TASKEDITORADDNEWINSTANCE = translations.TASKEDITORADDNEWINSTANCE;
		$scope.values.messages.TASKEDITORMOVEUP = translations.TASKEDITORMOVEUP;
		$scope.values.messages.TASKEDITORMOVEDOWN = translations.TASKEDITORMOVEDOWN;
		$scope.values.messages.TASKEDITORADDNEWATTACHMENT = translations.TASKEDITORADDNEWATTACHMENT;		
		$scope.values.messages.TASKEDITORADDNEWSCHEDULE = translations.TASKEDITORADDNEWSCHEDULE;
		$scope.values.messages.TASKEDITORADDNEWTASK = translations.TASKEDITORADDNEWTASK;
		$scope.values.messages.TASKEDITORADDNEWBURSTITEM = translations.TASKEDITORADDNEWBURSTITEM;
		$scope.values.messages.TASKEDITORLASTFILELOAD = translations.TASKEDITORLASTFILELOAD;
		$scope.values.messages.TASKEDITORLOADCSV = translations.TASKEDITORLOADCSV;
		$scope.values.messages.TASKEDITORPROMPTLOADCSV = translations.TASKEDITORPROMPTLOADCSV;
		$scope.values.messages.TASKEDITOROVERRIDEEXISTINGFILE = translations.TASKEDITOROVERRIDEEXISTINGFILE;
		
		$scope.values.messages.ATTACHMENTSAVEASIMAGE = translations.ATTACHMENTSAVEASIMAGE;
		$scope.values.messages.ATTACHMENTSAVEASPDF = translations.ATTACHMENTSAVEASPDF;
	});
	
	// Function(s)
	$scope.getTaskName = function(task){
		var taskName = task.name;		
		if(task.type == 'action'){
			return _.capitalize(taskName);
		}
		else{
			return taskName;
		}		
	};
	
	$scope.formattedMessageWithError = function(message){
		return '<h5 class="text-danger">' + message + '</h5>';
	};
	
	$scope.isValidTaskDetail = function(taskDetail){
		var isValid = true;
		
		// validate name
		if(taskDetail.name == undefined || _.isEmpty(taskDetail.name)){
			isValid = false;
			
			$ngBootbox.alert($scope.formattedMessageWithError('Please key in the name of your task.')).then(function(){});
		}
		
		// validate instances		
		if(isValid && !(taskDetail.credentials.length > 0)){
			isValid = false;
			
			$ngBootbox.alert($scope.formattedMessageWithError('Please setup at least one(1) instance.')).then(function(){});
		}	
		
		// validate task	
		if(isValid && !(taskDetail.tasks.length > 0)){
			isValid = false;
			
			$ngBootbox.alert($scope.formattedMessageWithError('Please setup at least one(1) task.')).then(function(){});
		}
		
		return isValid;
	};
	
	$scope.saveTaskDetail = function(){
		
		// save URL information
		$scope.values.taskDetail.appBaseUrl = {
				protocol: $location.protocol(),
				host: $location.host(),
				port: $location.port()
		};
		
		if($scope.isValidTaskDetail($scope.values.taskDetail)){
			
			// check if there are other fields that has a 'has-error' CSS class
			var errorCount = 0;
			$('#task-editor').find('.has-error').each(function(){			
				errorCount++;
			});
			
			function updateTask(){
				$tm1Ui.saveOrUpdateTask($scope.values.taskDetail).then(function(result){
					if(result.success){
						$ngBootbox.alert('Task <strong>' + $scope.values.taskDetail.name + '</strong> saved.').then(function(){});
						
						// maintain a copy for comparison
						$scope.values.rawTaskDetail = _.cloneDeep($scope.values.taskDetail);
						
						// set the new flag to false
						$scope.values.isTaskDetailNew = false;
					}
					else{
						$log.error(action);
						$ngBootbox.alert('There was an error saving Task <strong>' + $scope.values.taskDetail.name + '</strong>. Check console for more details.').then(function(){});
					}
					
					$scope.values.isTaskUpdated = false;
				});
			}
			
			if(errorCount > 0){
				$ngBootbox.confirm($scope.formattedMessageWithError('There are still errors on the page. Are you sure you want to proceed?'))
			    .then(function() {
			    	updateTask();
			    }, function() {
			        // do nothing
			    });
			}		
			else{
				updateTask();
			}
		}		
	};
	
	$scope.resetTask = function(){
		$ngBootbox.confirm('This will reset and you will lose all unsaved changes with this task. Proceed?')
	    .then(function() {
	    	$scope.values.taskDetail = _.cloneDeep($scope.values.rawTaskDetail);
	    }, function() {
	        // do nothing
	    });		
	};
	
	$scope.checkRunStatus = function(taskId){
		$scope.values.taskRunStatus = 1;
		var intervalID = setInterval(function(){
			$tm1Ui.taskRunStatus(taskId).then(function(runStatus){						
				if(!runStatus.isRunning){
					$scope.values.taskRunStatus = 2;
					clearInterval(intervalID);
					
					$timeout(function(){
						$scope.values.taskRunStatus = 0;						
					}, 3 * 1000);					
				}
			});
		}, 1 * 1000);
	};
	
	$scope.runTaskDetail = function(){		
		$ngBootbox.confirm('This will run task <strong>' + $scope.values.taskDetail.name + '</strong>. Proceed?')
	    .then(function() {
	    	$tm1Ui.taskRun($scope.values.taskDetail.id).then(function(runRequestStatus){
				if(runRequestStatus && runRequestStatus.jobRunId){
					$scope.checkRunStatus(runRequestStatus.jobRunId);	
				}
				else{
					$log.error(runRequestStatus);
				}
			});
	    }, function() {
	        // do nothing
	    });
	};
	
	$scope.addTask = function(taskType){
		if($scope.values.taskDetail.credentials.length == 0){			
			$ngBootbox.alert($scope.formattedMessageWithError('Please setup at least one(1) instance.')).then(function(){});
		}
		else{
			var taskItem = {name: '', type: taskType, active: true};
			if(taskType == 'action'){
				taskItem.name = 'wait';
			}
			$scope.values.taskDetail.tasks.push(taskItem);
		}		
	};
	
	$scope.deleteTask = function(index){
		$ngBootbox.confirm('Are you sure you want to delete <strong>' + $scope.values.taskDetail.tasks[index].name + '</strong>?')
	    .then(function() {
	    	$scope.values.taskDetail.tasks.splice(index, 1);
	    }, function() {
	        // do nothing
	    });
	};
	
	$scope.addCredential = function(){
		$scope.values.taskDetail.credentials.push({});
	};
	
	$scope.addTrigger = function(){
		$scope.values.taskDetail.triggers.push({id:$tm1Ui.helperGenerateUUID() + '---' + $scope.values.taskDetail.triggers.length});
	};
	
	$scope.setTrigger = function(trigger){
		$scope.targetTrigger = trigger;
		
		$scope.values.showTriggerModal = false;
		$timeout(function(){
			$scope.values.showTriggerModal = true;
		}, 1);
	};
	
	$scope.onCronHelperApply = function(){
		$('#cronModal').modal('hide');
	};
	
	$scope.moveElement = function(array, fromIndex, toIndex){		
		var elementFrom = array[fromIndex];
		var elementTo = array[toIndex];
		
		array[toIndex] = elementFrom;
		array[fromIndex] = elementTo;		
	};
	
	$scope.formatFilePath = _.debounce(function(){
		$scope.finalFilePath = $scope.defaults.PRINTPATHBASE;
		
		// console.info('$scope.finalFilePath(1) %o', $scope.finalFilePath);
		if($scope.values.modalObject && $scope.values.modalObject.email){
			$timeout(function(){
				if(!_.isEmpty($scope.values.modalObject.email.outputRelativeDir)){
					$scope.finalFilePath += '/' + $scope.values.modalObject.email.outputRelativeDir;
					// console.info('$scope.finalFilePath(1) %o', $scope.finalFilePath);
				}
				
				if($scope.values.modalObject.email.appendTimestamp){
					// console.info('$scope.finalFilePath(2.1) Empty? %o', _.isEmpty($scope.values.modalObject.email.prependTimeFormat));
					if(_.isNil($scope.values.modalObject.email.appendedTimeFormat) || _.isEmpty($scope.values.modalObject.email.appendedTimeFormat)){
						$scope.values.modalObject.email.appendedTimeFormat = 'yyyyMMdd';
						// console.info('$scope.finalFilePath(2.2) %o', $scope.finalFilePath);
					}
					else{
						// console.info('$scope.finalFilePath(2.3) TimeFormat: %o', $scope.values.modalObject.email.prependTimeFormat);
					}
					
					if(!_.isEmpty($scope.values.modalObject.email.appendedTimeFormat)){
						$scope.finalFilePath += '-<' + $scope.values.modalObject.email.appendedTimeFormat + '>';
						// console.info('$scope.finalFilePath(3) %o', $scope.finalFilePath);
					}	
				}
			});
		}
	}, 100);
	
	// Process operations
	$scope.getProcessDetail = function(process){
		$timeout(function(){
			$tm1Ui.process(process.instance, process.name).then(function(processDetail){
				if(process.parameters == undefined){
					process.parameters = [];
				}				
				
				// TODO: check if the previous parameters are still applicable
				process.parameters.length = 0;
				
				if(processDetail.Parameters && processDetail.Parameters.length > 0){
					_.forEach(processDetail.Parameters, function(defaultParam){
						process.parameters.push({name: defaultParam.Name, value: defaultParam.Value, defaultValue: defaultParam.Value});
					});
				}
			});
			
		}, 1);
	};
	
	$scope.$on('tm1UiSelect.item.selected', function(event, itemSelected){
		if($scope.values.activeModal == 'process'){
			$scope.values.modalObject.name = itemSelected;
			$scope.getProcessDetail($scope.values.modalObject);
		}		
	});
	
	$scope.$on('tm1.event.refresh', function(event, args){
		if($scope.values.activeModal && $scope.values.activeModal == 'process'){
			if($scope.values.modalObject && $scope.values.modalObject.instance){
				$scope.updateProcessList($scope.values.modalObject.instance, 'process');
			}
		}
	});
	
	$scope.updateProcessList = function(instance, processModalId){
		if(!_.isEmpty(instance)){
			$tm1Ui.dimensionElements(instance, '}Processes').then(function(processes){
				if(processes){
					$scope.list.processes.length = 0;
					_.forEach(processes, function(process){
						$scope.list.processes.push(process.Name);			
					});
					
					$timeout(function(){						
						$element.find('div').each(function(index, element){
							if(angular.element(element).hasClass('tm1-ui-process-modal')){
								angular.element(element).children().each(function(childIndex, childElement){
									if(angular.element(childElement).hasClass('tm1-ui-select')){
										angular.element(childElement).remove();  
									}    								
								});
								
								if($scope.selectScope){
									$scope.selectScope.$destroy();
								}
								
								$scope.selectScope = $scope.$new();    	
		    					$scope.selectConfig = {};	    					
		    					$scope.selectConfig.tm1List = $scope.list.processes;
		    					$scope.selectConfig.value = $scope.values.modalObject.name;
		    					$scope.selectConfig.tm1IncludeEmpty = true;
		    					
								var selectHtml = '<tm1-ui-select ';
		    					selectHtml += 'tm1-config="selectConfig " ';	    					
		    					selectHtml += '></tm1-ui-select>';		    					
		    					var selectElement = $compile(selectHtml)($scope.selectScope);
								angular.element(element).append(selectElement);
							}    						
						});
						
						$scope.showModal(processModalId);
					});
				}
			});	
		}		
	};
	
	// Modal operations
	$scope.showModal = function(modalId){
		$timeout(function(){
			$('#' + modalId).modal('show');
		});
	};
	
	$scope.closeModal = function(modalId){
		$('#' + modalId).modal('toggle');
	};
	
	$scope.toggleModal = function(modalId, modalObject){
		$timeout(function(){
			$scope.values.activeModal = '';
		});
		
		// set to the first instance, if there is only one
		if($scope.list.instances && $scope.list.instances.length == 1 && (modalObject.instance == undefined || _.isEmpty(modalObject.instance))){
			modalObject.instance = $scope.list.instances[0];
		}
		
		$timeout(function(){
			$scope.values.activeModal = modalId;
			$scope.values.modalObject = modalObject;
			
			if(modalId == 'process'){				
				if(!_.isEmpty(modalObject.instance)){
					$scope.updateProcessList(modalObject.instance, modalId);
				}	
				else{
					$scope.showModal(modalId);
				}
			}
			else if(modalId == 'report'){
				$scope.formatFilePath();
				$scope.showModal(modalId);
			}
			else{				
				$scope.showModal(modalId);
			}	
		}, 10);
	};
	
	$scope.closeChoreModal = function(){
		$scope.closeModal('chore');
	};
	
	// Initialization
	if($stateParams.taskId == undefined){
		$scope.values.currentTaskId = $tm1Ui.helperGenerateUUID();
	}
	else{
		$scope.values.currentTaskId = $stateParams.taskId;
	}
	
	$tm1Ui.task($scope.values.currentTaskId).then(function(taskDetail){
		$scope.values.taskDetail = taskDetail;
		
		if($scope.values.taskDetail == null){
			$scope.values.taskDetail = {
					id: $scope.values.currentTaskId,
					tasks:[],
					credentials: [],
					triggers: [],
					active: false
			};
			
			$scope.values.isTaskDetailNew = true;
		}
		
		// initialize properties
		if($scope.values.taskDetail.tasks == undefined){
			$scope.values.taskDetail.tasks = [];
		}
		
		if($scope.values.taskDetail.credentials == undefined){
			$scope.values.taskDetail.credentials = [];
		}
		
		if($scope.values.taskDetail.triggers == undefined){
			$scope.values.taskDetail.triggers = [];
		}
		
		// maintain a copy for comparison
		$scope.values.rawTaskDetail = _.cloneDeep($scope.values.taskDetail);
		
		// setup watcher here so it does not get called when initializing
		$scope.$watch('values.taskDetail', function (newValue, oldValue, scope) {
			if(!angular.equals(newValue, $scope.values.rawTaskDetail)){
				$scope.values.isTaskUpdated = true;
			}
			else{
				$scope.values.isTaskUpdated = false;
			}
		}, true);
	});
	
	$tm1Ui.applicationInstances().then(function(instances){
		_.forEach(instances, function(instance){
			$scope.list.instances.push(instance.name);
		});
	});
	
	// check if task is actively running
	$tm1Ui.taskRunStatus($scope.values.currentTaskId).then(function(runStatus){
		if(runStatus.isRunning){
			$scope.checkRunStatus($scope.values.currentTaskId);	
		}
	});
	
	// retrieve app settings
	$tm1Ui.applicationSettings().then(function(settings){
		$scope.values.appSettings = settings;		
	});
	
}]);

app.controller('AdminTaskManagerCtrl', ['$scope', '$rootScope', '$tm1UiSetting', '$log', '$tm1Ui', '$translate', '$state', '$ngBootbox', '$http', '$translate',
                                    function($scope, $rootScope, $tm1UiSetting, $log, $tm1Ui, $translate, $state, $ngBootbox, $http, $translate) {
	
	$scope.lists = {};	
	$scope.values = {};
	
	$scope.values.translationIDs = [];
	$scope.values.translationIDs.push('ACTIVATE');
	$scope.values.translationIDs.push('DEACTIVATE');
	$scope.values.translationIDs.push('DELETE');
	$scope.values.translationIDs.push('EDIT');
	$scope.values.translationIDs.push('EXECUTE');	
	$scope.values.translationIDs.push('TASKMANAGERADDTASK');
	$scope.values.translationIDs.push('TASKMANAGERREFRESHTASK');
	$scope.values.translationIDs.push('TASKMANAGERSHOWFILTERS');
	
	// Translations
	$translate($scope.values.translationIDs).then(function(translations){
		$scope.values.messages = {};		
		$scope.values.messages.ACTIVATE = translations.ACTIVATE;
		$scope.values.messages.DEACTIVATE = translations.DEACTIVATE;
		$scope.values.messages.DELETE = translations.DELETE;
		$scope.values.messages.EDIT = translations.EDIT;
		$scope.values.messages.EXECUTE = translations.EXECUTE;		
		$scope.values.messages.TASKMANAGERADDTASK = translations.TASKMANAGERADDTASK;
		$scope.values.messages.TASKMANAGERREFRESHTASK = translations.TASKMANAGERREFRESHTASK;
		$scope.values.messages.TASKMANAGERSHOWFILTERS = translations.TASKMANAGERSHOWFILTERS;
	});
	
	// Function(s)
	$scope.getTaskName = function(task){
		var taskName = task.name;		
		if(task.type == 'action'){
			return _.capitalize(taskName);
		}
		else{
			return taskName;
		}		
	};
	
	$scope.resetFilters = function(){
		$scope.values.sortValue = '';
		$scope.values.sortStatus = '';
		$scope.values.filterOpen = false;
	};
	
	$scope.gotoTaskEditor = function(task){
		$state.go('admin.task-editor', {taskId: task.id, task: task});
	};
	
	$scope.checkRunStatus = function(task, taskRunId){
		task.isRunning = true;
		task.intervalID = setInterval(function(){
			$tm1Ui.taskRunStatus(taskRunId).then(function(runStatus){						
				if(!runStatus.isRunning){
					task.isRunning = false;
					clearInterval(task.intervalID);
				}
				else if(runStatus.isRunning){
					task.isRunning = true;
				}
			});
		}, 1 * 1000);
	};
	
	$scope.runTask = function(task){
		$ngBootbox.confirm('Are you sure you want to run <strong>' + task.name + '</strong>?')
		    .then(function() {		    	
				$tm1Ui.taskRun(task.id).then(function(runRequestStatus){
					if(runRequestStatus && runRequestStatus.jobRunId){
						$scope.checkRunStatus(task, runRequestStatus.jobRunId);
					}
					else{
						$log.error(runRequestStatus);
					}				
				});
		    }, function() {
		        // do nothing
		    }
	    );			
	};
	
	$scope.activateTask = function(task){		
		// confirm first
		var taskName = _.isEmpty(task.name) ? 'UNKNOWN' : task.name;		
		var taskAction = task.active ? 'deactivate' : 'activate';
		
		$ngBootbox.confirm('Are you sure you want to ' + taskAction + ' <strong>' + taskName + '</strong>?')
	    .then(function() {
	    	task.active = !task.active;
	    	$tm1Ui.saveOrUpdateTask(task).then(function(data){
				if(data.success){
					$scope.refreshTasks();
					$ngBootbox.alert('Task <strong>' + taskName + '</strong> ' + taskAction + 'd.').then(function(){});
				}
				else{
					$log.error(data);
					throw 'Error updating task';				
				}
			});
	    }, function() {
	        // do nothing
	    });		
	};
	
	$scope.deleteTask = function(task){		
		// confirm first
		var taskName = _.isEmpty(task.name) ? 'UNKNOWN' : task.name;
		
		var options = {
	        message: 'Are you sure you want to delete <strong>' + taskName + '</strong>?',
	        buttons: {
	        	main: {
	        		label: 'Delete',
	        		className: 'btn-danger',
	        		callback: function() {
	        			$tm1Ui.deleteTask(task.id).then(function(data){
	        				if(data.success){
	        					$scope.refreshTasks();
	         					$ngBootbox.alert('Task <strong>' + taskName + '</strong> deleted.').then(function(){});
	         				}
	         				else{
	         					$log.error(data);
	         					throw 'Error deleting task';				
	         				}
	        			});
	        		}
	        	}, 
	        	warning: {
	        		label: 'Cancel',
        			className: 'btn-default',
        			callback: function() {}
	        	}
	        }
	    };

		$ngBootbox.customDialog(options);
	};
	
	$scope.createNewTask = function(){
		$scope.gotoTaskEditor({id: $tm1Ui.helperGenerateUUID()});
	};
	
	$scope.refreshTasks = function(){
		$tm1Ui.tasks().then(function(data){
			$scope.lists.tasks = data;
			
			_.forEach($scope.lists.tasks, function(task){
				$scope.checkRunStatus(task, task.id);
			});
			
			$scope.resetFilters();
		});	
	};
	
	// finally
	$scope.refreshTasks();
}]);
