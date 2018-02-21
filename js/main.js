var baseUrl = 'http://api.zuppbikes.com:3000/api/';
var token = '';
var code = '';
var user = '';

var doc = new jsPDF();

var currentPath = window.location.pathname.split('/')[1];

//login
$(".loginButton").click(function (e) { 
    e.preventDefault();

    $(this)[0].innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';
    $(this).attr('disabled', 'disabled');

    var email = $('.dealerId').val();
    var password = $('.dealerPassword').val();

    if(email == '' || password == ''){
    	Materialize.toast('Please enter valid login credentials!', 4000);
    	$(this)[0].innerHTML = 'ZUPP!';
    	$(this).attr('disabled', false);
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
	        		localStorage.setItem('token', token);
	        		window.location.href = './svc';
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	if(jqXHR.status == 500){
	        		Materialize.toast('Please enter valid credentials to login!', 4000);
	        		$('.loginButton')[0].innerHTML = 'ZUPP!';
    				$('.loginButton').attr('disabled', false);
	        	}
	        }
	    });  
    } 
});

//get params from url
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatDate(date){
	var initial = date.split(/\//);
	var newDate = ( [ initial[1], initial[0], initial[2] ].join('/'));

	var formatDate = new Date(newDate);
	return formatDate;
}

function formatNewDate(date){
	var currentTime = new Date(date);
	var date = currentTime.getDate();
	var month = currentTime.getMonth() + 1;
	var year = currentTime.getFullYear();

	var fullDate = date + '/' + month + '/' + year;
	return fullDate;
}

$(document).ready(function(){
	code = getParameterByName('c');
	user = getParameterByName('u');

	//set datepicker
	if($('.datepicker').length !== 0){
		$('.datepicker').datepicker({
	        format: 'dd/mm/yyyy',
	        startDate: '-3d',
	        autoclose: true
	    });
	}

    //set datepicker range
    if($('.input-daterange input').length !== 0){
	    $('.input-daterange input').each(function() {
		    $(this).datepicker({
		    	format: 'dd/mm/yyyy',
		    	autoclose: true
		    });
		});
	}

    //format date
    function checkDate(date){
    	var objDate = new Date(date), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    	
    	var currentTime = new Date(date);
		var date = currentTime.getDate();
		var year = currentTime.getFullYear();

		var fullDate = date + ' ' + month + ' ' + year;
		return fullDate;
    }

    var token = localStorage.getItem('token');
    if(token !== ''){

    	//get single svc details
	    var svcId = localStorage.getItem('svcToken');
	    if(svcId !== ''){
	    	$.ajax({
		    	url: baseUrl + 'svc/'+svcId,
		    	type: "GET",
		        contentType: "application/json",
		        crossDomain: true,
		        beforeSend: function (xhr) {
		          xhr.setRequestHeader("Authorization", "Bearer "+ token);
		        },
		        success: function(result){
		        	if(result.status == 'success'){
		        		$('.svcDetailsDiv').append('<div class="personalDetailsPrint"><div class="printText">Name</div><div id="custName" class="printValue">'+result.data.customerName+'</div><div class="printText">email</div><div id="custEmail" class="printValue">'+result.data.customerEmail+'</div><div class="printText">Mobile Number</div><div id="custNumber" class="printValue">'+result.data.customerPhoneNumber+'</div><div class="printText">License Number</div><div id="custLicenseNumber" class="printValue">'+result.data.customerLicenseNo+'</div></div><div class="addressDetailsPrint"><div class="printText">Address</div><div id="custAddress" class="printValue">'+result.data.address+'</div><div class="printText">City</div><div id="custCity" class="printValue">'+result.data.city+'</div><div class="printText">Pincode</div><div id="custPincode" class="printValue">'+result.data.pincode+'</div></div>');

		        		$('.planDetailsDiv').append('<div class="printText">Plan Id</div><div id="custName" class="printValue">'+result.data.planId._id+'</div><div class="printText">Token</div><div id="custName" class="printValue">'+result.data.token+'</div>')
		        	}
		        },
		        error: function (jqXHR, textStatus, errorThrown) {
		        	console.log('error');
		        }
		    });
	    }

    	//get list of svc
    	$.ajax({
	    	url: baseUrl + 'svc?page=1&searchString=',
	    	type: "GET",
	        contentType: "application/json",
	        crossDomain: true,
	        beforeSend: function (xhr) {
	          xhr.setRequestHeader("Authorization", "Bearer "+ token);
	        },
	        success: function(result){
	        	if(result.status == 'success'){
	        		if(result.data.length == 0){
	        			if(currentPath == 'svc')
	        				Materialize.toast('No SVCs found!', 4000);
	        		}
	        		else{
	        			$('.tableBody').empty();

	        			$.each(result.data, function(key, val){
	        				$('.tableBody').append('<tr><th><a id="'+val._id+'" class="svcClick">'+val.token+'</a></th><th>'+val.customerName+'</th><th>'+val.customerPhoneNumber+'</th><th>'+formatNewDate(val.createdOn)+'</th><th>'+formatNewDate(val.expiryDate)+'</th><th>'+val.status+'</th><th><a id='+val._id+' class="btn viewDetailsBtn">View Details</a></th></tr>');
	        			});
	        		}
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error');
	        }
	    });

	    //get list of vehicles
	    /*$.ajax({
	    	url: baseUrl + 'vehicles?page=1',
	    	type: "GET",
	        contentType: "application/json",
	        crossDomain: true,
	        beforeSend: function (xhr) {
	          xhr.setRequestHeader("Authorization", "Bearer "+ token);
	        },
	        success: function(result){
	        	if(result.status == 'success'){
	        		if(result.data.length == 0){
	        			if(currentPath == '')
	        			Materialize.toast('No vehicles found!', 4000);
	        		}
	        		else{
	        			$('.dashboardMainContent').empty();

	        			$.each(result.data, function(key, val){
	        				$('.dashboardMainContent').append('<div class="garageCard"><img src='+val.image+' alt="Bike"><div class="cardText"><div class="gridRow1"><div class="regNo">'+val.registrationNumber+'</div></div><div class="gridRow2"><label class="cardLabel">Insurance Valid Till</label><div class="insuranceDate">'+checkDate(val.insuranceExpiry)+'</div><i class="material-icons insuranceDateEdit" data-toggle="modal" data-target="#insuranceDateModal">mode_edit</i></div><div class="gridRow3"><label class="cardLabel">PUC Valid Till</label><div class="pucDate">'+checkDate(val.emissionExpiry)+'</div><i class="material-icons pucDateEdit" data-toggle="modal" data-target="#pucDateModal">mode_edit</i></div><div class="gridRow4"><label class="cardLabel">Last Serviced On</label><div class="serviceDate">'+checkDate(val.lastServiceDate)+'</div><i class="material-icons serviceDateEdit" data-toggle="modal" data-target="#serviceDateModal">mode_edit</i></div><div class="gridRow5"><label class="cardLabel">Status</label><div class="currentStatus">'+val.status+'</div></div></div><button class="zuppNowBtn">ZUPP Now!</button></div>');
	        				$('.selectVehicle').append('<option value="'+val.id+'">'+val.registrationNumber+'</option>');
	        			});
	        		}
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error');
	        }
	    });*/

	    //get svc report
	    $.ajax({
	    	url: baseUrl + 'report/svc',
	    	type: "GET",
	        contentType: "application/json",
	        crossDomain: true,
	        beforeSend: function (xhr) {
	          xhr.setRequestHeader("Authorization", "Bearer "+ token);
	        },
	        success: function(result){
	        	if(result.status == 'success'){
	        		$('.svcSold')[0].innerHTML = result.data.totalSVCSalesCount;
	        		$('.salesTotal')[0].innerHTML = result.data.totalSVCSales + '/-';
					$('.activeTotal')[0].innerHTML = result.data.totalActiveSVC;        		
					$('.claimedTotal')[0].innerHTML = result.data.totalClaimedSVC;
					$('.expiredTotal')[0].innerHTML = result.data.totalExpiredSVC;
	        		$('.vehicleStatusDiv').append('<div class="regNoDiv"><div class="regNoLabel">Total Active SVC</div><div class="regNo svcSold">'+result.data.totalActiveSVC+'</div></div><div class="regNoDiv"><div class="regNoLabel">Total Claimed SVC</div><div class="regNo svcSold">'+result.data.totalClaimedSVC+'</div></div><div class="regNoDiv"><div class="regNoLabel">Total Expired SVC</div><div class="regNo svcSold">'+result.data.totalExpiredSVC+'</div></div>');
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error');
	        }
	    });

	    //get plans list
	    $.ajax({
	    	url: baseUrl + 'plans',
	    	type: "GET",
	        contentType: "application/json",
	        crossDomain: true,
	        beforeSend: function (xhr) {
	          xhr.setRequestHeader("Authorization", "Bearer "+ token);
	        },
	        success: function(result){
	        	if(result.status == 'success'){
	        		$.each(result.data, function(key, val){
	        			$('.plansDiv').append('<div class="planCard"><div class="planNumberCircle"><img class="planCircle" src="img/Zupp web_Circle plans.png" /><p class="planText selectPlanText">'+(key+1)+'</p></div><div class="planLogo"><img class="zuppLogo img-responsive" src="img/Zupp web_Logo.png" alt="Bike"></div><div class="cardText"><div class="gridRow1"><label class="cardLabel">Plan ID</label><div class="insuranceDate">'+val.name+'</div></div><div class="gridRow2"><label class="cardLabel">Cost of Plan</label><div class="pucDate">'+val.cost+'</div></div><div class="gridRow4"><label class="cardLabel">Validity Duration</label><div class="serviceDate">'+val.validityDuration+' days</div></div><div class="gridRow5"><label class="cardLabel">Coverage</label><div class="serviceDate">'+val.coverage+' days</div></div><div class="gridRow5"><label class="cardLabel">No. of Claims</label><div class="serviceDate">'+val.noOfClaims+'</div></div></div><button name='+val.name+' id="'+val.id+'" class="buyBtn">Buy</button></div>');
	        		});
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error');
	        }
	    });

	    //get planId
	    var planId = localStorage.getItem('planId');
	    var planName = localStorage.getItem('planName');
	    $('.planId')[0].innerHTML = planName;
    }

});

//on vehicle select
/*$('.selectVehicle').on('change', function(){
	var token = localStorage.getItem('token');
    var selectedVehicle = $(this).val();

    //get vehicle status
    $.ajax({
    	url: baseUrl + 'vehicle/s/'+selectedVehicle,
    	type: "GET",
        contentType: "application/json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer "+ token);
        },
        success: function(result){
        	if(result.status == 'success'){
        		Materialize.toast('No records found!', 4000);
        		$.each(result.data, function(key, val){
        			$('.plansDiv').append('<div class="planCard"><div class="planNumberCircle"><img class="planCircle" src="img/Zupp web_Circle plans.png" /><p class="planText selectPlanText">'+(key+1)+'</p></div><div class="planLogo"><img class="zuppLogo img-responsive" src="img/Zupp web_Logo.png" alt="Bike"></div><div class="cardText"><div class="gridRow1"><label class="cardLabel">Plan ID</label><div class="insuranceDate">'+val.id+'</div></div><div class="gridRow2"><label class="cardLabel">Cost of Plan</label><div class="pucDate">'+val.cost+'</div></div><div class="gridRow3"><label class="cardLabel">No of claims</label><div class="pucDate">'+val.noOfClaims+'</div></div><div class="gridRow4"><label class="cardLabel">Validity Duration</label><div class="serviceDate">'+val.validityDuration+' days</div></div></div><button id="'+val.id+'" class="buyBtn">Buy</button></div>');
        		});
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    });
});*/

//buy plan button click
$('.plansDiv').on('click', '.buyBtn', function(){
	localStorage.setItem('planId', $(this).attr('id'));
	localStorage.setItem('planName', $(this).attr('name'));
	location.href = 'createSvc';
});

$('.createClick').click(function (){
    location.href = 'plans';
});

//logout
$('.logoutBtn').click(function(){
	token = '';
	location.href = 'index';
});

//data validation of svc to be created
$('.generateBtn').click(function(e){
	e.preventDefault();

	var planName = localStorage.getItem('planName');

	if($('.email').val() == '' || $('.mobileNumber').val() == ''){
		Materialize.toast('Please enter all compulsary information marked with a *!', 4000);
		return false;
	}

	$('#custName').val($('.name').val());
	$('#custEmail').val($('.email').val());
	$('#custNumber').val($('.mobileNumber').val());
	$('#custRegNumber').val($('.regNumber').val());
	$('#custModel').val($('.model').val());
	$('#custPolicyNumber').val($('.engineNo').val());
	$('#custAdd1').val($('.add1').val());
	$('#custAdd2').val($('.add2').val());
	$('#custAdd3').val($('.add3').val());
	$('#custCity').val($('.city').val());
	$('#custPincode').val($('.pincode').val());
	$('#plan').val(planName);

	$('#svcDetailsModal').modal('open');

});

//create svc
$('.saveBtn').click(function(e){
	e.preventDefault();

	var token = localStorage.getItem('token');
	var planId = localStorage.getItem('planId');

	/*doc.fromHTML($('#svc').get(0), 15, 15, {
	'width': 170,
	});
	doc.save('sample-content.pdf');*/

	var customerName = $('.name').val();
	var customerEmail = $('.email').val();
	var customerPhoneNumber = $('.mobileNumber').val();

	var add1 = $('.add1').val();
	var add2 = $('.add2').val();
	var add3 = $('.add3').val();
	var address = add1 + ' ' + add2 + ' ' + add3;
	var city = $('.city').val();
	var pincode = $('.pincode').val();

	var regNumber = $('.regNumber').val();
	var model = $('.model').val();
	var vehicleEngineNumber = $('.engineNo').val();
	var executiveName = $('.executiveName').val();

	if(customerEmail == '' || customerPhoneNumber == ''){
		Materialize.toast('Please enter all compulsary information marked with a *!', 4000);
		return false;
	}	

	var logo = '<html><body><div class="logo printLogo"><img src="img/Zupp web_Logo.png" alt="ZUPP" /></div></body></html>';
	var header = '<div class="printHeader"><h2 class="printHeading">SVC Details</h2></div><div class="mainDivPrint">';
	var nameDiv = '<div class="personalDetailsPrint"><div id="custName" class="printText">Name<br/><div class="printValue">'+customerName+'</div></div>';
	var emailDiv = '<div id="custEmail" class="printText">email<br/><div class="printValue">'+customerEmail+'</div></div>';
	var phoneDiv = '<div id="custNumber" class="printText">Mobile Number<br/><div class="printValue">'+customerPhoneNumber+'</div></div>';
	var addressDiv = '<div class="addressDetailsPrint"><div class="printText">Address<br/><div class="printValue">'+add1+'<br/>'+add2+'<br/>'+add3+'<br/>'+city+' - '+pincode+'</div></div></div></div>'
	var formDetails = logo + header + nameDiv + emailDiv + phoneDiv + addressDiv;
	
	var data = {"planId":planId, "vehicleEngineNumber":vehicleEngineNumber, "customerName": customerName, "customerEmail":customerEmail, "customerPhoneNumber":customerPhoneNumber, "address":address, "city":city, "pincode":pincode, "vehicleRegistrationNumber":regNumber, "vehicleModel":model, "executiveName":executiveName};

	console.log('data', data);

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
        	if(result.status == 'success'){
        		//print page
        		var printContents = formDetails;
			    var originalContents = document.body.innerHTML;

			    document.body.innerHTML = printContents;
				window.print();

			    document.body.innerHTML = originalContents;
			    location.href = 'svc';
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    }); 
});

//view customer details
$('.tableBody').on('click', '.viewDetailsBtn', function(){
	localStorage.setItem('svcToken', $(this).attr('id'));
	location.href = 'svcDetails';
});

//get svc list with search
$('.goButton').click(function(){
	var token = localStorage.getItem('token');
	var searchText = $('.searchValue').val();

	$.ajax({
    	url: baseUrl + 'svc?page=1&searchString='+searchText,
    	type: "GET",
        contentType: "application/json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer "+ token);
        },
        success: function(result){
        	if(result.status == 'success'){
        		if(result.data.length == 0){
        			$('.tableBody').empty();
        			Materialize.toast('No matching results found!', 4000);
        		}
        		else{
        			$('.tableBody').empty();

        			$.each(result.data, function(key, val){
        				$('.tableBody').append('<tr><th><a id="'+val._id+'" class="svcClick">'+val.token+'</a></th><th>'+val.customerName+'</th><th>'+val.customerPhoneNumber+'</th><th>'+formatNewDate(val.createdOn)+'</th><th>'+formatNewDate(val.expiryDate)+'</th><th>'+val.status+'</th><th><a id='+val._id+' class="btn viewDetailsBtn">View Details</a></th></tr>');
        			});
        		}
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    }); 
});

//svc list with date filters
$('.dateFilterBtn').click(function(){
	var token = localStorage.getItem('token');
	var searchText = $('.searchValue').val();
	var startDate = formatDate($('#startDate').val());
	var endDate = formatDate($('#endDate').val());

	$.ajax({
    	url: baseUrl + 'svc?page=1&searchString='+searchText+'&start='+startDate+'&end='+endDate,
    	type: "GET",
        contentType: "application/json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer "+ token);
        },
        success: function(result){
        	if(result.status == 'success'){
        		if(result.data.length == 0){
        			$('.tableBody').empty();
        			Materialize.toast('No matching results found!', 4000);
        		}
        		else{
        			$('.tableBody').empty();

        			$.each(result.data, function(key, val){
        				$('.tableBody').append('<tr><th><a id="'+val._id+'" class="svcClick">'+val.token+'</a></th><th>'+val.customerName+'</th><th>'+val.customerPhoneNumber+'</th><th>'+formatNewDate(val.createdOn)+'</th><th>'+formatNewDate(val.expiryDate)+'</th><th>'+val.status+'</th><th><a id='+val._id+' class="btn viewDetailsBtn">View Details</a></th></tr>');
        			});
        		}
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    });
});

//get selected svc details
$('.tableBody').on('click', '.svcClick', function(){
	localStorage.setItem('svcToken', $(this).attr('id'));
	location.href = 'svcDetails';
});

$('.logo').click(function(){
	location.href = 'svc';
});

//get report on date select
$('.goButtonReport').click(function(){
	var token = localStorage.getItem('token');

	var fromDate = formatDate($('#fromDate').val());
	var toDate = formatDate($('#toDate').val());

	$.ajax({
    	url: baseUrl + 'booking?page=1&start='+fromDate+'&end='+toDate,
    	type: "GET",
        contentType: "application/json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer "+ token);
        },
        success: function(result){
        	if(result.status == 'success'){
        		if(result.data.length == 0){
        			$('.bookingTable').empty();
        			Materialize.toast('No matching results found!', 4000);
        		}
        		else{
        			$('.bookingTable').empty();

        			$.each(result.data, function(key, val){
        				$('.tableBody').append('<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>');
        			});
        		}
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	console.log('error');
        }
    });
});

//forgot password
$('.sendLinkBtn').click(function(){
	var email = $('#fpEmail').val();
	if(email == ''){
		Materialize.toast('Please enter an email id!', 4000);
	}
	else{
		var data = {email: email};

		$.ajax({
	    	url: baseUrl + 'forgotPassword',
	    	type: "POST",
	        contentType: "application/json",
	        crossDomain: true,
	        data: JSON.stringify(data),
	        success: function(result){
	        	if(result.status == 'success'){
	        		Materialize.toast('An email with a link to reset password has been sent to this email id.', 4000);
					$('.closeModalBtn').click();
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error', jqXHR.responseJSON);
	        	if(jqXHR.responseJSON.status == "error" && jqXHR.responseJSON.message == 'User not found!'){
	        		Materialize.toast('Email does not match our records!<br/>Please enter your registered email id!', 4000);
	        	}
	        	else if(jqXHR.responseJSON.status == "error" && jqXHR.responseJSON.code == "EMESSAGE"){
	        		Materialize.toast('This email address is not verified!', 4000);
	        	}
	        }
	    });
	}
});

//reset password
$('.resetPasswordButton').click(function(){
	var newPassword = $('.newPassword').val();
	var repeatNewPassword = $('.repeatNewPassword').val();

	if(newPassword !== repeatNewPassword){
		Materialize.toast('Passwords do not match!', 4000);
	}
	else{
		var data = {email: user, code: code, password: newPassword};

		$.ajax({
	    	url: baseUrl + 'resetPassword',
	    	type: "POST",
	        contentType: "application/json",
	        crossDomain: true,
	        data: JSON.stringify(data),
	        success: function(result){
	        	if(result.status == 'success'){
	        		Materialize.toast('Your password is successfully reset!<br/>Please wait. Redirecting to login page', 4000);
	        		setTimeout(function(){
	        			location.href = 'index';
	        		}, 3000);
	        	}
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	console.log('error', jqXHR.responseJSON);
	        	/*if(jqXHR.responseJSON.status == "error" && jqXHR.responseJSON.message == 'User not found!'){
	        		Materialize.toast('Email does not match our records!<br/>Please enter your registered email id!', 4000);
	        	}
	        	else if(jqXHR.responseJSON.status == "error" && jqXHR.responseJSON.code == "EMESSAGE"){
	        		Materialize.toast('This email address is not verified!', 4000);
	        	}*/
	        }
	    });
	}
});
