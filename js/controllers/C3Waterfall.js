app.controller('C3WaterfallCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui', function($scope, $rootScope, $log, $tm1Ui) {
   /*
    *     defaults.* are variables that are declared once and are changed in the page, otherwise known as constants in programming languages
    *     lists.* should be used to store any lists that are used with ng-repeat, i.e. tm1-ui-element-list
    *     selections.* should be used for all selections that are made by a user in the page
    *     values.* should store the result of any dbr, dbra or other values from server that you want to store to use elsewhere, i.e. in a calculation
    * 
    *     For more information: https://github.com/cubewise-code/canvas-best-practice
    */
    
    $scope.defaults = {};
    $scope.selections = {};
    $scope.lists = {};
    $scope.values = {};
    var MIN = 0;
var MAX = 220;

var chart = c3.generate({
    data: {
        order   : null,
        columns : [
            ['data1', 0, 33, 33, 49, 89, 0],
            ['data2', 66, 33, 16, 40, 26, 115],
            ['data3', 200,200,200,200,200,200],
        ],
        type    : 'bar',
        types   : {
            data3: 'line'
        },
        colors  : {
            data1 : '#fff',
            data3 : '#000',  
            data2 : ''
        },
        classes: {
            data3: 'hide-line',
        },
        groups: [
            ['data1', 'data2']
        ],
        labels: {
            format: function (v, id, i, j) {
                if(id === 'data3') {
                    return v;
                }
            }
        },
        
    },
    bar: {
        width: {
            ratio: 0.4 // this makes bar width 50% of length between ticks
        }
    },
    axis: {
        x: {
            type: 'category',
            categories: ['Pianificato', 'In Preparazione off.', 'In Attessa fidi/cond.', 'In Attesa pres. finale', 'In Valutazione cliente', 'TOT']
        },
        y : {
            tick: {
                values: [MIN, MAX],
                format: function(d) {
                    if(d === MIN) {
                        return 'MOL Atteso'
                    }
                    if(d === MAX) {
                        return 'Azioni'
                    }
                    return '';
                },
                outer: false,
                inner: false,
                count: 1
            }
        }
    },
    legend: {
        show: false
    },
    tooltip         : {
        show    : true,
        grouped : true,
        format  : {
            value : function(value){return value ? value.toFixed(0) + ' %' : '';}
        },
        contents : function(d){
            return '<div style="width:100px;height:50px;border:1px solid #ddd;padding:20px;background-color:#fff;color:#00adf0;">' + d[1].value + '</div>'
        } 
    },
    grid: {
      focus: {
        show: false
      }
    }
});
}]);
