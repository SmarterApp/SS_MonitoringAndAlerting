
(function($)
{
	$.fn.sb11DataTable = function(option, settings) {
		if(typeof option === 'object') {
			settings = option;
		} else if(typeof option === 'string') {
			var values = [];
			var elements = this.each(function() {
				var data = $(this).data('_sb11DataTable');
				if(data) {
					if(option === 'reset') { data.reset(); }
					else if(option === 'theme') { data.setTheme(settings); }
					else if($.fn.sb11DataTable.defaultSettings[option] !== undefined){
						if(settings !== undefined) { data.settings[option] = settings; }
						else { values.push(data.settings[option]); }
					}
				}
			});

			if(values.length === 1) { return values[0]; }
			if(values.length > 0) { return values; }
			else { return elements; }
		}
			
		return this.each(function() {
			var $elem = $(this);
			var $settings = $.extend({}, $.fn.sb11DataTable.defaultSettings, settings || {});
			$settings.toggleRow = function(event){
				var icon = $(event.target);
				var nTr = event.target.parentNode.parentNode;
				var open =  icon.hasClass('icon-expanded');
				if (open){
					icon.removeClass('icon-expanded');
					icon.css({"background-position":"bottom"});
					$elem.fnClose(nTr);
				}else{
					icon.addClass('icon-expanded');
					icon.css({"background-position":"top"});
					var data = $elem.fnGetData(nTr);
					$elem.fnOpen( nTr, $settings.expanderTemplate(data), 'details');
				}
			};

			var previousFirstId, lastPreviousFirstId = [], previousPage = 0;
			$settings.fnServerData = function ( sSource, aoData, fnCallback, oSettings ) {
				var params = $($settings.searchForm).serializeObject();
				params.currentPage =  oSettings._iDisplayLength === -1 ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength );
		 		params.pageSize = oSettings._iDisplayLength;
		 		if (oSettings.sPaginationType === 'two_button') {
			 		if (previousFirstId && params.currentPage > previousPage) {
			 			params.previousFirstId = previousFirstId;
			 		}
			 		if (lastPreviousFirstId && params.currentPage < previousPage && params.currentPage > 0) {
			 			params.previousFirstId = lastPreviousFirstId[params.currentPage];
			 		}
		 		}
		 		
		 		if(oSettings.aaSorting[0]){
		 			params.sortKey = oSettings.aoColumns[oSettings.aaSorting[0][0]].mData;
		 			params.sortDir = oSettings.aaSorting[0][1];
		 		}
		 		
		 		//page size change
		 		if(oSettings._prevPageSize != null && oSettings._prevPageSize  != oSettings._iDisplayLength){
		 			params.currentPage = 0;
		 			oSettings._iDisplayStart = 0;
		 		}
		 		oSettings._prevPageSize = oSettings._iDisplayLength;
		 		
		 		$.ajax({
		 	     url: $settings.url,
		 	     method: 'GET',
		 	     async: true,
		 	     dataType:'json',
		 	     data: $.param(params),
		 	     success:  function(data) {
		 	    	 data.iTotalRecords=data.totalCount;
		 	         data.iTotalDisplayRecords=data.totalCount;
		 	         if (data.searchResults.length > 0) {
		 	        	 lastPreviousFirstId[params.currentPage] = previousFirstId;
			 	         previousFirstId = data.searchResults[data.searchResults.length-1].id;
			 	         previousPage = params.currentPage;
		 	         }
		 	         fnCallback(data);
		 	         //attach expander click handler
		 	      
		 	         $('td i', $elem).on('click', $settings.toggleRow);
		 	         $('td i', $elem).on('keypress', $settings.toggleRow);
		 	     } 
		 		 , error : function(data){
		 			 fnCallback({ iTotalRecords: 0
		 	    		 		, iTotalDisplayRecords:0
		 	    		 		, searchResults :[]});
		 			 
		 			 if(jQuery.isFunction($settings.ajaxErrorHandler)){
		 				$settings.ajaxErrorHandler(data);
		 			 }
		 	     }
		 		});
		 	};
		 	
		 	if($settings.expanderTemplate != null){
		 		var newcolumn = { "sTitle":"", "bSortable":false, "sWidth" : "40px", "sName":"expander","mData": "insertTimestamp" ,"mRender": function ( data, type, full ) {
				    return '<i class="plusMin" tabindex="0"></i>';
				}};
		 		var newArray = [newcolumn];
		 		newArray.push.apply(newArray, $settings.aoColumns);
		 		$settings.aoColumns = newArray;
		 	}
			var $dataTable = $elem.dataTable($settings);
			var sb11Dt = new Sb11DataTable($settings, $elem, $dataTable);
			
			$elem.data('_sb11_data_table', sb11Dt);
			
			return sb11Dt;
			
		});
	};

	$.fn.sb11DataTable.defaultSettings = {
			"bJQueryUI": true,
		    "bProcessing": true,
		    "sPaginationType": "full_numbers",
	        "bServerSide" : true,
	        "bFilter": false,
	        "sAjaxDataProp": "searchResults",
	        "searchForm": null,
	        "url": null,
	        "ajaxErrorHandler": null
	};
	
	function Sb11DataTable(settings, $elem, dtbl) {
		this.dataTbl = dtbl;
		this.settings = settings;
		this.$elem = $elem;
		return this;
	}

})(jQuery);