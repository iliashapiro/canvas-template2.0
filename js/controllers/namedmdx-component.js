(function(){
    var app = angular.module('app');
    app.directive('namedmdxComponent', ['$log','$rootScope','$tm1Ui','$timeout','orderByFilter',   function($log, $rootScope,$tm1Ui,$timeout,orderBy) {
        return {
            templateUrl: 'html/namedmdx-component.html',
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
                drillDimension:'@',
                drillDimensionSubset:'@',
                className: '@',
                showChart:'@',
                hideChart:'@',
                chartPosition : '@',
                hideTable:'@',
                chartType:'@',
                chartColumnDriverDimensionName:'@',
                
                chartRowDriver:'@',
                chartRowDimensionDriver:'@',
                chartLedgendsShow:'@',
                chartRotateAxis:"@",
                chartRowDriverDimensionName:'@',
                chartLedgendPosition:'@',
                filterMode:'@',
                filterShowCells:'@',
                sliderMode:'@',
                justifyList:'@',
                multiSlider:'@',
                showSliderIfNot:'@',
                drillEnabled:'@',
                fromTo:'@',
                columnList:'@',
                columnListShowProgressBar:'@',
                columnListLeafOnly :'@',
                measure:"@"
          }, 
          link:function(scope, $elements, $attributes, directiveCtrl, transclude){
            scope.componentHeight = $attributes.componentHeight;
            scope.dimensionColumnWidth = $attributes.dimensionColumnWidth;
            scope.heading = $attributes.heading;
             scope.mdxId = $attributes.mdxId;
             scope.typeOptions=["bar","spline","line","area"];
             scope.colorArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
             
             scope.chart = null;
            scope.decimalFormat = $attributes.decimalFormatVal;
          //console.log(scope.decimalFormat, "format");
             scope.config = {};
             scope.config.data = {};
             scope.config.type = {};
             scope.config.categories = [];
             scope.config.series = [];
             scope.arrayOfGeneratedColor = [];
             scope.dimensionAlias = [];
             scope.chartColumnDriverDimensionNamePosition = [];
             scope.filterMode = $attributes.filterMode;
             scope.dimensionAlias =  JSON.parse($attributes.dimensionAlias);
             scope.cubename = $attributes.cubeName;
             scope.chartType = $attributes.chartType;
             scope.mdxParam = JSON.parse($attributes.mdxParam);
             scope.chartColumnDriverDimensionName = $attributes.chartColumnDriverDimensionName;
             
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
             scope.drillDimension = $attributes.drillDimension;
             scope.hideXaxis = $attributes.hideXaxis
             scope.sliderMode = $attributes.sliderMode;
             scope.justifyList = $attributes.justifyList;
             scope.multiSlider = $attributes.multiSlider;
             scope.showSliderIfNot = $attributes.showSliderIfNot;
             scope.chartLedgendPosition = $attributes.chartLedgendPosition;
             scope.drillEnabled = $attributes.drillEnabled;
             scope.drillDimensionSubset = $attributes.drillDimensionSubset;
             scope.fromTo = $attributes.fromTo;
             scope.columnList = $attributes.columnList;
             scope.columnListShowProgressBar = $attributes.columnListShowProgressBar;
             scope.columnListLeafOnly = $attributes.columnListLeafOnly;
             scope.measure = $attributes.measure;
             scope.rowDimensionAttribute = scope.dimensionAlias['alias'][scope.chartRowDriverDimensionName];
          
                 scope.getAttributeOfElement = function(dimension , key, attribute){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, dimension, key,  attribute).then(function(result){
                       if(result){
                        if(!result.failed){
                                    
                             
                            
                                 if($rootScope.dimensionAlias['alias'] && $rootScope.dimensionAlias['alias']  != null && $rootScope.dimensionAlias['alias'][dimension]){
                                  
                                     scope.indicatorXAxis[scope.chartTargetId]  =  result[0]['Attributes'][$rootScope.dimensionAlias['alias'][dimension]];
                                
                                 }else{
                                    scope.indicatorXAxis[scope.chartTargetId]  =  result[0]['Attributes']['Description'];
                                  
                                 }
                                 
                                   scope.findElementPosition(scope.indicatorXAxis[scope.chartTargetId],scope.config.categories );
                                    
                                
                      }
                      
                       }
                         
                    });
                       
                }
        
            if($rootScope.dimensionAlias['alias'] && $rootScope.dimensionAlias['alias']  != null && $rootScope.dimensionAlias['alias'][scope.chartColumnDriverDimensionName]){
             scope.getAttributeOfElement(scope.chartColumnDriverDimensionName, $rootScope.defaults[(scope.chartColumnDriverDimensionName).split(' ').join('_')], $rootScope.dimensionAlias['alias'][scope.chartColumnDriverDimensionName]);
            }else{
             scope.getAttributeOfElement(scope.chartColumnDriverDimensionName, $rootScope.defaults[(scope.chartColumnDriverDimensionName).split(' ').join('_')], 'Description');
            }
            
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
                 
                    if((index).toLowerCase() === (scope.chartColumnDriverDimensionName).toLowerCase() ){
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
             
 
             scope.setDrillDimension = function(dimensionSelected){
                scope.drillDimension = dimensionSelected;
                scope.drillElement = [];
                scope.getSubsets();
                scope.getData();
 
             }
             scope.setDrillDimensionSubset = function(subset){
                //console.log(subset, "Subset To change")
                scope.drillDimensionSubset = subset;
                scope.drillElement = [];
          
                scope.getData();
 
             }
                scope.filtereedDimensionListArray = [];
                $tm1Ui.cubeDimensions($rootScope.defaults.settingsInstance, scope.cubeName).then(function(result){
                if(result){
                   
                        scope.cubeDimensionsToDrill = result;
                         
                        for(var qq = 0 ; qq < scope.cubeDimensionsToDrill.length;qq++){
                            if(scope.cubeDimensionsToDrill[qq] === scope.chartColumnDriverDimensionName || scope.cubeDimensionsToDrill[qq] === scope.chartRowDriverDimensionName){
                                
                            }else{
                                scope.filtereedDimensionListArray.push(scope.cubeDimensionsToDrill[qq])
                               // console.log(scope.filtereedDimensionListArray);
                            }
                        }
                        
                }else{
                    bootbox.confirm({
                        title: "Error check Cube Name!",
                        message: result.message.message,
                         
                        callback: function (result) {
                             
                        }
                    });
                }
               
                
                  
             });
             scope.getSubsets = function(){
                if(scope.drillEnabled === 'true'){
                    scope.filtereedDimensionSubsetListArray = [];
                    $tm1Ui.dimensionSubsets($rootScope.defaults.settingsInstance, scope.drillDimension).then(function(result){
                    if(result){
                      
                       
                            
                            console.log(result, "return description ", result, "dimension Subsets ")
                            scope.cubeDimensionsSubsetToDrill = result;        
                             for(var az = 0 ; az < scope.cubeDimensionsSubsetToDrill.length;az++){
                               
                                  scope.filtereedDimensionSubsetListArray.push(scope.cubeDimensionsSubsetToDrill[az])
                              
                              
                             }
                            
                    }else{
                        bootbox.confirm({
                            title: "Error check Cube Name!",
                            message: result.message.message,
                             
                            callback: function (result) {
                                 
                            }
                        });
                    }
                   
                    
                      
                 });
                 }
             }
            scope.getSubsets();
              
             scope.findRowFormat = function(rowName, rowkey, columnName, colkey){
              
                 if(($rootScope.percentageFormatElementArray).indexOf(rowName) > -1 || ($rootScope.percentageFormatElementArray).indexOf(rowName) > -1 || ($rootScope.percentageFormatElementArray).indexOf(rowkey) > -1 || ($rootScope.percentageFormatElementArray).indexOf(colkey) > -1 ){
                    
                     return 2;
 
                 }else{
                     return 0
                 }
               
             }
             scope.findElementPosition = function(nameToFind, arrayToLoop){
                var returnVal = ''
                for(var bb = 0; bb < arrayToLoop.length; bb++){
                       
                         if(arrayToLoop[bb] === nameToFind){
                        
                            returnVal = bb;
                         }
                };
                 
                scope.chartColumnDriverDimensionNamePosition[scope.chartTargetId] =  returnVal;
               if(scope.table != undefined){
                    scope.createChart();
               }
               
             }
               
             scope.getData = function(){
                $rootScope.loading = true;
                scope.loading = true;
                scope.config.data = {};
                scope.config.categories = [];
                        scope.config.series[scope.chartTargetId] = [];
                       scope.arrayOfGeneratedColor[scope.chartTargetId] = [];
                      if( $rootScope.defaults[(scope.chartRowDriverDimensionName).split(' ').join('_')] === scope.showSliderIfNot){
                        scope.hideXaxis = null;
                      }else{
                        scope.hideXaxis = 'true';
                      }
                 $tm1Ui.cubeExecuteNamedMdx($rootScope.defaults.settingsInstance, scope.mdxId, scope.mdxParam).then(function (result) {
                     if (!result.failed) {
                       
                         scope.dataset = $tm1Ui.resultsetTransform($rootScope.defaults.settingsInstance, scope.cubeName, result, scope.dimensionAlias);
                         _.forEach(scope.dataset.rows,function(el,rowIndex,arr){
                              
                                })
                         var options = { preload: false, watch: false, pageSize: 10000 };
                         if (scope.table) {
                             options.index = scope.table.options.index;
                             options.pageSize = scope.table.options.pageSize;
                         }
                         
                         //console.log(scope.dataset, "scope.dataset")
                         scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, options);
 
                        if(scope.sliderMode){
                            for(var hs = 0; hs < scope.dataset.headers[0].columns.length; hs++){
           
                                if( $rootScope.defaults[(scope.dataset.headers[0].columns[0].dimension+'').split(' ').join('_')]  === scope.dataset.headers[0].columns[hs].key ){
                                    // console.log( "slider result", $scope.dataset.headers[0].columns, $scope.table.data(), $scope.dataset.headers[0].columns[0].dimension, "gggggggg");
                                    var chosenIndex = hs+1;
                                        $rootScope.minValue =  chosenIndex;
                                        
                                        $rootScope.maxValue =  chosenIndex+1;
                                    
                                    } 
                                    
                            }
                            if(!$rootScope.minValue){
                                 
                                $rootScope.minValue = 1;  $rootScope.maxValue =  scope.dataset.headers[0].columns.length;
                            } 
 
                        }
                          
                        $rootScope.loading = false;
                         scope.loading = false;
                         scope.config.categories = [];
 
                         // console.log(scope.table.data());
                         
                         scope.columnString = [];
                         _.forEach(scope.dataset.headers,function(header,rowIndex,arr){
                             
                           _.forEach(header.columns,function(el,index,arr){
                               
                              if(scope.columnString[index] === null ||  scope.columnString[index] === 'undefined' ||  scope.columnString[index] === undefined){
                                 scope.columnString[index] = '';
                              }
                              
                              if($rootScope.dimensionAlias['alias'] && $rootScope.dimensionAlias['alias']  != null && $rootScope.dimensionAlias['alias'][el.dimension]){
                                   if(scope.columnString[index] === '' ){
                                    scope.columnString[index] =  el['element']['attributes'][$rootScope.dimensionAlias['alias'][el.dimension]]
                                  
                                   }else{
                                    scope.columnString[index] = scope.columnString[index] + '^' + el['element']['attributes'][$rootScope.dimensionAlias['alias'][el.dimension]]
                                  
                                   }
                                    
                                     
                                 
                                 //console.log('for every header the element description', rowIndex, el['element']['attributes']['Description'] )
                              }else{
                                 if(scope.columnString[index] === ''){
                                    scope.columnString[index] =   el['element'].key 
                                 }else{
                                    scope.columnString[index] = scope.columnString[index] + '^' + el['element'].key 
                                 }
                                     
                                    
                              }
                              
 
                          });
                          
                         
                        });
                         
                           scope.config.categories = scope.columnString
                        //   _.forEach(scope.dataset.headers[0].columns,function(el,rowIndex,arr){
                        //     if(el['element']['attributes']['Description'] != undefined){
                             
                        //     }else{
                        //        scope.config.categories.push(el['element'].key) 
                        //     }
                           
                        // });
                        scope.arrayOfGeneratedColor[scope.chartTargetId] = [];
                        
                        if($rootScope.dimensionAlias['alias'] && $rootScope.dimensionAlias['alias']  != null && $rootScope.dimensionAlias['alias'][scope.chartColumnDriverDimensionName]){
                                 
                         scope.getAttributeOfElement(scope.chartColumnDriverDimensionName, $rootScope.defaults[(scope.chartColumnDriverDimensionName).split(' ').join('_')], $rootScope.dimensionAlias['alias'][scope.chartColumnDriverDimensionName]);
                        }else{
                         scope.getAttributeOfElement(scope.chartColumnDriverDimensionName, $rootScope.defaults[(scope.chartColumnDriverDimensionName).split(' ').join('_')], 'Description');
                        }
                         _.forEach(scope.table.data(),function(el,rowIndex,arr){
 
                            scope.rowElementString = '';
                             _.forEach(arr[rowIndex]['elements'],function(elr,rowIndexr,arrr){
                               
                                if(arrr[rowIndexr]['element']['attributes'][$rootScope.dimensionAlias['alias'][elr.dimension]] != undefined){
                                  //console.log( arrr[rowIndexr]['element']['attributes']['Description'], arrr[rowIndexr]['element'].key, rowIndexr, "SERIES DESCRIPTION")
                                    if(scope.rowElementString === ''){
                                     if($rootScope.dimensionAlias['alias'] && $rootScope.dimensionAlias['alias']  != null && $rootScope.dimensionAlias['alias'][elr.dimension]){
                                        scope.rowElementString =  arrr[rowIndexr]['element']['attributes'][$rootScope.dimensionAlias['alias'][elr.dimension]];
                                     }else{
                                        scope.rowElementString =  arrr[rowIndexr]['element']['attributes'][$rootScope.dimensionAlias['alias'][elr.dimension]];
                                     }
                                    }else{
                                        scope.rowElementString =  scope.rowElementString +'^'+arrr[rowIndexr]['element']['attributes'][$rootScope.dimensionAlias['alias'][elr.dimension]];
                                    }
                                     
                                 }else{
                                
                                     if(scope.rowElementString === ''){
                                        scope.rowElementString = arrr[rowIndexr]['element'].key;
                                     }else{
                                        scope.rowElementString =  scope.rowElementString +'^'+arrr[rowIndexr]['element'].key;
                                     }
                                 }
                                
                                 
                                 
                            })
                            var lstRowElementString =  scope.rowElementString;
                            scope.config.series[scope.chartTargetId].push(scope.rowElementString);
                             
                            if(arr[rowIndex]['elements']['0']['element']['attributes'][$rootScope.dimensionAlias['alias'][arr[rowIndex]['elements']['0'].dimension]] != undefined){
                                var color= scope.hashCode((arr[rowIndex]['elements']['0']['element']['attributes'][$rootScope.dimensionAlias['alias'][arr[rowIndex]['elements']['0'].dimension]]+'').split(' ').join(''));
                            }else{
                                var color= scope.hashCode((arr[rowIndex]['elements']['0'].name+'').split(' ').join(''));
                            }
                            scope.arrayOfGeneratedColor[scope.chartTargetId].push(color);
 
                            if(scope.drillTable[el.index] != null && scope.drillElement[el.index] === true){
                                // console.log("row.index", scope.drillTable[el.index],el.index)
                                 
                                 scope.rowElementString = '';
                                
                                   _.forEach(scope.drillTable[el.index].data(),function(drillel,drillrowIndex,drillarr){
                                          _.forEach(drillarr[drillrowIndex]['elements'],function(drillElement,drillrowIndexElement,drillarrElement){
                                          if(drillarrElement[drillrowIndexElement]['element']['attributes'][$rootScope.dimensionAlias['alias'][drillarrElement[drillrowIndexElement].dimension]] != undefined){
                                             
                                             if(scope.rowElementString === ''){
                                                 scope.rowElementString =  drillarrElement[drillrowIndexElement]['element']['attributes'][$rootScope.dimensionAlias['alias'][drillarrElement[drillrowIndexElement].dimension]];
                                               }else{
                                                 scope.rowElementString =  scope.rowElementString +'^'+drillarrElement[drillrowIndexElement]['element']['attributes'][$rootScope.dimensionAlias['alias'][drillarrElement[drillrowIndexElement].dimension]];
                                              }
                                               
                                          }else{
                                          
                                               if(scope.rowElementString === ''){
                                                scope.rowElementString = drillarrElement[drillrowIndexElement]['element'].key;
                                                }else{
                                                  scope.rowElementString =  scope.rowElementString +'^'+drillarrElement[drillrowIndexElement]['element'].key;
                                               }
                                          }
                                         })
                                        
                                        scope.config.series[scope.chartTargetId].push(lstRowElementString+'^'+scope.rowElementString);
                                            if(drillarr[drillrowIndex]['elements']['0']['element']['attributes'][$rootScope.dimensionAlias['alias'][drillarr[drillrowIndex]['elements']['0'].dimension]] != undefined){
                                                    var colorDrill = scope.hashCode((drillarr[drillrowIndex]['elements']['0']['element']['attributes'][$rootScope.dimensionAlias['alias'][drillarr[drillrowIndex]['elements']['0'].dimension]]+'').split(' ').join(''));
                                            }else{
                                                var colorDrill = scope.hashCode((drillarr[drillrowIndex]['elements']['0'].name+'').split(' ').join(''));
                                            }
                                        scope.arrayOfGeneratedColor[scope.chartTargetId].push(colorDrill);
                                   })
 
                                   
                                
                                }  
                             
                            
                           
                         });
                         _.forEach(scope.table.data(),function(row,rowIndex,arr){
                            var nameToUse = ''; 
                          
                           
                                _.forEach(row.elements,function(el,index,arr){
                                    if(el['element']['attributes'][$rootScope.dimensionAlias['alias'][el.dimension]] != undefined){
                                    
                                        if(nameToUse === '' ){
                                            nameToUse =   el['element']['attributes'][$rootScope.dimensionAlias['alias'][el.dimension]]
                                        
                                        }else{
                                            nameToUse =  nameToUse  + '^' + el['element']['attributes'][$rootScope.dimensionAlias['alias'][el.dimension]]
                                        
                                        }
                                            
                                       
                                        
                                    }else{
                                        // console.log(arr[rowIndex]['elements']['0'].key, "#####")
                                        if(nameToUse=== ''){
                                            nameToUse =   el['element'].key 
                                        }else{
                                            nameToUse = nameToUse + '^' + el['element'].key 
                                        }
                                        
                                        
                                    }
                                });
                             scope.config.data[nameToUse] = [];
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
                             scope.config.type['type'+rowIndex] = [];
                             scope.config.type['type'+rowIndex ] = scope.chartType;
                             
 
                             
                            if(scope.drillTable[row.index] != null && scope.drillElement[row.index] === true){
                        
                                var rowElementStr = nameToUse;
                                
                                   _.forEach(scope.drillTable[row.index].data(),function(drillel,drillrowIndex,drillarr){
                                    rowElementStr = nameToUse;
                                    _.forEach(drillarr[drillrowIndex]['elements'],function(drillElement,drillrowIndexElement,drillarrElement){
                                          if(drillarrElement[drillrowIndexElement]['element']['attributes'][$rootScope.dimensionAlias['alias'][drillElement.dimension]] != undefined){
                                             
                                            if(rowElementStr === '' ){
                                                rowElementStr =   drillElement['element']['attributes'][$rootScope.dimensionAlias['alias'][drillElement.dimension]]
                                            
                                            }else{
                                                rowElementStr =  rowElementStr  + '^' + drillElement['element']['attributes'][$rootScope.dimensionAlias['alias'][drillElement.dimension]]
                                            
                                            }
                                               
                                          }else{
                                          
                                            if(rowElementStr=== ''){
                                                rowElementStr =   drillElement['element'].key 
                                            }else{
                                                rowElementStr = rowElementStr + '^' + drillElement['element'].key 
                                            }
                                          }
                                         })
                                         scope.config.data[rowElementStr] = [];
                                         for(var dddr = 0 ; dddr < drillarr[drillrowIndex]['cells'].length; dddr++){
                                            var temppercentVal =  ( (drillarr[drillrowIndex]['cells'][dddr].value) )* 100;
                                           var percentVal =   parseFloat(temppercentVal).toFixed(2)
                                               // console.log("percentVal", percentVal )
                                            if(scope.decimalFormat === '2'){
                                                
                                               scope.config.data[rowElementStr].push(percentVal);
                                            }else{
                                               scope.config.data[rowElementStr].push(parseInt(drillarr[drillrowIndex]['cells'][dddr].value));
                                            }
                                            
                                        }
                                        scope.config.type['type'+drillrowIndex] = [];
                                        scope.config.type['type'+drillrowIndex ] = scope.chartType;
                             
                                       
                                         
                                   })
 
                                 
                                
                                }  
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
                         $rootScope.applicationTriggerFindUser();
                         scope.loading = false;
                         $rootScope.loading = false;
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
                scope.mdxElements[scope.chartColumnDriverDimensionName] = '['+scope.chartColumnDriverDimensionName+'].['+scope.chartColumnDriverDimensionName+'].[Year]'  ;
              //  scope.getData();
                
                
             }
 
             
            $rootScope.getConsolidatedData = function(){
               
               
 
              //console.log("changed the slider in the component", $rootScope.minValue, $rootScope.maxValue);
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
                              scope.chartColumnDriverDimensionNamePosition[scope.chartTargetId] = d.x;
                                if(scope.chartType === 'pie'){ 
                               
                                $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartColumnDriverDimensionName, (d.id).split('_').join(' ')).then(function (result) {
                                    if (!result.failed) {
                                  
                                        //console.log('result', result);
                                        $rootScope.defaults[(scope.chartRowDriverDimensionName).split(' ').join('_')]  = result[0].Name;
 
                                 
                                    }   
                                });   
                          
                            }else{
                                var sttt = (scope.config.categories[d.x]+'').split('^')[(scope.config.categories[d.x]+'').split('^').length-1];
                                 console.log()
                                $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartColumnDriverDimensionName, sttt, $rootScope.dimensionAlias['alias'][scope.chartColumnDriverDimensionName]).then(function (result) {
                                    if (!result.failed) {
                                        //console.log(result)
                                       $rootScope.minValue = d.x+1; 
                                       $rootScope.maxValue = d.x+1;  
                                        $rootScope.defaults[(scope.chartColumnDriverDimensionName).split(' ').join('_')]  = result[0].Name;
                                        $rootScope.refreshSlider();
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
                                if(index.split('^').length > 1 && $rootScope.dimensionRowChartTypesOverride &&  !$rootScope.dimensionRowChartTypesOverride[index] ){
                                  
                                    for(var hhw = 0; hhw < index.split('^').length; hhw++){
                                        if($rootScope.dimensionRowChartTypesOverride && $rootScope.dimensionRowChartTypesOverride[index.split('^')[hhw]]  ){
                                            //console.log('^', index.split('^'),  $rootScope.dimensionRowChartTypesOverride[index.split('^')[hhw]] );
                                            config.data.types[index] =  $rootScope.dimensionRowChartTypesOverride[index.split('^')[hhw]];
                                        }else{
 
                                        }
                                    }
 
                                }else{
                                    if($rootScope.dimensionRowChartTypesOverride && $rootScope.dimensionRowChartTypesOverride[index]  ){
                                 
                                    
                                        config.data.types[index] = $rootScope.dimensionRowChartTypesOverride[index];
                                        
                                       // console.log(JSON.parse($attributes.chartDimensionColors), "$rootScope.chartDimensionColors")
                                    }else{
                                        config.data.types[index] = scope.chartType;
                                    }
                                }
                                 
                                
                                  
                             }else{
                                 if(scope.chartType === 'line'){
                                     config.data.types[index] = 'bar' ;
                                    
                                      
                                 }else{
 
                                     if($rootScope.dimensionRowChartTypesOverride && $rootScope.dimensionRowChartTypesOverride[index]  ){
                                  
                                     
                                        config.data.types[index] = $rootScope.dimensionRowChartTypesOverride[index];
                                        
                                     // console.log(JSON.parse($attributes.chartDimensionColors), "$rootScope.chartDimensionColors")
                                     }else{
                                           config.data.types[index] = scope.chartType;
                                     }
                                      
                                 }
                                 
                                    
                             }
                             if(config.data.types[index] === undefined || config.data.types[index] === 'undefined' ){
                               //console.log( config.data.types[index] ,  scope.chartType, scope.chartTargetId)
                               config.data.types[index] = scope.chartType;
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
                                           "text":scope.measure,
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
                                           "text":scope.measure,
                                           "position":"inner-right"}
                                   }
                               };
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
                         // config.grid =  {  
                         //    "x":{ 
                                
                         //        }
                                
                         //    }
                         if( scope.fromTo &&  scope.fromTo != null && scope.fromTo != undefined   ){
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
                    } 
                    $timeout(
                        function(){
                         if(scope.fromTo != null &&  $rootScope.useSlider === true ){
                            if(scope.table.data().length > 0 ){
                                config.regions = [{start:0, end:$rootScope.minValue-1},{start:$rootScope.maxValue-1, end:scope.table.data()[0]['cells'].length}];
                            }else{
                               // config.regions = [{start:-1, end:$rootScope.minValue-1},{start:$rootScope.maxValue-1, end:scope.table.data()[0]['cells'].length}];
                            }
                                 
                            
                         }
                         if($rootScope.dimensionRowChartElementsGrouped){
                            config.data.groups=[$rootScope.dimensionRowChartElementsGrouped];
                         }
                       
                        
                           
                         config.area = { zerobased: false};
                         scope.chart = c3.generate(config);	 
                         $rootScope.charts[scope.chartColumnDriverDimensionName] = scope.chart;
                        
                         scope.resize = false;
                         function toggle(id) {
                            if(scope.chart != null){
                             scope.chart.toggle(id);
                             scope.loading = false;
                             $timeout(
                                function(){
                             
                                 },1000
                             )
                             
                            }
                         }
                        },1000
                    )
                         
                 
                     }
                 )
                 scope.seeData = function(data){
                 // console.log(data)
                 }
                 scope.mouseDblClickRowElement = function(elementindex, rowElement, elementName){
 
                 
                    for(var dd = 0; dd < scope.config.series[scope.chartTargetId].length; dd++){
                        if(scope.config.series[scope.chartTargetId][dd] === elementName){
                             
                            scope.doubleClickedItem = elementName;
                             
                            
                        }else{
                            if(rowElement['elements'][elementindex]['element']['level'] === 0){
                                if(scope.chart != null){
                                    scope.chart.toggle(scope.config.series[scope.chartTargetId][dd]);
                                }
                            }
                        }
                    }
 
                    if(rowElement['elements'][elementindex]['element']['level'] != 0 && $rootScope.defaults[(rowElement.elements[elementindex].dimension).split(' ').join('_')] ){
 
                        $rootScope.defaults[(rowElement.elements[elementindex].dimension).split(' ').join('_')] =  rowElement['elements'][elementindex]['element']['key'];
                    }else{
                       if($rootScope.defaults[(rowElement.elements[elementindex].dimension).split(' ').join('_')]  ){
                           $rootScope.defaults[(rowElement.elements[elementindex].dimension).split(' ').join('_')] =  rowElement['elements'][elementindex]['element']['key'];
                       }else{
 
                       }
                     
                    }
                    
                    
                }
                scope.getParentFromUniqueName = function(row, descript, key, uniqueName){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartRowDriverDimensionName, key ).then(function(result){
                        if(!result.failed){
                           
                            if(result[0]['Parents'].length > 0){
                                $rootScope.defaults[(scope.chartRowDriverDimensionName).split(' ').join('_')] = result[0]['Parents'][0].Name;
                                 //   console.log(result, "get Parent from quniqu id")
                            }
                          
                        
                    
                            
                        }
                        
                    });
                       
                }
               
                 scope.findaParent= function(row, descript, key, uniqueName){
                        
                    $tm1Ui.dimensionElement($rootScope.defaults.settingsInstance, scope.chartRowDriverDimensionName, key ).then(function(result){
                        if(!result.failed){
                           
                            if(result[0]['Parents'].length > 0){
                                $rootScope.defaults[(scope.chartRowDriverDimensionName).split(' ').join('_')] = result[0]['Parents'][0].Name;
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
 
                         $rootScope.defaults[(scope.chartRowDriverDimensionName).split(' ').join('_')]  = columnElement;
                         
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
            scope.lookForRowElements = function(){
                $timeout(
                    function(){
                        var rowTrArrayppp = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                        if(rowTrArrayppp.length > 0){
                             for(var ppp = 0; ppp < rowTrArrayppp.length; ppp++){
                           
                            if(rowTrArrayppp[ppp].getBoundingClientRect().top > 0 && rowTrArrayppp[ppp].getBoundingClientRect().top < 800){
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'visible';
                              
                          
                            }else{
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'hidden';
                          
                            }
                             scope.tableRowTopCount[ppp] = rowTrArrayppp[ppp].getBoundingClientRect().top;
                           
                        } 
                        }
                    }
                ) 
            }
             scope.reorderBy = function(toggleBol){
                // console.log("value show chart", toggleBol);
                 scope.sortBol = false;
                scope.tableOrdered = orderBy(scope.dataset.rows, scope.propertyName, scope.sortBol);
            
                //scope.createChart();
             }
 
             scope.setChartType = function(type){
                scope.chartType = type;
                scope.createChart();
             }
 
            
            scope.tableRowTopCount = [];
            scope.setLedgends = function(){
              //console.log(scope.chartLedgendsShow)
                scope.chartLedgendsShow = !scope.chartLedgendsShow;
            }
           
            scope.setUpScroll = function(){
                 
                $timeout(
                    function(){
 
                        
                        var rowTrArrayppp = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                        if(rowTrArrayppp.length > 0){
                             for(var ppp = 0; ppp < rowTrArrayppp.length; ppp++){
                           
                            if(rowTrArrayppp[ppp].getBoundingClientRect().top > 0 && rowTrArrayppp[ppp].getBoundingClientRect().top < 800){
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'visible';
                              
                             
                            }else{
                              document.getElementsByClassName('rowElement'+scope.chartTargetId)[ppp].style.visibility = 'hidden';
                              
                            }
                             scope.tableRowTopCount[ppp] = rowTrArrayppp[ppp].getBoundingClientRect().top;
                            
                        } 
                        }
                        
                        $('#tableScroll'+scope.chartTargetId).scroll(_.debounce(function(){
                         //console.log('SCROLLING!', $(this).scrollTop(), $(this).scrollLeft());
                         var rowTrArraykkk = document.getElementsByClassName('rowElement'+scope.chartTargetId);
                        if(rowTrArraykkk.length > 0){
                            for(var kkk = 0; kkk < rowTrArraykkk.length; kkk++){
                            
                                if(rowTrArraykkk[kkk].getBoundingClientRect().top > 0 && rowTrArraykkk[kkk].getBoundingClientRect().top < 800){
                                document.getElementsByClassName('rowElement'+scope.chartTargetId)[kkk].style.visibility = 'visible';
                                
                                }else{
                                document.getElementsByClassName('rowElement'+scope.chartTargetId)[kkk].style.visibility = 'hidden';
                                
                                }
                                scope.tableRowTopCount[kkk] = rowTrArraykkk[kkk].getBoundingClientRect().top;
                            
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
          console.log("gotFocus", scope.focusObj)
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
          scope.lastFocusLostObj = $event.target.id;
          var focusObjOut = $event.target.id;
          scope.focusObj = ''; 
          $timeout(
             function(){
                if(scope.focusObj === '' && scope.sendValue.length > 0){
                  scope.saveValues()
                } 
               
             },500
          )
         // document.getElementById(focusObjOut).removeEventListener('paste', scope.handlePaste);
  
       }
       scope.drillTable = [];
       scope.drillDataset = [];
       scope.getDrillData = function(element,dimension,subSet, rowindex){
         
         
           var params = scope.mdxParam;
            params['parameters']["SelectedRow"] = element;
           params['parameters']["drillDimension"] = dimension;
 
           console.log(params, "drill parameters")
     
          $tm1Ui.cubeExecuteNamedMdx($rootScope.defaults.settingsInstance, 'drillRequest', params  ).then(function (result) {
             if (!result.failed) {
             
                 scope.drillDataset[rowindex] = $tm1Ui.resultsetTransform($rootScope.defaults.settingsInstance, scope.cubeName, result, scope.dimensionAlias);
                 
                 var options = { preload: false, watch: false, pageSize: 10000 };
                 if (scope.drillTable[rowindex]) {
                     options.index = scope.drillTable[rowindex].options.index;
                     options.pageSize = scope.drillTable[rowindex].options.pageSize;
                 }
                 
                 console.log(scope.drillDataset[rowindex], "scope.dataset")
                 scope.drillTable[rowindex] = $tm1Ui.tableCreate(scope, scope.drillDataset[rowindex].rows, options);
                 scope.getData();
                }else{
                   scope.loading = false;
                         $rootScope.loading = false;
                   $rootScope.applicationTriggerFindUser();
                }
       });
    }
          
       scope.drillElement = []; 
       scope.setDrill = function(rowindex, rowName, dimensionToDrillBy, subSetTUseOnDrill){
         
          if( scope.drillElement[rowindex]){
             scope.drillElement[rowindex] = false;
             scope.getData();
          }else{
               scope.drillElement[rowindex] = true;
              scope.drillDimensionElement = rowName;
              scope.drillDimension = dimensionToDrillBy;
            
             scope.getDrillData(rowName,dimensionToDrillBy,subSetTUseOnDrill, rowindex);
              console.log("set Drill", rowindex, rowName, dimensionToDrillBy);
          }
         
           
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
                 //   console.log("success ")
                  
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
    scope.handlePasteDrillText = function($event) {
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
 
                  if(document.getElementById('drillinput-'+scope.chartTargetId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))){
                     var tempElement = document.getElementById('drillinput-'+scope.chartTargetId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))
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
                                var tempElement = document.getElementById('drillinput-'+scope.chartTargetId+'-'+(row)+'-'+(parseInt(columnRow)+parseInt(cell)))
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
             //   console.log("success ")
              
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
    scope.sendValue = [];
         
    scope.saveValues = function(){
            
               
      if(scope.sendValue.length > 0 ){
        
             
                         
            
                
                   
                   
                        
                          // console.log(request, "######## saved")
                         $tm1Ui.cellsetPut(scope.sendValue).then(function(result){
                           
                              if(result.success){
                               // console.log(result, "######## saved")
                               
                                $rootScope.defaults.refresh = true;
                                    $timeout(
                                        function(){ 
                                         $rootScope.defaults.refresh = false;
                                         scope.sendValue = [];
                                        },100
                                    )
                                     
                                   }else{
 
                                     }
                                
     
                         });
               }else{
                  
               }
     
          
  }
    scope.saveDrillValue = function(value,lastvalue){
        if(value && value != null){
            if((value).indexOf('(') > -1){
                var valCal = '-'+((value).split('(').join('')).split(')').join('');
 
              }else{
                  var valCal = value;
              }
              console.log("last, value", lastvalue,  "   -  "  , value)
             if(   valCal === (lastvalue+'') ){
                
              }else{
                  
                var request = {
                             value: valCal, 
                             instance:$rootScope.defaults.settingsInstance, 
                             cube: scope.cubeName, 
                             cubeElements:(scope.focusedInputElementArray).split(',') 
                             } 
                             scope.sendValue.push(request);
                            
                             
                $timeout(
                   function(){
                    if(  scope.focusObj === '' ){
                       
                       
                          if(scope.sendValue.length > 0){
                             
                             $tm1Ui.cellsetPut(scope.sendValue).then(function(result){
                               
                                  if(result.success){
                                   // console.log(result, "######## saved")
                                   
                                    $rootScope.defaults.refresh = true;
                                        $timeout(
                                            function(){ 
                                             $rootScope.defaults.refresh = false;
                                             scope.sendValue = [];
                                            },10
                                        )
                                         
                                       }else{
                                       
                                        
                                        bootbox.confirm({
                                            title: "Error message!",
                                            message: result.message.message+' </br> Val To SAVE:'+(scope.sendValue).toString(),
                                             
                                            callback: function (result) {
                                                scope.sendValue = [];
                                                $rootScope.defaults.refresh = false;
                                                $timeout(
                                                    function(){ 
                                                     $rootScope.defaults.refresh = false;
                                                     scope.sendValue = [];
                                                    },10
                                                )
                                            }
                                        });
                                        
                                            
                                         }
                                    
         
                             });
                            }
                            }else{
                               
                                  }
                   },1000
                )
                                 
                     
                
              }
 
          }
    }
    scope.saveValue = function(value, lastvalue){
            
               
              if(value && value != null){
                if((value).indexOf('(') > -1){
                    var valCal = '-'+((value).split('(').join('')).split(')').join('');
 
                  }else{
                      var valCal = value;
                  }
                  console.log("last, value", lastvalue,  "   -  "  , value)
                 if(   valCal === (lastvalue+'') ){
                    
                  }else{
                    var request = {
                                 value: valCal, 
                                 instance:$rootScope.defaults.settingsInstance, 
                                 cube: scope.cubeName, 
                                 cubeElements:(scope.focusedInputElementArray).split(',') 
                                 } 
                                 scope.sendValue.push(request);
                                
                                 
                    $timeout(
                       function(){
                        if(  scope.focusObj === '' ){
                           
                              console.log(scope.focusObj, "Object")
                                if(scope.sendValue != null || scope.sendValue.length != 0){
                                    $tm1Ui.cellsetPut(scope.sendValue).then(function(result){
                                   
                                        if(result.success){
                                         // console.log(result, "######## saved")
                                         
                                          $rootScope.defaults.refresh = true;
                                              $timeout(
                                                  function(){ 
                                                   $rootScope.defaults.refresh = false;
                                                   scope.sendValue = [];
                                                  },10
                                              )
                                               
                                             }else{
                                              $rootScope.defaults.refresh = false;
                                                  scope.sendValue = [];
                                               }
                                          
               
                                   });
                                }
                                  // console.log(request, "######## saved")
                                
                                }else{
                                   
                                      }
                       },1000
                    )
                                     
                         
                    
                  }
    
              }
             
                  
          }
 
 
          }
        };
    }]);
    
  
 })();