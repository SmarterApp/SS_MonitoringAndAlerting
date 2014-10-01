
var NotificationRule = (function(){
	return {
		loadSearchForm : function (){
			$(".slide-menu").show();
			toggleSelectMenu('searchNotificationRulesLink');
			displaySearchForms();
			var searchTemplate = render('notificationRule_search', {});
		    $("#searchForm").html(searchTemplate);
		    $("#notification-rule-search").click(NotificationRule.search);
		    $("#notification-rule-add").click(NotificationRule.add);
		    
		    $('#searchResults').html('<table summary="Monitoring and Alerting Notification Rules"></table>');
		    $('#searchResults table').sb11DataTable({
		    	"fnRowDblClick": NotificationRule.edit,
		        "url":  base_url + 'notificationRule/',
		        "searchForm": '#forms-notificationRule-search',
    	        "aoColumns": [
    	            { "sTitle":"Id", "sName":"id","mData": "id" , "bVisible":    false },
    	            { "sTitle":"Rule Type", "sName":"ruleType","mData": "ruleType" },
    	            { "sTitle":"Attribute", "sName":"attribute","mData": "attribute" },
    	            { "sTitle":"Expression", "sName":"regex","mData": "regex" },
    	            { "sTitle":"Active", "sName":"active","mData": "active" },
    	            { "bSearchable":false, "bSortable":false, "mData": null, 
    	            	"mRender":function(data, type, full) {
    	            		var id = full.id;
    	            		return '<div style="white-space: nowrap;">' + 
    	            		         '<span onclick=\'deleteRowDialog("' + id + '")\' class="link btnIcon icon_sprite icon_delete2"></span>' +
    	            			     '<span onclick=\'editRow("' + id + '")\' class="link btnIcon icon_sprite icon_edit1"></span>' + 
    	            			   '</div>';
    	            	}
    	            }
    	        ],
			    fnDrawCallback : function(oSettings){
			    	$("#" + oSettings.nTable.id).addClass('table-hover');
			    	$("#" + oSettings.nTable.id + " tr ").on("dblclick", function(event){
			    		var aData = $('#searchResults table').dataTable().fnGetData( this );
			            NotificationRule.edit(aData.id);
			    	});
			    } 
	        });
		}
	
		, search : function (){
			$('#searchResults table').dataTable().fnPageChange('first');
		}
		
		, add : function (){
		    var form = render('notificationRule_form', {'title':'Add'});
		    showModalWindow('Add Notification Rule', form, NotificationRule.create);
		    NotificationRule.bindNotificationGroupSelect([]);
		}
		
		, bindNotificationGroupSelect:function(selectedData){
            $('#notificationGroupIds').select2({
                multiple: true,
                minimumInputLength: 1,
                ajax:{
				    url: base_url + 'notificationGroup',
			        dataType: 'json',
			        quietMillis: 100,
			        data: function (term, page) { // page is the one-based page number tracked by Select2
			        	return {
			                groupName: term, 
			                pageSize: 100,
			                currentPage: page-1
			            };
			        },
			        results: function (data, page) {
			            var more = false;
			            var results = [];
			            for (i in data.searchResults) {
			                var val = data.searchResults[i];
			                results.push({id: val.id, text: val.groupName});
			            }
			            return {results: results, more: more};
			        }
			    }
            });
		}
		
		, getFormData : function(){
			var params = $('#forms-notificationRule').serializeObject();
			var ids = params.notificationGroupIds.split(",");
			params.notificationGroups = [];
			for(i in ids){
				if(ids[i] != null && ids[i].length>0){
					params.notificationGroups.push({id:ids[i]});
				}
			}
			delete params.notificationGroupIds;
			return params;
		}
		, create : function() {
			var params = NotificationRule.getFormData();
			delete params.id;
			$.ajax({
			      url: base_url + 'notificationRule/',
			      method: 'POST',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json',
			      data: JSON.stringify(params)
			     }).done(function(data, textStatus, jqXHR) {
			    	 mnaSaveResponseHandler(null, "success");
			    	 NotificationRule.loadSearchForm();
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			    	var data = $.parseJSON(jqXHR.responseText);
			    	mnaSaveResponseHandler(data, "error");
			    	NotificationRule.customErrorHighlightsDisplay(data);
			     });
		    
		}
		
		, preformDelete : function() {
			var idToDelete = $('#forms-notificationRule input[name=id]').val();
			deleteRow(idToDelete);
		}
		
		, customErrorHighlightsDisplay : function(data){
			if(data != null && data.messages != null && data.messages.notificationGroups != null){
	    		$('#s2id_notificationGroupIds ul').addClass('error');
	    	}
		}
		
		, edit : function (id){
		    $.ajax({
			      url: base_url + 'notificationRule/' + id,
			      method: 'GET',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json'
			     }).done(function(data, textStatus, jqXHR) {
			    	 var form = render('notificationRule_form', {'title':'Edit'});
					 showModalWindow('Edit Notification Rule', form, NotificationRule.update);
					 var selectedGroups = [];
					 for(i in data.notificationGroups){
						 if(data.notificationGroups[i]){
							 selectedGroups.push({id:data.notificationGroups[i].id, text:data.notificationGroups[i].groupName});
						 }
					 }
					 delete data.notificationGroups;
					 data.active = data.active + "";
					 $('#forms-notificationRule').populate(data);
					 NotificationRule.bindNotificationGroupSelect(selectedGroups);
					 $('#notificationGroupIds').select2('data', selectedGroups);
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			     });
		}
		
		, update : function() {
			var params = NotificationRule.getFormData();
			$.ajax({
			      url: base_url + 'notificationRule/' + params.id,
			      method: 'PUT',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json',
			      data: JSON.stringify(params)
			     }).done(function(data, textStatus, jqXHR) {
			    	 mnaSaveResponseHandler(null, "success");
			    	 NotificationRule.loadSearchForm();
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			    	var data = $.parseJSON(jqXHR.responseText);
			    	mnaSaveResponseHandler(data, "error");
			    	NotificationRule.customErrorHighlightsDisplay(data);
			     });
		}
	};
	
})();
var deleteRowDialog = function(idToDelete) {
	var template = "<h2>Delete Notification Rule?</h2>";
	template += "<div id='forms-notificationRule'><input type='hidden' name='id' value='" + idToDelete + "'/></div>";
	showModalWindow("Delete Notification Rule?", template, null, NotificationRule.preformDelete);
};

var deleteRow = function(idToDelete) {
	$.ajax({
	      url: base_url + 'notificationRule/' + idToDelete,
	      method: 'DELETE',
	      contentType: 'application/json',
	      async: true,
	      dataType:'json'
	     }).done(function(data, textStatus, jqXHR) {
	    	 NotificationRule.loadSearchForm();
	    	 closeModal();
	     }).fail(function(jqXHR, textStatus, errorThrown) {
	    	var data = $.parseJSON(jqXHR.responseText);
	    	mnaSaveResponseHandler(data, "error");
	     });
};

var editRow = function(idToEdit) {
	NotificationRule.edit(idToEdit);
};
