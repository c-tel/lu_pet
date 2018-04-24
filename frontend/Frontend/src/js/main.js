$(function() {
    // var Map = require("./map");
    var Welcome = require('./welcome.js');
    var API = require('./API');
    var Templates = require('./Templates');

    //  if(window.location.href.indexOf('home') !== -1) {
    //     API.backendPost('/api/init/', {}, function (err, data) {
    //         if (!err)
    //             Map.initialiseMap(data);
    //     });
    // }

    $('.btn-svg').each(function(){
        var
            $this = $(this),
            width = $this.outerWidth(),
            height = $this.outerHeight(),
            $svg = $this.find('svg'),
            $rect = $svg.find('rect'),
            totalPerimeter = width*2+height*2;

        $svg[0].setAttribute('viewBox', '0 0 '+width+' '+height);
        $rect.attr('width', width);
        $rect.attr('height', height);
        $rect.css({
            "strokeDashoffset": totalPerimeter,
            "strokeDasharray": totalPerimeter
        });
    });

    $('#exit').on('click',function () {
       API.backendPost('/logout/', null,function () {
           window.location.href='/home';
       })
    });

    $('#post_adv').on('click',function () {
        var type = $('#typeOfAdv').prop('selectedIndex');
        var pet = $('#typeOfPet').prop('selectedIndex');
        var district = $("#district").find('option:selected').text();
        var text = $('#descr').val();
        var data = new FormData();
        data.append('img', $('#img_file')[0].files[0]);
        data.append('type', type);
        data.append('pet', pet);
        data.append('district', district);
        data.append('text', text);
        API.backendPost('/post_adv/', data, function (err, data) {
             window.location.href='/home';
        })
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