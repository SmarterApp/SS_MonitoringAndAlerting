
var MetricSearch = (function(){
	
	return {
		loadForm : function (){
			$(".slide-menu").show();
			toggleSelectMenu('searchMetricsLink');
			displaySearchForms();
			var searchTemplate = render('metric_search', {});
		    $("#searchForm").html(searchTemplate);
		    $("#metric-search").click(MetricSearch.search);
		    setDatePickers();
		    setHelpIcons();
		    $('#searchResults').html('<table summary="Monitoring and Alerting Metrics"></table>');
	        $('#searchResults table').sb11DataTable({
	        	"ajaxErrorHandler": globalAjaxErrorHandler,
		        "url":  base_url + 'metric/' ,
		        "searchForm": '#forms-metric-search' ,
		        "aaSorting": [[ 1, "desc" ]],
		        "aoColumns": [
					{ "sTitle":"Time", "sName":"insertTimestamp","mData": "insertTimestamp", "sWidth" : "180px", "mRender": mnaDateFormatter},
		            { "sTitle":"Component", "sName":"component","mData": "alternateKey.component", "sWidth" : "160px"  },
		            { "sTitle":"Metric Name", "sName":"metricName","mData": "metricName", "sWidth" : "120px" },
		            { "sTitle":"Metric Type", "sName":"metricType","mData": "metricType" , "sWidth" : "170px"},
		            { "sTitle":"Server", "sName":"server","mData": "alternateKey.server", "bVisible":false },
		            { "sTitle":"Node", "sName":"node","mData": "alternateKey.node", "bVisible":false },
		            { "sTitle":"Metric Value", "sName":"metricValue","mData": "metricValue",  "sWidth" : "170px"}
		        ]
	        });
	        loadSelectBox('#component', 'reference/components');
	        loadSelectBox('#metricType','reference/metrictype');
		}
		, search : function (){
			$('#searchResults table').dataTable().fnPageChange('first');
		}
	};
})();
