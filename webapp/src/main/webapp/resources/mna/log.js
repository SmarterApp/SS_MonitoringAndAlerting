
var LogSearch = (function(){
	return {
		loadForm : function () {
			$(".slide-menu").show();
			toggleSelectMenu('searchLogsLink');
				displaySearchForms();
				var searchTemplate = render('log_search',{});
			    $("#searchForm").html(searchTemplate);
			    $("#log-search").click(LogSearch.search);
			    setDatePickers();
			    setHelpIcons();
			    $('#searchResults').html('<table role="grid" summary="Monitoring and Alerting Logs"></table>');
		        $('#searchResults table').sb11DataTable({
        		    "sPaginationType": "two_button",
		        	"expanderTemplate": _.template("<div>Server: <@=alternateKey.server@><br>Node: <@=alternateKey.node@><br>Message:<pre><@=messageFull@></pre><br> Stack Trace:<pre><@=stackTraceFull@></pre></div>"),
			        "url":  base_url + 'log/' ,
			        "searchForm": '#forms-log-search' ,
//			        "sDom": '<"H"Tfr>t<"F"ip>',
//			        "oTableTools": {
//		        		"aButtons": ["print"]
//		    		},
			        "aaSorting": [],
			        "ajaxErrorHandler": globalAjaxErrorHandler,
			        "aoColumns": [
						{ "sTitle":"Time", "sName":"insertTimestamp","mData": "insertTimestamp" ,"mRender":mnaDateFormatter, "bSortable": false },
						{ "sTitle":"server", "sName":"server","mData": "alternateKey.server", "bVisible":false, "bSortable": false },
						{ "sTitle":"node", "sName":"node","mData": "alternateKey.node", "bVisible":false, "bSortable": false },
						{ "sTitle":"Reference #", "sName":"referenceNumber","mData": "referenceNumber","bVisible":false, "bSortable": false },
						{ "sTitle":"Component", "sName":"component","mData": "alternateKey.component","sWidth" : "150px", "bSortable": false },
						{ "sTitle":"Severity", "sName":"severity","mData": "severity", "sWidth" : "85px", "bSortable": false },
			            { "sTitle":"Message", "sName":"message","mData": "message", "bSortable": false, "fnRender": function ( oObj ) {
				            	var msg = oObj.aData.message;
				            	oObj.aData.messageFull = msg;
								if(msg != null && msg.length > 30){
									msg = msg.substring(0, 30) + "...";
								}
				            	return msg;
							}
						},
						{ "sTitle":"Stack Trace", "sName":"stackTrace","mData": "stackTrace", "bSortable": false, "fnRender": function ( oObj ) {
								var msg = oObj.aData.stackTrace;
								oObj.aData.stackTraceFull = msg;
								if(msg != null && msg.length > 30){
									msg = msg.substring(0, 30) + "...";
								}
				            	return msg;
							}
						}],
					"fnDrawCallback": function() { //manipulate the two button pager
						$('div.dataTables_paginate').children().last().css("margin-left", "10px")
                        $('span.ui-icon.previous.fg-button').removeClass("ui-icon").html("Previous");
                        $('span.ui-icon.next.fg-button').removeClass("ui-icon").html("Next");
                        $('#searchResults').css("min-width", "733px"); //prevents toolbar from shrinking smaller than table on browser resize.
	                }
		        });
		        loadSelectBox('#component', 'reference/components');
		        loadSelectBox('#server', 'reference/servers');
		        loadSelectBox('#severity','reference/severity');
		}
		, search : function (){
			$('#searchResults table').dataTable().fnPageChange('first');
		}
	};
	
})();
