/*var MIN = 0;
var MAX = 220;

var chart = c3.generate({
    data: {
        order   : null,
        columns : [
            ['data1', 0, 66, 99, 115, 155, 0],
            ['data2', 66, 33, 16, 40, 26, 181],
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
}); */