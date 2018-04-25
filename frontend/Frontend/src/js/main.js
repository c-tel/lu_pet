$(function () {
    var Welcome = require('./welcome.js');
    var API = require('./API');
    var Templates = require('./Templates');

     if(window.location.href.indexOf('home') !== -1) {
        API.backendPost('/get_advertisements/', {type: 0}, function (err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
                initialise(data, 'Загублені тварини', true);
            }
            else
                alert("no data");
        });
    } else if (window.location.href.indexOf('profile') !== -1) {

     }

    $('#lost').click(function () {
        API.backendPost('/get_advertisements/', {type: 0}, function (err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
                initialise(data, 'Загублені тварини', true);
            }
            else
                alert("no data");
        });
    });
    $('#found').click(function () {
        API.backendPost('/get_advertisements/', {type: 1}, function (err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
                initialise(data, 'Знайдені тварини', true);
            }
            else
                alert("no data");
        });
    });
    $('#good-hands').click(function () {
        API.backendPost('/get_advertisements/', {type: 2}, function (err, data) {
            if (!err) {
                console.log(JSON.stringify(data));
                initialise(data, 'Добрі руки', false);
            }
            else
                alert("no data");
        });
    });
    $('#contacts').click(function () {
        window.location.href = '/contacts';
    });
    $('#profile').click(function () {
        window.location.href = '/profile';
    });
    $('#exit').click(function () {
        API.backendPost('/logout/', null, function () {
            window.location.href = '/home';
        })
    });

    var Pet = {
         "Песик": 0,
        "Котик": 1,
        "Інше": 2
    };
    var Type = {
        'Загублені тварини': 0,
        'Знайдені тварини': 1,
        'Добрі руки': 2
    };

    function initialise(data, t, district) {
        var $temp = $('.content');
        var $node;
        var $card;
        $temp.html('');

        var lost = Templates.Lost({title: t, filter_distr: district, type: data.type});
        $node = $(lost);
        $temp.append($node);
        if(data) {
            var card = Templates.Card({pet: data});
            $card = $(card);
            $("#cards").html($card);
            addListeners();
        }

    }
    function change(data) {
        var $temp = $('#cards');
        if(data) {
            var card = Templates.Card({pet: data});
            $temp.html($(card));
        }
        else
            $temp.html('<div>Оголошень немає</div>');
    }

    function addListeners() {

        function updateFilters() {
            var res = {'type' : Type[$('#title').text()]};
            var distr = $("#district-select").val();
            var pet = $("#pet-select").val();
            if (distr !== "Все")
                res['district'] = distr;
            if (pet !== "Все")
                res['pet'] = Pet[pet];

            API.backendPost('/get_advertisements/', res, function (err, data) {
                if (!err) {
                    change(data);
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
// <a href="#" id="<%= pet[i].id%>" id="<%= pet.id%>" class="btn btn-primary feedback">Відгукнутися</a>
    $('#myModal').click(function () {

        // $('#modal_window').append(code);
        // $('#close').click(function () {
        //     $('#modal_window').html('');
        // });
    });
});