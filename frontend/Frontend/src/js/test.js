var Templates = require('./Templates');
var API = require('./API');
var Map = require('./map');
var $temp = $('#template');

function testTemp(data, bool) {
    var numb = 0;
    drawWordTest(numb, data, bool);
}

function findRightWord(data) {
    for(var i = 0; i<data.variants.length; i++) {
        if(data.variants[i] === data.correct)
            return i;
    }
}

function drawWordTest(numb, data, bool) {
    $temp.html("");
    var html_code;
    if(data.type === "grammar") {
        html_code = Templates.Grammar_Test({title: data.title, tests: data.tests[numb]});
    } else {
        html_code = Templates.Dictionary_Test({title: data.title, tests: data.tests[numb]});
    }
    var $nodeT = $(html_code);

    if(numb === 0)
        $nodeT.find('#prev-test').addClass('disabled');

    $nodeT.find('.back-to-map').on('click',function () {
        $($temp).fadeOut(300, function () {
            API.backendPost('/api/init/', {}, function (err, data) {
                if (!err)
                    Map.initialiseMap(data);
                else alert('error');
            });
            $($temp).fadeIn(300);
        });
    });

    $nodeT.find('#finish-test').click(function () {
        if(!bool) {
            API.backendPost('/api/finish/', {id: data.id}, function (err, data) {
                if (!err) {
                    API.backendPost('/api/init/', {}, function (err, data) {
                        if (!err)
                            Map.initialiseMap(data);
                    });
                }
            });
        } else {
            API.backendPost('/api/init/', {}, function (err, data) {
                if (!err)
                    Map.initialiseMap(data);
            });
        }

    });

    var rightId = findRightWord(data.tests[numb]);

    $nodeT.find('#check-test').on('click', function () {
        if(document.getElementById(rightId).checked === true ) {
            $nodeT.find('#help-block').text('Правильно!');
            $nodeT.find('#help-block').css('font-size', '18px');
            $nodeT.find('#help-block').css('color', '#448D76');
            $nodeT.find('#help-block').css('visibility', 'visible');
            if(data.type === 'dict') {
                API.backendPost('/api/rec_w/', {id: data.tests[numb].id}, function (err, data) {
                    if (!err) {
                    }
                });
            }
            if (numb === data.tests.length - 1) {
                $nodeT.find('#check-test').hide();
                $nodeT.find('#finish-test').show();
            } else {
                $(this).attr('disabled', true);
                setTimeout(function () {
                    numb++;
                    $('.test').fadeOut(300, function () {
                        drawWordTest(numb, data, bool);
                        $('.test').fadeIn(300);
                    });
                }, 1100);
            }
        } else {
            $nodeT.find('#help-block').css('visibility', 'visible');
        }
    });

    $nodeT.find('#prev-test').on('click', function () {
        if(numb) {
            numb--;
            $('.test').fadeOut(300, function () {
                drawWordTest(numb, data, bool);
                $('.test').fadeIn(300);
            });
        }
    });
    $temp.append($nodeT);
}

exports.testTemp = testTemp;