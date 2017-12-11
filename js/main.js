var baseUrl = 'http://ec2-18-221-181-136.us-east-2.compute.amazonaws.com:3000/api/';
var token = '';

$(".loginButton").click(function (e) { 
    e.preventDefault();

    $(this)[0].innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';
    $(this).attr('disabled', 'disabled');

    var email = $('.dealerId').val();
    var password = $('.dealerPassword').val();

    if(email == '' || password == ''){
    	Materialize.toast('Please enter valid login credentials!', 4000);
    	$(this)[0].innerHTML = 'ZUPP!';
    }
    else{
    	var data = {"email":email, "password":password};

	    $.ajax({
	    	url: baseUrl + 'login/v/',
	    	type: "POST",
	        contentType: "application/json",
	        crossDomain: true,
	        data: JSON.stringify(data),
	        success: function(result){
	        	if(result.status == 'success'){
	        		token = result.data;
	        		console.log('token', result.data);
	        		localStorage.setItem('token', token);
	        		window.location.href = './dashboard.html';
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error');
	        }
	    });  
    } 
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

$('.logoutBtn').click(function(){
	token = '';
	location.href = 'index.html';
});

$('.saveBtn').click(function(e){
	e.preventDefault();

	var token = localStorage.getItem('token');

	var customerName = $('.name').val();
	var customerEmail = $('.email').val();
	var customerPhoneNumber = $('.mobileNumber').val();
	var customerLicenseNo = $('.licenseNumber').val();
	var add1 = $('.add1').val();
	var add2 = $('.add2').val();
	var add3 = $('.add3').val();
	var address = add1 + ' ' + add2 + ' ' + add3;
	var city = $('.city').val();
	var pincode = $('.pincode').val();
	var planId = '5a1931b3bc2076633c9e44a4';

	var logo = '<div class="logo printLogo"><img src="img/Zupp web_Logo.png" alt="ZUPP" /></div>';
	var header = '<div class="printHeader"><h2 class="printHeading">SVC Details</h2></div><div class="mainDivPrint">';
	var nameDiv = '<div class="personalDetailsPrint"><div id="custName" class="printText">Name<br/><div class="printValue">'+customerName+'</div></div>';
	var emailDiv = '<div id="custEmail" class="printText">email<br/><div class="printValue">'+customerEmail+'</div></div>';
	var phoneDiv = '<div id="custNumber" class="printText">Mobile Number<br/><div class="printValue">'+customerPhoneNumber+'</div></div>';
	var licenseNumberDiv = '<div id="custLicenseNumber" class="printText">License Number<br/><div class="printValue">'+customerLicenseNo+'</div></div></div>';
	var addressDiv = '<div class="addressDetailsPrint"><div class="printText">Address<br/><div class="printValue">'+add1+'<br/>'+add2+'<br/>'+add3+'<br/>'+city+' - '+pincode+'</div></div></div></div>'
	var formDetails = logo + header + nameDiv + emailDiv + phoneDiv + licenseNumberDiv + addressDiv;
	

	var data = {"planId":planId, "customerName": customerName, "customerEmail":customerEmail, "customerPhoneNumber":customerPhoneNumber, "customerLicenseNo":customerLicenseNo, "address":address, "city":city, "pincode":pincode}

	$.ajax({
    	url: baseUrl + 'SVC',
    	type: "POST",
        contentType: "application/json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer "+token);
        },
        data: JSON.stringify(data),
        success: function(result){
        	console.log('result', result);
        	if(result.status == 'success'){
        		var printContents = formDetails;
			    var originalContents = document.body.innerHTML;

			    document.body.innerHTML = printContents;
				window.print();

			    document.body.innerHTML = originalContents;
			    location.href = 'svc.html';
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    }); 

});