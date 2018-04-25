$(function () {
    // var Map = require("./map");
    var Welcome = require('./welcome.js');
    var API = require('./API');
    var Templates = require('./Templates');

     if(window.location.href.indexOf('home') !== -1) {
        API.backendPost('/get_advertisements/', {type: 0}, function (err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
                initialiseLost(data);
                // Map.initialiseMap(data);
            }
            else
                alert("no data");
        });
    }

    var Pet = {
         "Песик": 0,
        "Котик": 1,
        "Інше": 2
    };

    function initialiseLost(data) {
        var $temp = $('.content');
        var $node;
        var $card;
        $temp.html('');

        var card = Templates.Card({pet: data});
        $card = $(card);
        var lost = Templates.Lost({title:'Загублені тварини', filter_distr: true});
        $node = $(lost);

        $temp.append($node);
        $("#cards").html($card);
        addListeners();
    }
    function changeLost(data) {
        var $temp = $('#cards');
        var card = Templates.Card({pet: data});
        $temp.html($(card));
    }

    function addListeners() {
        $("#district-select").change(function () {
            var x = $("#district-select").val();
            var res1 = {};
            if($("#pet-select").val() !== "Все")
                res1['pet'] = Pet[$("#pet-select").val()];
            if(x !== "Все")
                res1['district'] = x;
            res1['type'] = 0;

            API.backendPost('/get_advertisements/', res1, function (err, data) {
                if (!err) {
                    console.log(JSON.stringify(data));
                    changeLost(data);
                }
                else
                    alert("no data");
            });
        });
        $("#pet-select").change(function () {
            var x = Pet[$("#pet-select").val()];
            var res = {};

            if(x !== "Все")
                res['pet'] = x;
            if($("#district-select").val() !== "Все")
                res['district'] = x$("#district-select").val();
            res['type'] = 0;
            API.backendPost('/get_advertisements/', res, function (err, data) {
                if (!err) {
                    console.log(JSON.stringify(data));
                    changeLost(data);
                }
                else
                    alert("no data");
            });
        });
    }

    $('.btn-svg').each(function () {
        var
            $this = $(this),
            width = $this.outerWidth(),
            height = $this.outerHeight(),
            $svg = $this.find('svg'),
            $rect = $svg.find('rect'),
            totalPerimeter = width * 2 + height * 2;

        $svg[0].setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        $rect.attr('width', width);
        $rect.attr('height', height);
        $rect.css({
            "strokeDashoffset": totalPerimeter,
            "strokeDasharray": totalPerimeter
        });
    });

    // $("#myInput").on("keyup", function() {
    //     alert("fff");
    //     var value = $(this).val().toLowerCase();
    //     $(".row").filter(function() {
    //         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    //     });
    // });

    $('#exit').on('click', function () {
        API.backendPost('/logout/', null, function () {
            window.location.href = '/home';
        })
    });

    $('#post_adv').on('click', function () {
        var type = $('#typeOfAdv').prop('selectedIndex');
        var pet = $('#typeOfPet').prop('selectedIndex');
        var district = $("#district").find('option:selected').text();
        var name = $('#name').val();
        var text = $('#descr').val();
        var imgfile = $('#img_file')[0].files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var img = reader.result;
            var data = {
                'img': img,
                'type': type,
                'pet': pet,
                'district': district,
                'name': name,
                'text': text
            };
            API.backendPost('/post_adv/', data, function (err, data) {
                window.location.href = '/home';
            })
        };

        reader.readAsBinaryString(imgfile)
    });
    $('#myModal').click(function () {

        // $('#modal_window').append(code);
        // $('#close').click(function () {
        //     $('#modal_window').html('');
        // });
    });
    // $('#drop').on('click', function () {
    //     API.backendPost('/api/drop/', {}, function (err, data) {
    //         API.backendPost('/api/init/', {}, function (err, data) {
    //             if (!err)
    //                 Map.initialiseMap(data);
    //         });
    //     });
    // });
});