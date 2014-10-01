//todo namespace object

$(document).on('ready', initPage);


var base_url = "";
_.templateSettings = {
	    interpolate: /\<\@\=(.+?)\@\>/gim,
	    evaluate: /\<\@(.+?)\@\>/gim,
	    escape: /\<\@\-(.+?)\@\>/gim
	};

$.ajaxSetup ({
    cache: false,
    statusCode: {
    	401: function() {
    		location.href = "thankyou";
    	}
    }
});

// super cool ie8 workaround to resize the datatables grid.
var winWidth, winHeight;

function initPage(){
	base_url = $("#baseUrl").val();
	displayLogos();
	$(".homeLink").click(displayLogos);
	$(".searchLogsLink").click(LogSearch.loadForm);
	$(".searchAlertsLink").click(AlertSearch.loadForm);
	$(".searchMetricsLink").click(MetricSearch.loadForm);
	$(".searchNotificationRulesLink").click(NotificationRule.loadSearchForm);
	$(".searchNotificationGroupsLink").click(NotificationGroup.loadSearchForm);
	
	// 508 compatibility
	$(".searchLogsLink").keypress(LogSearch.loadForm);
	$(".searchAlertsLink").keypress(AlertSearch.loadForm);
	$(".searchMetricsLink").keypress(MetricSearch.loadForm);
	$(".searchNotificationRulesLink").keypress(NotificationRule.loadSearchForm);
	$(".searchNotificationGroupsLink").keypress(NotificationGroup.loadSearchForm);
	$(".slide-menu").hide();	//hide slide menu
	
	$("#modalWindow").dialog({
	    autoOpen: false,
	   // height: 400,
	    width: 550,
	    modal: true,
	    resize:false,
	    show: {
	        effect: "fade",
	        duration: 200
	      },
	      hide: {
	        effect: "explode",
	        duration: 300
	      }
	});
	$("#modalClose").click(function(){$("#modalWindow").dialog("close");}); 
	
	$("#modalHelp").dialog({
	    autoOpen: false,
	    width: 400,
	    modal: true,
	    resize:false,
	    title: 'MnA - Help',
	    show: {
	        effect: "fade",
	        duration: 200
	      },
	      hide: {
	        effect: "explode",
	        duration: 300
	      }
	});
	$("#helpClose").click(function(){$("#modalHelp").dialog("close");}); 
	
	$(".dropdown ul").hide();
	$(".dropdown ul li").click(function(){
		$(".dropdown ul").hide();
	});
	
	$('body').click(function(event) {
	    if (!$(event.target).closest('.dropdown').length) {
	        $('.dropdown ul').hide();
	    };
	});
	
	// binding menu handler click event
	$(".slider-arrow").click(menuClick);
	
	//"cool" work around to ie8 resize event issues
	//also... datatables should not go back to the server on redraw call.
	lastWindowHeight = $(window).width();
	lastWindowWidth = $(window).height();
	
	$(window).resize(function() {
		if($(window).height()!=lastWindowHeight || $(window).width()!=lastWindowWidth){

            //set this windows size
            lastWindowHeight = $(window).height();
            lastWindowWidth = $(window).width();
		
            var table = $.fn.dataTable.fnTables(true);
    	    if ( table.length > 0 ) {
    	        for(var i=0;i<table.length;i++){
    	        	$(table[i]).dataTable().css({ width: $(table[i]).dataTable().parent().width() });
    	            $(table[i]).dataTable().fnDraw(false);  
    	        }
    	    }
		}
		
	});
}

function toggleSelectMenu(className){
	$(".menuli.selected").removeClass('selected');
	$(".menuli." + className).addClass('selected');
}

function populateModalWindow(evendObject){
	var key = $(this).attr('data-help-key');
	$.ajax({
        url: base_url + 'help/'+ key,
        method: 'GET',
        async: true,
        dataType:'json',
        success: function(data) {
        	$("#modalHelp .modal-body").text(data.message);
        	$("#modalHelp").dialog("open");
        }
    });
}

function setHelpIcons(){
	$("i.icon_faq").click(populateModalWindow);
}

