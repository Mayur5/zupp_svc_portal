$(".loginButton").click(function (e) { 
    e.preventDefault();
    window.location.href = "./dashboard.html";    
});

$(document).ready(function(){
    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });
});