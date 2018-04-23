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