function setDatePickers(){
	   $('#insertTimestampGreaterThanUI').datepicker({
		    dateFormat : 'mm-dd-yy',
		    altField : '[name=insertTimestampMillisGreaterThan]',
		    altFormat : '@'
		});
	   $('#insertTimestampLessThanUI').datepicker({
		     dateFormat : 'mm-dd-yy',
		     altField : '[name=insertTimestampMillisLessThan]',
		     altFormat : '@'
		});
	   // lame workaround for http://bugs.jqueryui.com/ticket/5734
	   // keep this hack until jquery ui  1.11 is released
	   $(".hasDatepicker").on("change", function(e) {
		  if('' ==  $(this).val()){
			  $($(this).datepicker("option" , "altField")).val("");
		  }
	   });
}

function mnaDateFormatter( data, type, full ) {
	var dte =  Date.fromISO(data);
	return $.datepicker.formatDate('mm-dd-yy', dte) + " " +  formatTimeValue(dte.getHours()) + ":" + formatTimeValue(dte.getMinutes())+ ":" + formatTimeValue(dte.getSeconds());
};

function formatTimeValue(number){
	var num = number  + "";
	if(num.length == 1){
		num = "0" + num;
	}
	return num;
}


function showModalWindow(title, content, saveHandler, deleteHandler){
	$('#modalWindow .modal-body').html(content);
	
	$('#modalDelete').off('click');
	if(deleteHandler != null){
		$('#modalDelete').on('click', deleteHandler);
		$('#modalDelete').show();
	}else{
		$('#modalDelete').hide();
	}

	$('#modalSave').off('click');
	if(saveHandler != null){
		$('#modalSave').on('click', saveHandler);
		$('#modalSave').show();
	}else{
		$('#modalSave').hide();
	}
	$('#modal-alert').hide();
	$('#modalWindow').dialog('option', 'title', title);
	$("#modalWindow").dialog("open");

}



var alert_template = _.template('<div><span class="icon_sprite icon_<@=level@> <@=level@>"></span><@=msg@></div>');

function mnaSaveResponseHandler(responseData, level) {
	clearFormFieldStatus();
	var className = 'alert';
	if(level == 'success'){
		closeModal();
	} else {
		var alertHtml = '';
		if(responseData.messages) {
				for(fieldsIndx in responseData.messages) {
					var fieldMessages = responseData.messages[fieldsIndx];
					highlightFieldError(fieldsIndx);
					for(i in fieldMessages) {
						alertHtml += alert_template({'level':level, 'msg':fieldMessages[i]});	
					}
				}
		}
		$('#modal-alert').removeClass().addClass(className);
		$('#modal-alert div').html(alertHtml);
		$('#modal-alert').show();
	}
}

function  globalAjaxErrorHandler(response){
	if (response && response.status == 0 && response.statusText == "error") { //assuming session timeout
		showModalWindow("Session Expired", "<h2>Session Expired.  Please Wait.</h2>", null, null);
		window.setTimeout(function() { location.href = "thankyou"; }, 1000);
		return;
	}
	showModalWindow('Application Error', '');
	
	var data = null;
	try {
		data = $.parseJSON(response.responseText);
	} catch(err) {
		var msg = (response.status == '404' ? 'Error communicating with server - please contact support.' : 'Unknown application error - please contact support.');
		data = { "messages" : { "applicationErrors" : [ msg ] } };
	}
	
	mnaSaveResponseHandler(data, 'error');

}

function closeModal(){
	$("#modalWindow").dialog("close");
}


function highlightFieldError(field) {
	$('#modalWindow form *[name="' + field + '"]').addClass('error');
}

function clearFormFieldStatus() {
	$('#modalWindow form input').removeClass('error');
	$('#modalWindow form ul').removeClass('error');
	$('#modalWindow form select').removeClass('error');
}

function displayLogos(){
	loadBuildInfo();
	$("#homeLayout").show();
	$("#searchLayout").hide();
	$('#searchResults').hide().html("");
	$(".slide-menu").hide();
}

function displaySearchForms(){
	$("#homeLayout").hide();
	$("#searchLayout").show();
	$('#searchResults').show().html("");
}

