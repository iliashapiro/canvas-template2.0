var app = angular.module('app');
app.directive('myBulletChart', ['$log','$rootScope', '$tm1Ui', '$timeout','$filter', '$window', function($log, $rootScope, $tm1Ui, $timeout, $filter, $window) {
    return {
        templateUrl: 'html/myBulletChart.html',
        scope:{  
            cubeName:'@', 
            title:'@',
            idName:'@',
            mdxId:"@",
            mdxParam:'@',  
            driver:"@",
            dimensionAlias:"@",
            columnHeaderArray:"@",
            colorArray:"@"
        }, 
        link:function(scope, $elements, $attributes, directiveCtrl, transclude){
            
            scope.defaults = {  
                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
                monthkey: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] };
                scope.cubeName = $attributes.cubeName;
                scope.mdxId=$attributes.mdxId;
                scope.title = $attributes.title;
                scope.idName = $attributes.idName;
                scope.mdxParam = JSON.parse($attributes.mdxParam);
                scope.dimensionAlias = JSON.parse($attributes.dimensionAlias);
                scope.columnHeaderArrayTranformed = ($attributes.columnHeaderArray).split(',');
                scope.colorArrayTransformed = ($attributes.colorArray).split(',');
                console.log("Params bullet: ",scope.mdxParam, "alias: ", scope.dimensionAlias, scope.columnHeaderArrayTranformed[0]);
       
        var tooltip = d3.select("body")
               .append("div")
               .attr("class", "ttip")
               .style("position", "absolute")
               .style("z-index", "10")
               .style("visibility", "hidden")
               .style("background", "#fff")
               .style("box-shadow"," 5px 10px 8px  rgba(0,0,0,0.3)")
               .style("padding", "0px")
               .style("width", "250px")
               .style("color", "#000")
               .text("a simple tooltip");  
     
        if(document.getElementById(scope.idName )){ 
            scope.containerWidth = document.getElementById(scope.idName).getBoundingClientRect().width;
        }else{
            scope.containerWidth = 800;
        } 
        var margin = {top: 5, right: 40, bottom: 20, left: 220}, 
        width = scope.containerWidth - margin.left - margin.right, 
        height = 50 - margin.top - margin.bottom;

        scope.chart = d3.bullet().width(width).height(height);
        
        
        scope.getData = function(){
            console.log("GET DATA")
            $tm1Ui.cubeExecuteNamedMdx($rootScope.defaults.settingsInstance,scope.mdxId, scope.mdxParam  ).then(function (result) {
                if (!result.failed) {
                
                    scope.dataset = $tm1Ui.resultsetTransform($rootScope.defaults.settingsInstance, scope.cubeName, result, scope.dimensionAlias);
                    
                    var options = { preload: false, watch: false, pageSize: 10000 };
                    if (scope.table) {
                        options.index = scope.table.options.index;
                        options.pageSize = scope.table.options.pageSize;
                    }
                   
                 //   console.log(scope.dataset, "scope.dataset")
                    scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, options);
                   // console.log(scope.table.data(),"DATA FROM TM1");
                   var currentBulletDataset = [];
                   
                    _.forEach(scope.table.data(), function(el,index,arr){
                        var minV = scope.getMinValue(el.cells);
                        var maxV = scope.getMaxValue(el.cells);
                        console.log(el,index, minV, maxV ,"data ")
                        currentBulletDataset.push({"title": el.elements[0].element.attributes['Description'] ,"subtitle":el.elements[0].dimension,"ranges":[parseInt(el.cells[1].value)],"measures":[parseInt(el.cells[1].value)],"markers":[parseInt(el.cells[2].value)]})
                    })
                    // $rootScope.bulletData = [
                    //     {"title":"Revenue","subtitle":"US$, in thousands","ranges":[300],"measures":[270],"markers":[250]},
                    //     {"title":"Profit","subtitle":"%","ranges":[30],"measures":[23],"markers":[26]},
                    //     {"title":"Order Size","subtitle":"US$, average","ranges":[600],"measures":[320],"markers":[550]},
                    //     {"title":"New Customers","subtitle":"count","ranges":[2500],"measures":[1650],"markers":[2100]},
                    //     {"title":"Satisfaction","subtitle":"out of 5","ranges":[5],"measures":[4.7],"markers":[4.4]}
                    //   ]  ;
                    scope.dataReadyForChart( currentBulletDataset );
                }else{
                 
   
                }
            });
        }
        scope.getMinValue = function(values){
            var arrayMinNumbers = [];
            for(var bbcc = 0; bbcc < values.length;bbcc++){
                arrayMinNumbers.push(values[bbcc].value)
            }
            return  Math.min.apply(null, arrayMinNumbers)  
            

        }
        scope.getMaxValue = function(values){
            var arrayNumbers = [];
            for(var bb = 0; bb < values.length;bb++){
                arrayNumbers.push(values[bb].value)
            }
            return  Math.max.apply(null, arrayNumbers)  
            

        }
        scope.dataReadyForChart = function(data){
        if(document.getElementById(scope.idName)){
            document.getElementById(scope.idName).innerHTML = '';
        }
         
        var margin = {top: 5, right: 40, bottom: 20, left: 220};
        width = scope.containerWidth - margin.left - margin.right;
        height = 50 - margin.top - margin.bottom;
      scope.chart = d3.bullet()
        .width(width)
        .height(height);
      
        var svg = d3.select('#'+scope.idName).selectAll("svg")
        
        .data(data)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(scope.chart)
        .on("mouseover", function(d){tooltip.html(
            '<h5 class="col-md-12 col-xs-12" style="color:#333; font-weight:600;margin:0px; padding:10px; background-color:white; border-bottom:thin solid #333;">'+scope.driver+' : '+d['title']+
              ' </h5> '+''+
              ' </p> <p class="col-md-12 col-xs-12" style=" font-weight:600; padding:5px; padding-left:10px; padding-right:10px;  margin:0px;  border-bottom: 2px solid '+scope.colorArrayTransformed[0]+'"> '+scope.columnHeaderArrayTranformed[0]+'  <span class="pull-right text-right">'+ $filter('number')(Math.round( d.measures ), 0)+ '</span>'+
              ' </p> <p class="col-md-12 col-xs-12" style=" font-weight:600; padding:5px; padding-left:10px; padding-right:10px; margin:0px; border-bottom: 2px solid '+scope.colorArrayTransformed[1]+'  ">  '+scope.columnHeaderArrayTranformed[1]+' <span class="pull-right text-right">'+ $filter('number')(Math.round( d.ranges ), 0)+ '</span>'+
              ' </p> <p class="col-md-12 col-xs-12" style=" font-weight:600; padding:5px; padding-left:10px; padding-right:10px;  margin:0px; border-bottom: 2px solid '+scope.colorArrayTransformed[2]+'  "> '+scope.columnHeaderArrayTranformed[2]+'  <span class="pull-right text-right">'+  $filter('number')(Math.round(  d.markers ), 0)  + '</span>'+
   
              ' </p>');  return tooltip.style("visibility", "visible");})
          .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left", (event.pageX < scope.containerWidth/2 ? (event.pageX+10): (event.pageX+10)-300)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
; 
     
     var title = svg.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height / 2 + ")");
     
     title.append("text")
        .attr("class", "title")
        .text(function(d) { return d.title; });
     
     title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function(d) { return d.subtitle; });
     
     d3.selectAll("button").on("click", function() {
      svg.datum(randomize).call(chart.duration(1000)); // TODO automatic transition
     });
     
      
     
     }
     function randomize(d) {
     if (!d.randomizer) d.randomizer = randomizer(d);
     d.ranges = d.ranges.map(d.randomizer);
     d.markers = d.markers.map(d.randomizer);
     d.measures = d.measures.map(d.randomizer);
     return d;
     }
     
     function randomizer(d) {
     var k = d3.max(d.ranges) * .2;
     return function(d) {
     return Math.max(0, d + k * (Math.random() - .5));
     };
     }
     
     scope.customCurrency =  function(input, symbol, place){
      if(isNaN(input)){
     return input;
      } else {
        var symbol = symbol || '$';
        var place = place === undefined ? true : place;
        var val = input+'';
        val = val.replace(/,/g, "")
        input = "";
        val += '';
        x = val.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
     
        var rgx = /(\d+)(\d{3})/;
     
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
     
     input = x1 + x2;
        if(place === true){
          if(scope.formatPercentage){
                return input + "%";
          }else{
              return symbol + input+"K";
            
          }
        } else{
          if(scope.formatPercentage){
             return input + "%";
            }else{
              return input + symbol+"K";
            }
         
        }
      }
     } 
    
         
   
 
  
    scope.getData();
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
     scope.$watch('$root.innerWidth', function (newValue, oldValue) {
     
        if(newValue != oldValue){
            $timeout(
                function(){
                    console.log('inner width',newValue )
                    if(document.getElementById(scope.idName )){
           
                        scope.containerWidth = document.getElementById(scope.idName).getBoundingClientRect().width;
                    }else{
                        scope.containerWidth = newValue;
                    } 
                    scope.getData();
                    //console.log('period Changed to watched from inside bulletchart ', newValue);
                    
                } ,100
            );
        }
        
        
       
    }); 
     
         
      
     }}}]);