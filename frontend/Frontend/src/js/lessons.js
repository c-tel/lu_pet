var Templates = require('./Templates');
var Map = require('./map');
var $temp = $('#template');
var API = require('./API');

function grammarTemp(data) {
    $temp.html("");
    var html_code = Templates.Grammar_Lesson({title:data.title, sources:data.srcs});
    var $nodeGr = $(html_code);
    $nodeGr.find('.back-to-map').on('click',function () {
        $($temp).fadeOut(300, function () {
            API.backendPost('/api/init/', {}, function (err, data) {
                if (!err)
                    Map.initialiseMap(data);
                else alert('error');
            });
            $($temp).fadeIn(300);
        });
    });
    $temp.append($nodeGr);
}
function dictionaryTemp(data) {
    var numb = 0;
    drawWord(numb, data);
}
function drawWord(numb, data) {
    $temp.html("");
    var html_code = Templates.Dictionary_Lesson({title:data.title, word: data.dict[numb], length: data.dict.length, numb: numb});
    var $nodeD = $(html_code);
    $nodeD.find('.back-to-map').on('click',function () {
        $($temp).fadeOut(300, function () {
            API.backendPost('/api/init/', {}, function (err, data) {
                if (!err)
                    Map.initialiseMap(data);
                else alert('error');
            });
            $($temp).fadeIn(300);
        });
    });
    $nodeD.find('.fa-arrow-right').on('click', function () {
        if(numb < data.dict.length-1) {
            numb++;
            $('#dict-container').fadeOut(300, function () {
                drawWord(numb, data);
                $('#dict-container').fadeIn(300);
            });
        }
    });
    $nodeD.find('.fa-arrow-left').on('click', function () {
        if(numb) {
            numb--;
            $('#dict-container').fadeOut(300, function () {
                drawWord(numb, data);
                $('#dict-container').fadeIn(300);
            });
        }
    });
    $temp.append($nodeD);
}

exports.grammarTemp = grammarTemp;
exports.dictionaryTemp = dictionaryTemp;