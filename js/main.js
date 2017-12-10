$(".loginButton").click(function (e) { 
    e.preventDefault();
    window.location.href = "./dashboard.html";    
});

$(document).ready(function(){
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        startDate: '-3d'
    });
});

$('.createClick').click(function (){
    location.href = 'createSvc.html';
});