function loadBuildInfo() {	
	$.ajax({
        url: base_url + "version",
        method: 'GET',
        async: true,
        dataType:'json',
        success: function(data) {
        	var fText = 'Version: ' + data.appVersion;
        	if (data.jenkinsBuildNumber) {
        		fText = fText + ' (build #: ' + data.jenkinsBuildNumber + ')';
        	}
        	$("#footerText").html(fText);
        }
    });
		
}

function loadSelectBox(selectboxSelector, url, valueField, displayField) {
	var selectBoxData = $("body").data(base_url + url);
	if(selectBoxData == null){
		$.ajax({
	        url: base_url + url,
	        method: 'GET',
	        async: true,
	        dataType:'json',
	        success: function(data) {
	        	$("body").data(base_url + url, data);
	        	var opts = buidSelectOptions(data, valueField, displayField);  
	        	$(selectboxSelector).html(opts);
	        }
	    });
	} else {
		var opts = buidSelectOptions(selectBoxData, valueField, displayField);  
    	$(selectboxSelector).html(opts);
	}
}

function buidSelectOptions(data, valueField, displayField){
	 var options = '<option value="">Select...</option>';
     for (var i = 0; i < data.length; i++) {
       if($.isArray(data) ){
    	   options += '<option value="' + data[i] + '">' + data[i] + '</option>';   
       }else{
    	   options += '<option value="' + data[i].valueField + '">' + data[i].displayField + '</option>';
       }
     }
     return options;
}

$.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};
 
$.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function render(tmpl_name, tmpl_data) {
	if ( !render.tmpl_cache ) { 
        render.tmpl_cache = {};
    }

    if ( ! render.tmpl_cache[tmpl_name] ) {
    	var tmpl_dir = 'resources/mna/templates';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            dataType:'html',
            success: function(data) {
                render.tmpl_cache[tmpl_name] = _.template(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
            	showModalWindow("Session Expired", "<h2>Session Expired.  Please Wait.</h2>", null, null);
            	window.setTimeout(function() { location.href = "thankyou"; }, 1000);
            	return;
            }
        });
    }
    return render.tmpl_cache[tmpl_name](tmpl_data);
}

function toolsMenu(){
	$(".dropdown ul").slideToggle();
}


//add Date.fromISO for IE8
(function(){
    var D= new Date('2011-06-02T09:34:29+02:00');
    if(!D || +D!== 1307000069000){
        Date.fromISO= function(s){
            var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
            if(p[1]){
                day= p[1].split(/\D/);
                for(var i= 0, L= day.length; i<L; i++){
                    day[i]= parseInt(day[i], 10) || 0;
                };
                day[1]-= 1;
                day= new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) return NaN;
                if(p[5]){
                    tz= (parseInt(p[5], 10)*60);
                    if(p[6]) tz+= parseInt(p[6], 10);
                    if(p[4]== '+') tz*= -1;
                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else{
        Date.fromISO= function(s){
            return new Date(s);
        }
    }
})()

function menuClick(){
	var target = $('.slider-arrow');
	if(target.hasClass('show')){
	    $( ".slider-arrow, .secondary .nav" ).animate({
          left: "+=221"
		  }, 700, function() {
            // Animation complete.
          });
		
		
		  $(".secContent").animate({'margin-left': "240px"}, 700, function(){});
		
		  target.html('&laquo;').removeClass('show').addClass('hide');
        }
    else {   	
    $( ".slider-arrow, .secondary .nav" ).animate({
      left: "-=221"
	  }, 700, function() {
        // Animation complete.
      });
	  
	  $(".secContent").animate({'margin-left': "0px"}, 700, function(){});
	  
	  target.html('&raquo;').removeClass('hide').addClass('show');    
    }
	// remove the inline style to adjust the table width accordingly
	$('.dataTable').removeAttr('style');
}
var clearEmptyElements = function(list) {
	if (list) { //remove empty member names
		var len = list.length;
		while (len--) {
			if (list[len] == "") {
				list.splice(len, 1);
			}
		}
	}
};

