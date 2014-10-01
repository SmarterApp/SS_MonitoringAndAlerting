
var AlertSearch = (function(){
	
	return {
		loadForm : function (){
			$(".slide-menu").show();
			toggleSelectMenu('searchAlertsLink');
			displaySearchForms();
			var searchTemplate = render('alert_search', {});
		    $("#searchForm").html(searchTemplate);
		    $("#alert-search").click(AlertSearch.search);
		    setDatePickers();
		    setHelpIcons();
		    $('#searchResults').html('<table summary="Monitoring and Alerting Alerts"></table>');
	        $('#searchResults table').sb11DataTable({
	        	"ajaxErrorHandler": globalAjaxErrorHandler,
//	        	"sDom": 'T<"clear">lfrtip',
//	        	"oTableTools": {
//	        		"aButtons": ["print"]
//	    		},
	        	"expanderTemplate": _.template("<div>Server: <@=alternateKey.server@><br>Node: <@=alternateKey.node@><br>Message:<pre><@=messageFull@></pre></div>"),
		        "url":  base_url + 'alert/' ,
		        "searchForm": '#forms-alert-search' ,
		        "aaSorting": [[ 1, "desc" ]],
		        "aoColumns": [
					{ "sTitle":"Time", "sName":"insertTimestamp","mData": "insertTimestamp", "sWidth" : "180px", "mRender": mnaDateFormatter},
		            { "sTitle":"Component", "sName":"component","mData": "alternateKey.component", "sWidth" : "160px"  },
		            { "sTitle":"Severity", "sName":"severity","mData": "severity", "sWidth" : "120px" },
		            { "sTitle":"Alert Type", "sName":"alertType","mData": "alertType" , "sWidth" : "170px"},
		            { "sTitle":"Server", "sName":"server","mData": "alternateKey.server", "bVisible":false },
		            { "sTitle":"Node", "sName":"node","mData": "alternateKey.node", "bVisible":false },
		            { "sTitle":"Message", "sName":"message","mData": "message",  "fnRender": function ( oObj ) {
		            	var msg = oObj.aData.message;
		            	oObj.aData.messageFull = msg;
						if(msg != null && msg.length > 35){
							msg = msg.substring(0, 35) + "...";
						}
		            	return msg;
					}
		            }
		        ]
	        });
	        loadSelectBox('#component', 'reference/components');
	        loadSelectBox('#severity','reference/severity');
	        loadSelectBox('#alertType','reference/alerttype');
		}
		, search : function (){
			$('#searchResults table').dataTable().fnPageChange('first');
		}
	};
})();
