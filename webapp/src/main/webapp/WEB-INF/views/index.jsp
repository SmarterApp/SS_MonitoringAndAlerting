<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<head>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title>MnA - Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    
    <script src="${mnaBaseUrl}resources/js/nothing.js"></script>

    <link href="resources/select2/select2.css" rel="stylesheet">
    <link href="resources/jquery/ui/redman/jquery-ui-1.10.2.custom.min.css" rel="stylesheet">
    <link href="resources/datatables/css/jquery.dataTables.css" rel="stylesheet">
    <link href="resources/datatables/css/jquery.dataTables_themeroller.css" rel="stylesheet">
    <link href="resources/tabletools/css/TableTools.css" rel="stylesheet">

    <link href="resources/sbac/css/core.css" rel="stylesheet">
    <link href="resources/sbac/css/fluid.css" rel="stylesheet">
    <link href="resources/sbac/css/fonts.css" rel="stylesheet">
    <link href="resources/mna/css/mna.css" rel="stylesheet">
    
    <!--[if gte IE 9]>
  <style type="text/css">
    .gradient { filter: none; }
  </style>
<![endif]-->
  </head>

  <body>
    <input type="hidden" id="baseUrl" value="${mnaBaseUrl}"/>
    
    <div class="container">
    <a id="skipNavigation" class="skipToContent" data-ng-click="#mainContent" href="#mainContent">Skip to Main Content</a>
    <div class="header">
      <div class="info">
        <ul>
          <li>Logged in as: ${user}</li>
          <li><a href="saml/logout">Logout</a></li>
        </ul>
      </div>
      <div class="banner" role="banner">
          <span class="logo homeLink"><a href="#"><img src="resources/sbac/images/logo_sbac.png" alt="Smarter Balanced Assessment Consortium" name="SBAC_logo"></a></span>       
          <span class="title"><h1>Monitoring and Alerting</h1></span>
        </div>
      </div>
      </div>
      
   
      <div id="homeLayout" class="content" role="main"> 
        <div class="boxWrap home">
            <div class="boxBg">
                                <span class="homeTitle"><h2 tabindex="-1">View Component Logs, Alerts & Metrics</h2></span>
                <div class="btnGroup">
                    <button class="homeBtn green searchLogsLink" value="View Logs" role="button" tabindex="0"><span class="btnText" role="button">View Logs</span><span class="homeIcon viewLogs" aria-hidden="true"></span><p>View and filter information from component logs</p></button>
                    <button class="homeBtn navy searchAlertsLink" value="View Alerts" role="button" tabindex="0"><span class="btnText" role="button">View Alerts</span><span class="homeIcon viewAlerts" aria-hidden="true"></span><p>Filter and view information from alert logs</p></button>
                    <button class="homeBtn maroon searchMetricsLink" value="View Metrics" role="button" tabindex="0"><span class="btnText" role="button">View Metrics</span><span class="homeIcon viewMetrics" aria-hidden="true"></span><p>View and filter information from monitoring metrics</p></button>
                </div>
            </div>
            <div class="line"></div>
            <div class="boxBg">
                <span class="homeTitle"><h2 tabindex="-1">Create/Edit Notifications</h2></span>
                <div class="btnGroup">
                    <button class="homeBtn navy searchNotificationGroupsLink arrow" value="Create/Modify Notification Groups" role="button" tabindex="0"><span class="btnText">Create/Modify <br>Notification Groups</span><span class="homeIcon notificationGroups" aria-hidden="true"></span><p>Create or modify groups of individuals to be notified for logs and alerts</p></button>
                    <button class="homeBtn maroon searchNotificationRulesLink" value="Create/Modify Notification Rules" role="button" tabindex="0"><span class="btnText">Create/Modify <br>Notification Rules</span><span class="homeIcon notificationRules" aria-hidden="true"></span><p>Create or modify rules that determine groups to notify based on content of logs and alerts</p></button>
                </div>
            </div>       
        </div>
        <div class="clear"></div>
        <div class="footer">
            <div id="footerText" class="footerText"></div>
        </div>
        
      </div> 
    <div class="slide-menu">
	<div class="content secondary"> 
	    <div class="nav" role="navigation">
	    <ol><li class="menuli searchLogsLink green" tabindex="0" role="button">View Logs<span aria-hidden="true"></span></li>
	    <li class="menuli searchAlertsLink navy" tabindex="0" role="button">View Alerts<span aria-hidden="true"></span></li>
	    <li class="menuli searchMetricsLink maroon" tabindex="0" role="button">View Metrics<span aria-hidden="true"></span></li>
	    <li class="menuli searchNotificationGroupsLink navy" tabindex="0" role="button">Create/Modify <br>
	      Notification Groups<span aria-hidden="true"></span>
	     </li>
		<li class="menuli searchNotificationRulesLink maroon" tabindex="0" role="button">Create/Modify <br>
	      Notification Rules<span aria-hidden="true"></span>
		</li></ol>
	</div>
	<a href="javascript:void(0);" class="slider-arrow" role="button" tabindx="0" value="Menu-Slider Button">&raquo;</a>
	</div>
    </div>  
      <div id="searchLayout" class="content">  
        <div class="boxWrap setup2">
            <div class="boxBg">
                <div class="saveConfirm">Your changes have been saved.</div>
                <div id="mainContent" class="secContent" tabindex="-1">
	                <div id="searchForm" class="fieldGroup"></div>
	                <h5 tabindex="-1">Search Results</h5>
	                <div id="searchResults" class="tableBox"></div>
                </div>
            </div>       
        </div>
    </div>
   
    <div id="modalWindow" class="modal hide" tabindex="-1" role="dialog"  aria-hidden="true">
        <div id="modal-alert" class="alert-message alert alert-error" style="top:0;">
          <div></div>
        </div>
    
        <div class="modal-body">
        
        </div>
        
        <div class="modal-footer fieldGroup">
            <button class="boxBtn deleteBtn"  id="modalDelete" role="button" value="Delete" tabindex="0">
                <span class="btnIcon icon_sprite icon_delete2" aria-hidden="true"></span>
                <span class="btnText red">Delete</span>
            </button>
            <button class="boxBtn saveBtn" id="modalSave" role="button" value="Save" tabindex="0">
                <span class="btnIcon icon_sprite icon_save2" aria-hidden="true"></span>
                <span class="btnText">Save</span>
            </button>           
	        <button class="boxBtn closeBtn"  id="modalClose" role="button" value="Close" tabindex="0">
                <span class="btnIcon icon_sprite icon_cancel2" aria-hidden="true"></span>
                <span class="btnText">Close</span>
            </button>
        </div>
    </div>
    
       <div id="modalHelp" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="helpLabel" aria-hidden="true">
            <div class="modal-body">
            </div>
	        <div class="modal-footer fieldGroup">
            <button class="boxBtn"  id="helpClose">
                <span class="btnIcon icon_sprite icon_cancel2"></span>
                <span class="btnText">Close</span>
            </button>
        </div>
    </div>
    <!-- Placed at the end of the document so the pages load faster -->
    
    <script src="resources/JSON/json2.js"></script>
    <script src="resources/jquery/jquery-1.9.1.min.js"></script>
    <script src="resources/jquery/ui/redman/jquery-ui-1.10.2.custom.min.js"></script>
    <script src="resources/underscore/underscore-min.js"></script>
    <script src="resources/datatables/js/jquery.dataTables.js"></script>
    <script src="resources/datatables/js/jquery.dataTables.rowGrouping.js"></script>
    <script src="resources/datatables/js/jquery.dataTables.sb11Paging.js"></script>
    <script src="resources/jquery/jquery.populate.pack.js"></script>
    <script src="resources/select2/select2.min.js"></script>
    <script src="resources/tabletools/js/TableTools.min.js"></script>
    <script src="resources/sbac/js/respond.min.js"></script>

    <script src="resources/mna/log.js"></script>
    <script src="resources/mna/alert.js"></script>
    <script src="resources/mna/metric.js"></script>
    <script src="resources/mna/notificationRule.js"></script>
    <script src="resources/mna/notificationGroups.js"></script>
    <script src="resources/mna/mna.js"></script>
    <script src="resources/mna/accessibleTable.js"></script>
  </body>
</html>
