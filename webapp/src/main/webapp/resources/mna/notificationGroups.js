
var NotificationGroup = (function(){
	return {
		
		loadSearchForm : function (){
			$(".slide-menu").show();
			toggleSelectMenu('searchNotificationGroupsLink');
			displaySearchForms();
			var searchTemplate = render('notificationGroup_search', {});
		    $("#searchForm").html(searchTemplate);
		    $("#notification-group-search").click(NotificationGroup.search);
		    $("#notification-group-add").click(NotificationGroup.add);
		    $('#searchResults').html('<table summary="Monitoring and Alerting Notification Groups"></table>');
		    $('#searchResults table').sb11DataTable({
		    	"fnRowDblClick": NotificationGroup.edit,
		        "url":  base_url + 'notificationGroup/',
		        "searchForm": '#forms-notificationGroup-search',
    	        "aoColumns": [
    	            { "sTitle":"Id", "sName":"id","mData": "id" , "bVisible":    false },
    	            { "sTitle":"Group Name", "sName":"groupName","mData": "groupName" },
    	            { "sTitle":"Active", "sName":"active","mData": "active" },
    	            { "sTitle":"Members", "sName":"memberNames","mData": "memberNames", "bSortable":false }
    	        ],
			    fnDrawCallback : function(oSettings){
			    	$("#" + oSettings.nTable.id).addClass('table-hover');
			    	$("#" + oSettings.nTable.id + " tr ").on("dblclick", function(event){
			    		var aData = $('#searchResults table').dataTable().fnGetData( this );
			            NotificationGroup.edit(aData.id);
			    	});
			    } 
	        });
		}
	
		, search : function (){
			$('#searchResults table').dataTable().fnPageChange('first');
		}
		
		, removeMember : function(member, inputSelector) {
			//delete member
			member.parent().remove();
			if($(inputSelector + ' input').length == 0){
				$(inputSelector).html("No members listed");
			}
		}
		
		, add : function (){
		    var form = render('notificationGroup_form', {'title':'Add'});
		    showModalWindow('Add Notification Group', form, NotificationGroup.create);
		   $('#forms-notificationGroup #addMember').click(NotificationGroup.addMember);
		   $('#forms-notificationGroup #addMember').keypress(NotificationGroup.addMember);
		}
		
		, addMember : function(value) {
			var inputSelector = '#forms-notificationGroup #memberInputs';
			if($(inputSelector + ' input').length == 0){
				$(inputSelector).html("");
			}
			var tmpl = '<div class="input-append"><input type="text" name="memberNames"/><span tabindex="0" class="add-on">x</span></div>';
			$(tmpl).appendTo(inputSelector);
			$(inputSelector + " input[name='memberNames']").focus();
			$(inputSelector + ' div.input-append .add-on').on('click', function(event){
				NotificationGroup.removeMember($(this), inputSelector);
			});
			$(inputSelector + ' div.input-append .add-on').on('keypress', function(event){
				NotificationGroup.removeMember($(this), inputSelector);
			});
		}
		
		, create : function() {
			var params = NotificationGroup.serializeForm();
			delete params.id;
			clearEmptyElements(params.memberNames);
			$.ajax({
			      url: base_url + 'notificationGroup/',
			      method: 'POST',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json',
			      data: JSON.stringify(params)
			     }).done(function(data, textStatus, jqXHR) {
			    	 mnaSaveResponseHandler(null, "success");
		    		 NotificationGroup.loadSearchForm();
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			    	var data = $.parseJSON(jqXHR.responseText);
			    	mnaSaveResponseHandler(data, "error");
			     });
		}
		
		, serializeForm : function(){
			var params = $('#forms-notificationGroup').serializeObject();
			if( !$.isArray(params.memberNames) && params.memberNames != null) {
			    params.memberNames = [params.memberNames];
			}
			return params;
		}
		
		, edit : function (id){
		    $.ajax({
			      url: base_url + 'notificationGroup/' + id,
			      method: 'GET',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json'
			     }).done(function(data, textStatus, jqXHR) {
			    	 var form = render('notificationGroup_form', {'title':'Edit'});
			    	 showModalWindow('Edit Notification Group', form, NotificationGroup.update, NotificationGroup.preformDelete);
					 $('#forms-notificationGroup #addMember').click(NotificationGroup.addMember);
					 $('#forms-notificationGroup #addMember').keypress(NotificationGroup.addMember);
					 var members = data.memberNames;
					 delete data.memberNames;
					 data.active = data.active + "";
					 $('#forms-notificationGroup').populate(data);
					 for(i in members) {
						 NotificationGroup.addMember();
						 $('#forms-notificationGroup #memberInputs div:last-child input').val(members[i]);
					 }
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			     });
		}
		
		, preformDelete : function() {
			var idToDelete = $('#forms-notificationGroup input[name=id]').val();
			$.ajax({
			      url: base_url + 'notificationGroup/' + idToDelete,
			      method: 'DELETE',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json'
			     }).done(function(data, textStatus, jqXHR) {
			    	 NotificationGroup.loadSearchForm();
			    	 closeModal();
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			    	 var data = $.parseJSON(jqXHR.responseText);
			    	 mnaSaveResponseHandler(data, "error");
			     });
		    
		}
		
		, update : function() {
			var params = NotificationGroup.serializeForm();
			clearEmptyElements(params.memberNames);
			$.ajax({
			      url: base_url + 'notificationGroup/' + params.id,
			      method: 'PUT',
			      contentType: 'application/json',
			      async: true,
			      dataType:'json',
			      data: JSON.stringify(params)
			     }).done(function(data, textStatus, jqXHR) {
			    	 mnaSaveResponseHandler(null, "success");
			    	 NotificationGroup.loadSearchForm();
			     }).fail(function(jqXHR, textStatus, errorThrown) {
			    	var data = $.parseJSON(jqXHR.responseText);
			    	mnaSaveResponseHandler(data, "error");
			     });
		}
	};
	
})();









