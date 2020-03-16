(function(){
    var app = angular.module('app');
    app.directive('c3NamedmdxChart', ['$log','$rootScope','$tm1Ui','$timeout','orderByFilter',   function($log, $rootScope,$tm1Ui,$timeout,orderBy) {
        return {
            templateUrl: 'html/c3-namedmdx-chart.html',
            scope:{
                componentHeight:'@',
                dimensionColumnWidth:'@',
                heading:'@',
                chartTargetId:'@',
                decimalFormatVal:'@',
                mdxId:'@',
                mdxParam:'@',
                cubeName:'@',
                dimensionAlias:'@',
                className: '@',
                showChart:'@',
                hideChart:'@',
                chartPosition : '@',
                hideTable:'@',
                chartType:'@',
                chartDriver:'@',
                chartDimensionDriver:'@',
                chartRowDriver:'@',
                chartRowDimensionDriver:'@',
                chartLedgendsShow:'@',
                chartRotateAxis:"@",
                chartRowDriverDimensionName:'@',
                chartLedgendPosition:'@',
                filterMode:'@',
                filterShowCells:'@',
                sliderMode:'@',
                justifyList:'@'
          }, 
          link:function(scope, $elements, $attributes, directiveCtrl, transclude){
            scope.componentHeight = $attributes.componentHeight;
            scope.dimensionColumnWidth = $attributes.dimensionColumnWidth;
            scope.heading = $attributes.heading;
             scope.mdxId = $attributes.mdxId;
             scope.typeOptions=["bar","spline","line","area"];
             scope.colorArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
             scope.colorNameArray = {
                 "Balance Sheet":{"color":"#1f77b4"},
                 "Assets":{"color":"#aec7e8"},
                 "Liabilities and Owners Equity":{"color":"#ff7f0e"}
             
             };
             scope.chart = null;
            scope.decimalFormat = $attributes.decimalFormatVal;
            console.log(scope.decimalFormat, "format");
             scope.config = {};
             scope.config.data = {};
             scope.config.type = {};
             scope.config.categories = [];
             scope.config.series = [];
             scope.arrayOfGeneratedColor = [];
             scope.dimensionAlias = [];
             scope.chartDriverPosition = [];
             scope.filterMode = $attributes.filterMode;
             scope.dimensionAlias =  JSON.parse($attributes.dimensionAlias);
             scope.cubename = $attributes.cubeName;
             scope.chartType = $attributes.chartType;
             scope.mdxParam = JSON.parse($attributes.mdxParam);
             scope.chartDriver = $attributes.chartDriver;
             scope.chartDimensionDriver = $attributes.chartDimensionDriver;
             scope.chartRowDriver = $attributes.chartRowDriver;
             scope.chartRowDimensionDriver = $attributes.chartRowDimensionDriver;
             scope.chartRowDriverDimensionName = $attributes.chartRowDriverDimensionName;
             scope.className = $attributes.className;
             scope.filterShowCells = $attributes.filterShowCells;
             scope.chartLedgendsShow = $attributes.chartLedgendsShow;
             scope.arrayOfGeneratedColor[scope.chartTargetId]  = [];
             scope.indicatorXAxis    = [];
             scope.hideChart = $attributes.hideChart;
             scope.searchField = [];
             scope.hideXaxis = $attributes.hideXaxis
             scope.sliderMode = $attributes.sliderMode;
             scope.justifyList = $attributes.justifyList;
             scope.chartLedgendPosition = $attributes.chartLedgendPosition;
             scope.rowDimensionAttribute = scope.dimensionAlias['alias'][scope.chartRowDriverDimensionName];
            // console.log(scope.dimensionAlias['alias'][scope.chartRowDriverDimensionName], "scope.dimensionAlias")
                 scope.getAttributeOfElement = function(dimension , key, attribute){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, dimension, key,  attribute).then(function(result){
                       if(result){
                        if(!result.failed){
                                    
                             
                            //    $rootScope.defaults[scope.chartRowDriver] = result[0]['Parents'][0].Name;
                                 // console.log(result, "return description ", result[0]['Attributes']['Description'])

                                  scope.indicatorXAxis[scope.chartTargetId]  =  result[0]['Attributes']['Description'];
                                   scope.findElementPosition(scope.indicatorXAxis[scope.chartTargetId],scope.config.categories );
                                    
                                 //  scope.createChart();
                      }
                      
                       }
                         
                    });
                       
                }
            // scope.getAttributeOfElement(scope.chartDimensionDriver, $rootScope.defaults[scope.chartDriver], scope.dimensionAlias['alias'][scope.chartDimensionDriver]);
                    
            scope.getAttributeOfElement(scope.chartDimensionDriver, $rootScope.defaults[scope.chartDriver], 'Description');
            
            //console.log( cope.chartDimensionDriver, scope.dimensionAlias['alias'][scope.chartDimensionDriver], "scope.dimensionAliasscope.dimensionAlias")

             if($attributes.chartRotateAxis === 'true'){
                scope.chartRotateAxis = true;
             }else{
                scope.chartRotateAxis = false;
             }
             scope.resize = false;
             scope.groupSelect = false;
             if($attributes.hideTable === 'true'){
                scope.hideTable = $attributes.hideTable;
             }else{
                 
             }
             scope.popoverContent = '';
             scope.seeParam = function(json){ 
              
                var returnTemp= '';
                var param  = angular.fromJson(json).parameters
                _.forEach(param, function(el,index,arr){
                 
                    if((index).toLowerCase() === (scope.chartDriver).toLowerCase() ){
                        returnTemp =  returnTemp + "<span styl='color:#ddd'><i class='fa fa-th-list'></i> " +index +" - "+el+ " Selected</span><br>"
                    }else{
                        returnTemp =  returnTemp + "" +index +" - "+el+ "<br>"
                    }
                    
                     
                 });
                return returnTemp;
             }
             scope.showChartSetup = $attributes.showChart;
             scope.toogleChart = $attributes.showChart;
             scope.chartPosition = $attributes.chartPosition;
             scope.chartTargetId = $attributes.chartTargetId;
             scope.findElementPosition = function(nameToFind, arrayToLoop){
                var returnVal = ''
                for(var bb = 0; bb < arrayToLoop.length; bb++){
                        // 
                         if(arrayToLoop[bb] === nameToFind){
                          //   console.log(bb + "" +arrayToLoop[bb]);
                            returnVal = bb;
                         }
                };
                 
                scope.chartDriverPosition[scope.chartTargetId] =  returnVal;
               if(scope.table != undefined){
                    scope.createChart();
               }
               
             }
               
             scope.getData = function(){
                
                scope.loading = true;
                scope.config.data = {};
                scope.config.categories = [];
                        scope.config.series[scope.chartTargetId] = [];
                       scope.arrayOfGeneratedColor[scope.chartTargetId] = [];
                 $tm1Ui.cubeExecuteNamedMdx($rootScope.defaults.settingsInstance, scope.mdxId, scope.mdxParam).then(function (result) {
                     if (!result.failed) {
                       
                         scope.dataset = $tm1Ui.resultsetTransform($rootScope.defaults.settingsInstance, scope.cubeName, result, scope.dimensionAlias);
                         _.forEach(scope.dataset.rows,function(el,rowIndex,arr){
                                //    console.log(el,rowIndex,arr, "new Dataset row")
                                })
                         var options = { preload: false, watch: false, pageSize: 10000 };
                         if (scope.table) {
                             options.index = scope.table.options.index;
                             options.pageSize = scope.table.options.pageSize;
                         }
                         
                         //console.log(scope.dataset, "scope.dataset")
                         scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, options);
                         scope.loading = false;
                         scope.config.categories = [];
                         // console.log(scope.table.data());
                         _.forEach(scope.dataset.headers[0].columns,function(el,rowIndex,arr){
                            if(el['element']['attributes']['Description'] != undefined){
                                scope.config.categories.push(el['element']['attributes']['Description'])
                            }else{
                                scope.config.categories.push(el.key) 
                            }
                            
                        });
                        scope.arrayOfGeneratedColor[scope.chartTargetId] = [];
                        //scope.findElementPosition($rootScope.defaults[scope.chartDriver], scope.config.categories );
                         scope.getAttributeOfElement(scope.chartDimensionDriver, $rootScope.defaults[scope.chartDriver], 'Description');
                        
                         _.forEach(scope.table.data(),function(el,rowIndex,arr){
                             _.forEach(arr[rowIndex]['elements'],function(el,rowIndex,arr){
                               // console.log(el, rowIndex, arr, "SERIES ELEMENTS")
                             })
                              if(arr[rowIndex]['elements']['0']['element']['attributes']['Description']  != arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1]['element']['attributes']['Description']){
                                scope.config.series[scope.chartTargetId].push(arr[rowIndex]['elements']['0']['element']['attributes']['Description'] + '^' + arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1]['element']['attributes']['Description']);
                              }else{
                                scope.config.series[scope.chartTargetId].push(arr[rowIndex]['elements']['0']['element']['attributes']['Description'] ) ;
                              }
                   
                             if(arr[rowIndex]['elements']['0']['element']['attributes']['Description'] != undefined){
                                        var color= scope.hashCode((arr[rowIndex]['elements']['0']['element']['attributes']['Description']+'').split(' ').join(''));
                                   }else{
                                    var color= scope.hashCode((arr[rowIndex]['elements']['0'].name+'').split(' ').join(''));
                                   }
                            scope.arrayOfGeneratedColor[scope.chartTargetId].push(color);
                             //console.log( scope.config.series[scope.chartTargetId], "series names");
                         });
                         _.forEach(scope.table.data(),function(el,rowIndex,arr){
                            var nameToUse = ''; 
                            if(arr[rowIndex]['elements']['0']['element']['attributes']['Description'] != undefined){
                                if(arr[rowIndex]['elements']['0']['element']['attributes']['Description'] != arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1]['element']['attributes']['Description']){
                                    nameToUse = arr[rowIndex]['elements']['0']['element']['attributes']['Description'] + '^' + arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1]['element']['attributes']['Description']
                                } else{
                                    nameToUse = arr[rowIndex]['elements']['0']['element']['attributes']['Description'] 
                              
                                }
                                 
                             }else{
                                // console.log(arr[rowIndex]['elements']['0'].key, "#####")
                                if(arr[rowIndex]['elements']['0'].key != arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1].key){
                                    nameToUse = arr[rowIndex]['elements']['0'].key +'^'+arr[rowIndex]['elements'][arr[rowIndex]['elements'].length-1].key
                                }else{
                                    nameToUse = arr[rowIndex]['elements']['0'].key  
                                }
                                
                             }
                             scope.config.data[nameToUse] = [];
                             scope.config.type['type'+rowIndex] = [];
                                 
                                 for(var tt = 0 ; tt < arr[rowIndex]['cells'].length; tt++){
                                     var temppercentVal =  ( (arr[rowIndex]['cells'][tt].value) )* 100;
                                    var percentVal =   parseFloat(temppercentVal).toFixed(2)
                                        // console.log("percentVal", percentVal )
                                     if(scope.decimalFormat === '2'){
                                         
                                        scope.config.data[nameToUse].push(percentVal);
                                     }else{
                                        scope.config.data[nameToUse].push(parseInt(arr[rowIndex]['cells'][tt].value));
                                     }
                                     
                                 }   
                                 
                                 scope.config.type['type'+rowIndex ] = scope.chartType;
                             
                                 // console.log( arr[rowIndex]['elements']['0']['element']['attributes']['Description'], scope.config.data[arr[rowIndex]['elements']['0']['element']['attributes']['Description']],"Description");
                         });
                          if(scope.table.data().length > 0 ){

                              if(scope.table.data()[0]['cells'][0] != 'undefined' ){
                                 //console.log(scope.table.data()[0]['cells'][0])
                                    scope.propertyName = scope.table.data()[0]['cells'][0].elements.key;
                                    scope.sortBol = true;
                                    scope.sortBy(scope.propertyName)
                                    
                              }
                            
                          }
                          
                     }else{
                         scope.loading = false;
                     }
                 }); 
             }

             scope.hashCode = function(str) { // java String#hashCode
               
                if((str+'').split('^').length > 0){
                    var newStr = ((str+'').split('^')[0]);
                }else{
                    var newStr = ((str+''));
                }
                 
                    if($attributes.chartDimensionColors && JSON.parse($attributes.chartDimensionColors)[newStr] ){
                        var newJson = JSON.parse($attributes.chartDimensionColors);
                        
                        return newJson[newStr];
                        
                       // console.log(JSON.parse($attributes.chartDimensionColors), "$rootScope.chartDimensionColors")
                    }else{
                        var hash = 0;
                        for (var i = 0; i < (str+'').length; i++) {
                            hash = (str+'').charCodeAt(i) + ((hash << 5) - hash);
                        }
                        var colour = '#';
                        for (var i = 0; i < 3; i++) {
                            var value = (hash >> (i * 8)) & 0xFF;
                            colour += ('00' + value.toString(16)).substr(-2);
                        }
                       return colour;
                    }
                     
                    
                 
                 
                     
                
            
            } 
            scope.removeAllFromArray = function(){
                scope.columnToShowArray =  [];
                scope.mdxElements[scope.chartDriver] = '['+scope.chartDimensionDriver+'].['+scope.chartDimensionDriver+'].[Year]'  ;
              //  scope.getData();
                
                
             }

             
            $rootScope.getConsolidatedData = function(){
               
               

                console.log("changed the slider in the component", $rootScope.minValue, $rootScope.maxValue);
                $rootScope.defaults.refresh = true;
                $timeout(
                    function(){
                        $rootScope.defaults.refresh = false;
                       
                    },100

                )
                 
            }
      
             
             scope.consolidatedRowValue = function(cells){
                 var returnConsol = 0;
                 _.forEach(cells,function(el,rowIndex,arr){
                    returnConsol = returnConsol + arr[rowIndex].value ;
                 });
                 return returnConsol;
             }
 
             scope.createChart = function() {
              scope.loading = true;
                 $timeout(
                     function(){
                         
                        if(scope.chartLedgendsShow ){
                            var currentWidth =  scope.getElementWidth('c3chart'+scope.chartTargetId)+60;
                        }else{
                            var currentWidth =  scope.getElementWidth('c3chart'+scope.chartTargetId);
                        }
                      

                         var currentHeight =  scope.getElementHeight('c3chart'+scope.chartTargetId)-25;
                         if(scope.componentHeight != 'auto'){
                              if(currentHeight > scope.componentHeight  ){
                             
                            }else{
                                currentHeight  =  scope.componentHeight-35
                            }
                         }else{
                              currentHeight  =  300
                         }
                        
                         var config = {}; 
                         config.bindto = '#c3chart'+scope.chartTargetId;
                         config.size = {"height":currentHeight, 'width':currentWidth}
                         config.data = { onclick: function (d, element) { 
                              scope.chartDriverPosition[scope.chartTargetId] = d.x;
                                if(scope.chartType === 'pie'){ 
                               
                                $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartDimensionDriver, (d.id).split('_').join(' ')).then(function (result) {
                                    if (!result.failed) {
                                  
                                        //console.log('result', result);
                                         $rootScope.defaults[(scope.chartDriver)]  = result[0].Name;

                                 
                                    }   
                                });   
                          
                            }else{
                                
                                $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartDimensionDriver, scope.config.categories[d.x]).then(function (result) {
                                    if (!result.failed) {
                                        //console.log(result)
                                       $rootScope.minValue = d.x+1; 
                                       $rootScope.maxValue = d.x+1; 
                                       $rootScope.refreshSlider();
                                        $rootScope.defaults[(scope.chartDriver)]  = result[0].Name;
                                        
                                    }
                                });
                            }   
                           
                        }};
                        
                         config.data.json = {};
                         config.area = {};
                        
                         config.data.types =[];
                         config.data.json.data = [];
                         //console.log(scope.config.data, scope.table.data()[0]['cells'].length);
                         if(scope.groupSelect){
                            config.tooltip =  { 
                                "grouped": true
                                 
                        }               
                         }else{
                            config.tooltip =  { 
                                "grouped": false 
                                  }       
                         }
                         _.forEach(scope.config.data, function(element,index,array){
                             
                            //console.log('element = '+element+' : rowIndex = '+index+' : arr = '+array+'');
                            if(scope.dataset  && scope.dataset.headers[0].columns.length > 1){
                                if($rootScope.dimensionRowChartTypesOverride && $rootScope.dimensionRowChartTypesOverride[index] ){
                                 
                                    
                                    config.data.types[index] = $rootScope.dimensionRowChartTypesOverride[index];
                                    
                                   // console.log(JSON.parse($attributes.chartDimensionColors), "$rootScope.chartDimensionColors")
                                }else{
                                    config.data.types[index] = scope.chartType;
                                }
                                
                                  
                             }else{
                                 if(scope.chartType === 'line'){
                                     config.data.types[index] = 'bar' ;
                                    
                                      
                                 }else{

                                      config.data.types[index] = scope.chartType ;
                                      
                                 }
                                 
                                    
                             }
                             config.groups =  [
                                 scope.config.series[scope.chartTargetId]
                            ]
                             config.data.order =  'desc';
                             config.data.json[index] = element;

                              
                                 
                         }); 
                         // console.log(config.data.json, "data json" )
                         config.onresized =  function () { 
                            // console.log("resized")
                            
                                if(!scope.resize && !scope.loading && scope.table.data().length > 0 ){
                                    scope.resize = true;
                                    if(scope.table.data()[0]['cells'] != 'undefined' ){
                                        scope.createChart();
                                    }
                              
                                }
                        }
                        if(scope.hideXaxis === 'true'){
                            config.axis = {

                              
                                "x" : {
                                    "show":false,
                                   "type": "category", 
                                   "tick": { 
                                     
                                        "multiline": false, 
                                        "culling": {  "max": 10  }
                                   },
                                   "categories":scope.config.categories
                               },
                               "y":{
                                   "label":{
                                       "text":$rootScope.defaults.measure,
                                       "position":"inner-right"
                                    }, 
                                    
                                    "padding": {"top": 0, "bottom": 0}, 
                                    "tick": { "count": 2,   format: d3.format("s")}
                                    
                               }
                               
                           };
                        }else{
                             
                        if(scope.chartRotateAxis === true || scope.chartRotateAxis === 'true'){
                                config.axis = {

                                    "rotated":true,
                                    "x" : {
                                        
                                       "type": "category", 
                                       "tick": { 
                                            "multiline": false, 
                                            "culling": {  "max": 10  }
                                       },
                                       "categories":scope.config.categories
                                   },
                                   "y":{
                                       "label":{
                                           "text":$rootScope.defaults.measure,
                                           "position":"inner-right"
                                        }
                                   }
                                   
                               };
                            }else{  
                                
                                config.axis = {
                                    "rotated":false,
                                    "x" : {
                                       "type": "category", 
                                       "tick": { 
                                            "multiline": false, 
                                            "culling": {  "max": 10  }
                                       },
                                       "categories":scope.config.categories
                                   },
                                   "y":{
                                     
                                    "tick": {
                                        format: d3.format("s")
                                    },
                                       "label":{
                                           "text":$rootScope.defaults.measure,
                                           "position":"inner-right"}
                                   }
                               };
                            }
                        }
                         //console.log(scope.arrayOfGeneratedColor[scope.chartTargetId], "scope.chartTargetId")
                       
                            config.color =  {
                                "pattern": scope.arrayOfGeneratedColor[scope.chartTargetId]
                            } 
                        
                         
                         config.legend =  {
                             "show": false
                         }
                         if(scope.chartType === 'line' || scope.chartType === 'area'){
                         config.zoom =  {
                             "enabled": true,
                        
                         }  
                         }else{
                            config.zoom =  {
                                "enabled": false,
                                
                            }  
                         }
                         config.transition =  {
                            "duration": 0
                          }
                         
                         if(scope.dataset  && scope.dataset.headers[0].columns.length > 1){
                           //  console.log("config data", config.data.json)
                            // console.log("####### LENGTH > 2",scope.table.data()[0]['cells'].length )
                         }else{
                             config.data.labels= { format: { y: d3.format('$') } };
                             
                              
                         }
                         if($rootScope.useSlider === true || scope.sliderMode ){
                         if($rootScope.minValue === $rootScope.maxValue){
                            config.grid =  {  
                                "x":{ 
                                    "lines":[{"value": $rootScope.minValue-1, "text": '' }, {"value": $rootScope.maxValue-1, "text": ''+scope.config.categories[$rootScope.maxValue-1]  }] 
                                    }
                                    
                                }
                            }else{
                                config.grid =  {  
                                "x":{ 
                                    "lines":[{"value": $rootScope.minValue-1, "text": 'From:'+scope.config.categories[$rootScope.minValue-1] }, {"value": $rootScope.maxValue-1, "text": 'To:'+scope.config.categories[$rootScope.maxValue-1]  }] 
                                }
                                
                            }
                        }
                    }else{
                        config.grid =  {  
                            "x":{ 
                                
                                }
                                
                            }
                    }
                    $timeout(
                        function(){
                         if($rootScope.useSlider === true || scope.sliderMode){
                            if($rootScope.minValue === $rootScope.maxValue){
                                config.regions = [{start:-1, end:$rootScope.minValue-2},{start:$rootScope.maxValue, end:scope.table.data()[0]['cells'].length}];
                             }else{
                                config.regions = [{start:-1, end:$rootScope.minValue-1},{start:$rootScope.maxValue-1, end:scope.table.data()[0]['cells'].length}];
                             }
                         }
                         //config.data.groups=[['data1','data2']];
                        
                           
                         config.area = { zerobased: false};
                         scope.chart = c3.generate(config);	 
                         $rootScope.charts[scope.chartDriver] = scope.chart;
                         scope.loading = false;
                         scope.resize = false;
                         function toggle(id) {
                            if(scope.chart != null){
                             scope.chart.toggle(id);
                             $timeout(
                                 function(){
                                     $window.dispatchEvent(new Event("resize"));
                                 },100
                             )
                             
                            }
                         }
                        },2000
                    )
                         
                 
                     }
                 )
                 scope.seeData = function(data){
                 // console.log(data)
                 }
                 scope.mouseDblClickRowElement = function(rowElement, elementName){
                   console.log("DBL CLICKED", rowElement);
                    for(var dd = 0; dd < scope.config.series[scope.chartTargetId].length; dd++){
                        if(scope.config.series[scope.chartTargetId][dd] === elementName){
                             
                            scope.doubleClickedItem = elementName;
                             
                            
                        }else{
                            if(rowElement['elements'][0]['element']['level'] === 0){
                                if(scope.chart != null){
                                    scope.chart.toggle(scope.config.series[scope.chartTargetId][dd]);
                                }
                            }
                        }
                    }
                    if(rowElement['elements'][0]['element']['level'] != 0){
                        $rootScope.defaults[scope.chartRowDriver] =  rowElement['elements'][0]['element']['key'];
                    }
                    
                    
                }
                scope.getParentFromUniqueName = function(row, descript, key, uniqueName){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartRowDriver, key ).then(function(result){
                        if(!result.failed){
                           
                            if(result[0]['Parents'].length > 0){
                                  $rootScope.defaults[scope.chartRowDriver] = result[0]['Parents'][0].Name;
                                 //   console.log(result, "get Parent from quniqu id")
                            }
                          
                        
                    
                            
                        }
                        
                    });
                       
                }
               
                 scope.findaParent= function(row, descript, key, uniqueName){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartRowDriver, key ).then(function(result){
                        if(!result.failed){
                           
                            if(result[0]['Parents'].length > 0){
                                  $rootScope.defaults[scope.chartRowDriver] = result[0]['Parents'][0].Name;
                                    //console.log(result, "find Parent");
                                    return true
                            }else{
                                return false
                            }
                          
                        
                    
                            
                        }else{
                            return false
                        }
                        
                    });
                       
                }
                scope.removeLegends = function(){
                    scope.chartLedgendsShow = !scope.chartLedgendsShow;
                }
                scope.getTopUniqueName = function(uniqueName){
                   var returnVal = 'false'; 
                    if((uniqueName.split('^').length)-1 > 0){
                        returnVal = 'true'; 
                    }else{
                         returnVal = 'false'; 
                    }
                    if(returnVal === 'true'){
                        return true;
                    }else{
                        return false;
                    }
                }
                scope.groupSelected = function(){
                    if( scope.groupSelect  === true){
                        scope.groupSelect = false;

                    }else{
                        scope.groupSelect = true;
                   
                    }
                         scope.createChart();
                }
                scope.toogleChartElement = function(id) {
                    if(scope.chart != null){
                        scope.chart.toggle(id);
                    }
                    
                }
                 
                scope.mouseOverRowElement = function(id){
                    if(scope.chart != null){
                        if((id).split('^')[0] === (id).split('^')[1] ){
                            scope.chart.focus((id).split('^')[0]);
                        }else{
                            scope.chart.focus((id));
                        }
                    
                    }
                }
                scope.mouseOutRowElement = function(id) {
                    if(scope.chart != null){
                        if((id).split('^')[0] === (id).split('^')[1] ){
                         scope.chart.revert();
                        }else{
                            scope.chart.revert();
                        }

                    }
                }
                scope.mouseClickRowElement = function(id) {
                // console.log(id," clicked ")
                if(scope.chart != null){
                    if((id).split('^')[0] === (id).split('^')[1] ){
                    scope.toogleChartElement((id).split('^')[0]);
                    }else{
                        scope.toogleChartElement(id);
                    }
                }
                    
                };
                scope.setColumnElement = function(columnElement){
                    if(!scope.loading){

                         $rootScope.defaults[(scope.chartDriver)]  = columnElement;
                         
                    }
                   
                   
                
                }
            }
            scope.tableLedgendsShow = true;
            scope.getElementWidth = function(ID){
                if(document.getElementById('table'+scope.chartTargetId) != undefined && document.getElementById('table'+scope.chartTargetId) != 'undefined'){
                // scope.currentWidth = document.getElementById(ID).getBoundingClientRect().width;
                // return document.getElementById(ID).getBoundingClientRect().width;
                if(scope.chartLedgendsShow === true){
                    scope.currentWidth = document.getElementById('table'+scope.chartTargetId).getBoundingClientRect().width-110;
                
                    return document.getElementById('table'+scope.chartTargetId).getBoundingClientRect().width-110;
                }else{
                scope.currentWidth = document.getElementById('table'+scope.chartTargetId).getBoundingClientRect().width-40;
                
                return document.getElementById('table'+scope.chartTargetId).getBoundingClientRect().width-40;
                }
            }
        
            }
            scope.getElementHeight = function(ID){
                if(document.getElementById(ID) != undefined && document.getElementById(ID) != 'undefined'){
                    scope.currentHeight = document.getElementById(ID).getBoundingClientRect().height;
                    return document.getElementById(ID).getBoundingClientRect().height;
            
                }
         
            }
           
              
            
             
            scope.$watch(function () {
                return $rootScope.defaults.refresh
               
                }, function (newValue, oldValue) { 

                   if(newValue != oldValue && oldValue != undefined){
                        
                      
                      console.log(scope.mdxParam,  $rootScope.defaults[scope.chartRowDriver] )
                       
                       scope.getData();
                      
                   }
                   
                  
                  
           })
            scope.$watch(function () {
                 return $attributes.mdxParam;
                
                 }, function (newValue, oldValue) { 

                   
                         
                        scope.mdxParam =  JSON.parse(newValue);

                   
                        // console.log()
                        $timeout(
                            function(){
                                scope.getData();
                            },1000
                        )
                        
                       
                    
                    
                   
                   
            })
               scope.$watch(function () {
                 return $rootScope.defaults.decimalPlace;
                
                 }, function (newValue, oldValue) { 

                 
                        if(newValue != oldValue && newValue != null){
                                scope.decimalFormat =  (newValue+'');
                        }
                         //   scope.decimalFormatVal =  (newValue+'');
                         
                         $timeout(
                            function(){
                                scope.getData();
                            },1000
                        )
                   
                        
                        
                       
                    
                    
                   
                   
            })
             scope.reorderBy = function(toggleBol){
                // console.log("value show chart", toggleBol);
                 scope.sortBol = false;
                scope.tableOrdered = orderBy(scope.dataset.rows, scope.propertyName, scope.sortBol);
            
                scope.createChart();
             }

             scope.setChartType = function(type){
                scope.chartType = type;
                scope.createChart();
             }

            
            scope.tableRowTopCount = [];
            scope.setLedgends = function(){
                console.log(scope.chartLedgendsShow)
                scope.chartLedgendsShow = !scope.chartLedgendsShow;
            }
           
            scope.setUpScroll = function(){
                 
                $timeout(
                    function(){

                        //console.log("scroll set up", scope.chartTargetId,  $('#tableScroll'+scope.chartTargetId))
                        var rowTrArrayppp = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                        if(rowTrArrayppp.length > 0){
                             for(var ppp = 0; ppp < rowTrArrayppp.length; ppp++){
                           
                            if(rowTrArrayppp[ppp].getBoundingClientRect().top > 0 && rowTrArrayppp[ppp].getBoundingClientRect().top < 800){
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'visible';
                              
                             // document.getElementsByClassName('sideRow'+scope.chartTargetId)[ppp].style.visibility = 'visible';
                            }else{
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'hidden';
                              //console.log('hidden', ppp)
                             //document.getElementsByClassName('sideRow'+scope.chartTargetId)[ppp].style.visibility = 'visible';
                            }
                             scope.tableRowTopCount[ppp] = rowTrArrayppp[ppp].getBoundingClientRect().top;
                           //console.log(rowTrArray[uu].getBoundingClientRect().top, rowTrArray[uu].getBoundingClientRect() );
                        } 
                        }
                        
                        $('#tableScroll'+scope.chartTargetId).scroll(_.debounce(function(){
                         //console.log('SCROLLING!', $(this).scrollTop(), $(this).scrollLeft());
                         var rowTrArraykkk = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                        if(rowTrArraykkk.length > 0){
                            for(var kkk = 0; kkk < rowTrArraykkk.length; kkk++){
                            
                                if(rowTrArraykkk[kkk].getBoundingClientRect().top > 0 && rowTrArraykkk[kkk].getBoundingClientRect().top < 800){
                                document.getElementsByClassName('rowElement'+scope.chartTargetId)[kkk].style.visibility = 'visible';
                                // document.getElementsByClassName('sideRow'+scope.chartTargetId)[kkk].style.visibility = 'visible';
                                }else{
                                document.getElementsByClassName('rowElement'+scope.chartTargetId)[kkk].style.visibility = 'hidden';
                               // console.log('hidden', kkk)
                                //document.getElementsByClassName('sideRow'+scope.chartTargetId)[kkk].style.visibility = 'visible';
                                }
                                scope.tableRowTopCount[kkk] = rowTrArraykkk[kkk].getBoundingClientRect().top;
                            //console.log(rowTrArray[uu].getBoundingClientRect().top, rowTrArray[uu].getBoundingClientRect() );
                            } 
                        }
                        
                         
                        if(document.getElementById('fixedHeader'+scope.chartTargetId) !=  null){
                            document.getElementById('fixedHeader'+scope.chartTargetId).style.marginLeft = '-'+ $(this).scrollLeft()+'px';
                        }
                        if(document.getElementById('sidePanel'+scope.chartTargetId) != null){
                            document.getElementById('sidePanel'+scope.chartTargetId).style.marginTop = '-'+ $(this).scrollTop()+'px';
                        }
                      //  console.log($(this).scrollTop(),$(this).scrollLeft(), "scrolling")
                           
                            
                       }, 1, { 'leading': false, 'trailing': true })); 
                       
                       $('#tableScroll'+scope.chartTargetId).scroll(_.debounce(function(){
                          $timeout(
                             function(){
                              
                              var rowTrArray = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                              if(rowTrArray.length > 0){
                                for(var uu = 0; uu < rowTrArray.length; uu++){
                                    scope.tableRowTopCount[uu] = rowTrArray[uu].getBoundingClientRect().top;
                                    //console.log(rowTrArray[uu].getBoundingClientRect().top, rowTrArray[uu].getBoundingClientRect() );
                                }
                              }
                             
                              
                             }
                          )
                        
                    }, 150));
                    
                    },1000
                )
                    
                 
              
          }
          scope.sortBol = true;
          scope.sortBy = function(propertyName, decider) {
           // console.log(propertyName, scope.propertyName, "######")
            scope.sortBol = !scope.sortBol;
            scope.tableOrdered = orderBy(scope.dataset.rows, propertyName, scope.sortBol);
            scope.getLastFocus();
            scope.createChart();
           
          }
          scope.getDivByIdHeight = function(id){
            if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
              return    document.getElementById(id).getBoundingClientRect().height;
                
            }
             
        }
        scope.getDivByIdWidth = function(id){
            if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
              return    document.getElementById(id).getBoundingClientRect().width;
                
            }
             
        }
        scope.getDivByClassWidth = function(id){
            if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
              return    document.getElementsByClassName(id)[0].getBoundingClientRect().width;
                
            }
             
        } 
        scope.getDivByClassHeight = function(id){
            if( id != '' && document.getElementsByClassName(id)[0] != undefined && document.getElementsByClassName(id)[0] != 'undefined'){
              return    document.getElementsByClassName(id)[0].getBoundingClientRect().height;
                
            }
             
        }
            scope.getContainerWidth = function(id){
                if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
                    if(scope.chartLedgendsShow === true){
                        scope.componentWidth =  document.getElementById(id).getBoundingClientRect().width -40;
                    }else{
                        scope.componentWidth =  document.getElementById(id).getBoundingClientRect().width ;
                   
                    }

               
                }

            }
            scope.getContainerHeight = function(id){
                if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
                    scope.componentHeight =  document.getElementById(id).getBoundingClientRect().height - 50;
                    
                }
                 
            }
            scope.getComponentHeight = function(id){
                if( id != '' && document.getElementById(id) != undefined && document.getElementById(id) != 'undefined'){
                   return   document.getElementById(id).getBoundingClientRect().height -40;
                    
                }
                 
            }


            
     scope.cards = [
        {
            title: "escheresque-dark",
            icon:"",
            imageUrl:"https://subtlepatterns.com/patterns/escheresque_ste.png",
            description:"Sublte Pattern Source image below...",
            source: "https://subtlepatterns.com/escheresque-dark/"
        },
        {
            title: "dark sharp edges",
            icon:"",
            imageUrl:"https://subtlepatterns.com/patterns/footer_lodyas.png",
            description:"Sublte Pattern Source image below...",
            source: "https://subtlepatterns.com/dark-sharp-edges/"
        },
        {
            title: "Grey Washed Wall",
            icon:"",
            imageUrl:"https://subtlepatterns.com/patterns/grey_wash_wall.png",
            description:"Sublte Pattern Source image below...",
            source: "https://subtlepatterns.com/grey-washed-wall/"
        }
    ];
        scope.currentCard = {};
        
        scope.isCardRevealed = true;
        scope.flipCard = function() {
            scope.isCardRevealed = !scope.isCardRevealed;
            if(scope.isCardRevealed) {
                scope.generateCard();
            } else {
    
                scope.currentCard = {};
                /*            setTimeout(function() {
    //                scope.isBackHidden = !scope.isCardRevealed;
                }, 0.1 * 1000);
    */            
            }
            /*
            
                
    
            */
        }
        
        scope.generateCard = function() {
            scope.currentCard = {};
            var index = Math.floor((Math.random() * scope.cards.length) + 0);
             scope.currentCard = scope.cards[index];
        }
        scope.addRequest = function(aray,cell,tempElement){
            var request = {
                value: aray[cell], 
                instance:$rootScope.defaults.settingsInstance, 
                cube: scope.cubeName, 
                cubeElements:(tempElement.getAttribute("cellref")+'').split(',') 
                }
                
                scope.sendCellSetPutArray.push(request);
       }
       scope.focusedInputElementArray =[];
       scope.getFocus = function($event) {           
          scope.focusObj = $event.target.id;
          ////may be better to get the element array another way instead of from the dom
          var focusObjId = $event.target.getAttribute('cellref');
          scope.focusedInputElementArray =  document.getElementById($event.target.id).getAttribute('cellref');
        // console.log("add paste event listener",$event.target.id, focusObjId, scope.focusedInputElementArray , document.getElementById($event.target.id).getAttribute('cellref'))
       }
       scope.addEventListerToInput = function(id){
          // document.getElementById(id).addEventListener('paste', scope.handlePaste);
       }
       scope.getLastFocus = function() {  
           if(document.getElementById(scope.focusObj)){
              document.getElementById(scope.focusObj).focus(); 
           }  
       }
       scope.lostFocus = function($event) {  

          var focusObjOut = $event.target.id;
          scope.focusObj = ''; 
         // document.getElementById(focusObjOut).removeEventListener('paste', scope.handlePaste);
  
       }
        scope.handlePasteText = function($event) {
            var clipboardData, pastedData;
            var mainArrayObj = [];
            scope.sendCellSetPutArray = [];
            // Stop data actually being pasted into div
            $event.stopPropagation();
            $event.preventDefault();
          //console.log(scope.focusObj)
            var startRow = (scope.focusObj+'').split('-')[2];
            var columnRow = (scope.focusObj+'').split('-')[3];
            // Get pasted data via clipboard API
            
            clipboardData = $event.clipboardData || window.clipboardData || $event.originalEvent.clipboardData;
            if(clipboardData ){
              newpasteDataArray = [];
             pastedData = clipboardData.getData('Text');
             newpasteDataArray = pastedData.split(String.fromCharCode(13));

             // split rows into columns
         
             
             //var newpasteDataArray = (pastedData).split(/\r\n|\r|\n/g)
             
             // Do whatever with pasteddata
             for (i=0; i<newpasteDataArray.length; i++) {
                 
                 newpasteDataArray[i] = (newpasteDataArray[i]).split(String.fromCharCode(9));
                  
             }
              
             for (pp=0; pp<newpasteDataArray.length; pp++) {
                 
                var aray = newpasteDataArray[pp]
                
                 for (cell=0; cell< aray.length; cell++) {

                      if(document.getElementById('input-'+scope.chartTargetId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))){
                         var tempElement = document.getElementById('input-'+scope.chartTargetId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))
                          //console.log((parseInt(startRow)+parseInt(item)), (parseInt(columnRow)+parseInt(cell)), aray[cell] )
                        // console.log(tempElement);
                         if(tempElement != undefined && tempElement != null){
                             //console.log(tempElement.getAttribute("cellref") );
                             var elementArrayToUse = tempElement.getAttribute("cellref")
                             scope.addRequest(aray,cell,tempElement)
                         }else{
                         row = scope.nextAvailable(parseInt(startRow)+parseInt(pp), (parseInt(columnRow)+parseInt(cell)) )
                         if(row === 'none'){
         
                         }else{
                                 var tempElement = document.getElementById('input-'+scope.chartTargetId+'-'+(row)+'-'+(parseInt(columnRow)+parseInt(cell)))
                                 if(tempElement != undefined && tempElement != null){
                                 scope.addRequest(aray,cell,tempElement)
                                 }
                         }
                         
                         }
                      }
                      
                      
                      
                 }
                  
             }
     
             $tm1Ui.cellsetPut(scope.sendCellSetPutArray).then(function(result){
       
                if(result.success){
                    console.log("success ")
                  
                    $rootScope.defaults.refresh = true;
                    $timeout(
                        function(){
                        $rootScope.defaults.refresh = false;
                        
                        },100
                    ) 
        
                }else{
    
                }
            });
        }
        
    
             
    }

          scope.saveValue = function(value, lastvalue){
              var sendValue = [];
               
              if(value && value != null){
                if((value).indexOf('(') > -1){
                    var valCal = '-'+((value).split('(').join('')).split(')').join('');
 
                  }else{
                      var valCal = value;
                  }
                 if(   valCal === (lastvalue+'') ){
                    
                  }else{
                   
                    
                    var request = {
                        value: valCal, 
                        instance:$rootScope.defaults.settingsInstance, 
                        cube: scope.cubeName, 
                        cubeElements:(scope.focusedInputElementArray).split(',') 
                        }
                        sendValue.push(request);
                         // console.log(request, "######## saved")
                        $tm1Ui.cellsetPut(sendValue).then(function(result){
                          
                             if(result.success){
                              // console.log(result, "######## saved")
                              
                               $rootScope.defaults.refresh = true;
                                   $timeout(
                                       function(){ 
                                        $rootScope.defaults.refresh = false;
                                            
                                       },10
                                   )
                                    
                                 
                               
    
                             }else{
                
                             }
                        });
                  }
    
              }
             
                  
          }

 
          }
        };
    }]);
    
  
 })();