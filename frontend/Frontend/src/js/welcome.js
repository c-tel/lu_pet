var API = require('./API');

$("#logup-butt").click(function () {
    var email = $('#signup-email').val();
    var login = $('#signup-name').val();
    var pwd = $('#signup-password').val();
    var data = {
        'email' : email,
        'username' : login,
        'password' : pwd,
        'email_dispatch' : true
    };
    if(login==='' || pwd===''){
        // $('.error').css('visibility', 'visible');
    }else {
        API.backendPost('/signup/', data, function (err, data) {
            if (!err) {
                if (data.status === "ok") {
                    window.location.href = "/home";
                }
            }
        })
    }
});

$("#login-butt").click(function () {
    var login = $('#signin-username').val();

    var pwd = $('#signin-password').val();
    var data = {
        'username' : login,
        'password' : pwd
    };
    API.backendPost('/login/', data, function (err, data) {
        if(!err){
            if(data.status==="ok")
                window.location.href = "/home";
            else {
                alert('Error');
                //$('#error').css('visibility', 'visible');
            }
        }
        else
            alert('Error');
    })
});

$(".change-form").click(function () {
    if($("#in").hasClass('is')){
        $("#in").hide();
        $("#in").removeClass('is');

        $("#up").show();
        $("#up").addClass('is');
    }
    else {
        $("#up").hide();
        $("#up").removeClass('is');

        $("#in").show();
        $("#in").addClass('is');
    }
});
// $('#signup-username').on('input', function () {
//     validateUsername($('#signup-username').val());
// });
// function validateUsername(username) {
//     var data = {
//         username : username
//     };
//     API.backendPost('/validate_username/',data, function (err, data) {
//         if(!err){
//             var danger = $('.danger');
//             if(!data.valid)
//                 danger.css('visibility', 'visible');
//             else
//                 danger.css('visibility', 'hidden');
//         }
//         else
//             alert('Error');
//     })
// }