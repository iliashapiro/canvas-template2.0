app.service('globals', ['$tm1Ui', '$location', function($tm1Ui, $location) {
    this.updateSettings = function (values, defaults, selections, parameter, options, defaultVal) {
    //Get user settings value from Settings cube
    if(values){
      if(values.user){
        $tm1Ui.cellGet(defaults.settingsInstance, defaults.settingsCube, values.user.Name, parameter, defaults.settingsMeasure).then(function (data) {
            if(data){
                if(!data.failed){
                    var tm1Value = data.Value;
                    var urlValue = $location.search()[parameter]; 
                    var newValue = undefined;
                    //Determine the new value (SUBNM, URL or TM1)
                    
                        if(options.value && options.value != ''){
                           //console.log(options.value, 'options value from subnm')
                           //if the value is coming from SUBNM
                           newValue = options.value;
                        }else{
                              //if the value is coming from URL
                              if (urlValue && urlValue != tm1Value) {
                                 newValue = urlValue;
                              }else{
                                 newValue = tm1Value;
                              }
                        }
                     
                     
                    //Set defaults variable
                    
                    //Set selections variable (if tm1Alias = tm1Alias else newValue)
                    if(options.tm1Alias){
                        //Get Description alias for selections.version
                        $tm1Ui.attributeGet(defaults.settingsInstance, options.tm1Dimension, newValue, options.tm1Alias).then(function (data) {
                            var aliasValue = undefined;
                            
                            if(data){
                                aliasValue = data.Value;
                            }else{
                                aliasValue = newValue;
                            }
                            selections[parameter] = aliasValue;
                        });
                    }else{
                        selections[parameter] = newValue;
                    }
                    //Update the URL
                    if(newValue === '' && tm1Value === ''){
                     $location.search([parameter], defaultVal);
                     //No need to update the TM1 settings if the new value is the same
                     defaults[parameter] = defaultVal;
                         $tm1Ui.cellPut(defaultVal, defaults.settingsInstance, defaults.settingsCube, values.user.Name, parameter, defaults.settingsMeasure).then(function (data) {
                         });
                     
                    }else{
                     $location.search([parameter], newValue);
                     //No need to update the TM1 settings if the new value is the same
                     defaults[parameter] = newValue;
                     if(newValue != tm1Value){
                         $tm1Ui.cellPut(newValue, defaults.settingsInstance, defaults.settingsCube, values.user.Name, parameter, defaults.settingsMeasure).then(function (data) {
                         });
                     }
                    }
                   
                }
            }
             
        });
    }
   }
         
    }
}]);