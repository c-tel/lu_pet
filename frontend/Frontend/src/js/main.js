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

        function updateFilters() {
            var res = {'type' : 0};
            var distr = $("#district-select").val();
            var pet = $("#pet-select").val();
            if (distr !== "Все")
                res['district'] = distr;
            if (pet !== "Все")
                res['pet'] = Pet[pet];

            API.backendPost('/get_advertisements/', res, function (err, data) {
                if (!err) {
                    changeLost(data);
                }
                else
                    alert("no data");
            });
        }

        $("#district-select").change(function () {
            updateFilters()
        });
        $("#pet-select").change(function () {
            updateFilters();
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
        var fd = new FormData();
        fd.append('img', imgfile);
        fd.append('text', text);
        fd.append('pet', pet);
        fd.append('district', district);
        fd.append('type', type);
        fd.append('name', name);

        $.ajax({
            url: '/post_adv/',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                window.location.href = '/home';
            }
        });
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