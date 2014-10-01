Section 1&2: (I have read & it looks good. I will proof it & get you my edits as time allows)

Section 3: Use Case Figure:
* designPics/MnA_usecase.jpg

Section 4: (Nice treatment)

Section 5: Data View
(no conceptual data model required)
(Physical Data model is being authored...I'll get this to you today)

Section 6: Layered View
* designPics/MnA_jmx_layers.jpg
* designPics/MnA_rest_layers.jpg

Section 7: Dynamic View
Preface: The sequence diagrams have been created to be used as a guided tour through the code
	the diagrams do not encorporate every endpoint or process flow, but rather highlight 
	representative patterns within the application's design. The sequence diagrams are best 
	consumed with the code base. 

	Update & Delete patterns have been ommitted as the pattern is very similar to the create
	with no significant design points of interest.

	NOTE: The sequence diagrams' 'source' files are located in the M&A repository under docs/sequenceDiagrams.
	There is a readme.md in that directory that includes instructions on how to generate/edit the
	diagrams on websequencediagrams.com


* 7.1 Sequence Diagram -  Get Lookup Values for WebApp
	sequenceDiagrams/referenceController.txt

	The following diagram shows the endpoints used for looking up (READ ONLY) refernce data
		used by the webapp. These values are derived from operational and registration data
		within the Monitoring and Alerting data store.

* 7.2 Sequence Diagram -  Create Alert 
	sequenceDiagrams/createAlert.txt
	
	The following diagram is representative of the create pattern used for
		most persisted entities in Monitoring and Alerting. The general pattern 
		applies for most entities appearing in Section 5 Physical Data Model.
		Any special cases (such as create metric) have been included as separate models.


* 7.3 Sequence Diagram -  
	sequenceDiagrams/searchLog.txt 

	The following diagram is representative of the search pattern used for
		most persisted entities in Monitoring and Alerting. The general pattern 
		applies for most entities appearing in Section 5 Physical Data Model.

* 7.4 Sequence Diagram -  
	sequenceDiagrams/registerComponent.txt

	The following diagram shows the component registration process that integrates into 
		the Hyperic HQ application. By registering a component, administrators can see
		a component (and its associated metrics) in the Hyperic console. By default, a
		Availiability metric is also registered at startup time. This availability metric periodically
		provides a 'heartbeat' that will create an alert if not provided for a period of time.

* 7.5 Sequence Diagram -  
	sequenceDiagrams/registerMetricInfo.txt

	The following diagram shows the metric registration process that integrates a specific 
		data element with the Hyperic HQ application. By registering a metric, administrators can see
		the components data with in the Hyperic console. Some examples of SB11 metrics are:
		Avalablity, as well as Performance (which log the time taken to perform a specific method).
		A MetricInfo can be registered ahead of time or as needed (see "Create Metric" ) when a metric is created.

* 7.6 Sequence Diagram -  
	sequenceDiagrams/createPerformancMetric.txt

	The following diagram shows how a metric is created using Aspect Oriented Programming (AOP). The 
		benefit of AOP is that the method can be 'decorated' to log performance without having to change
		the logic of the method itself. The use of spring AOP and pointcuts separates the concerns.

		Given that the application may not want to register every possible method that may have its 
		performance measued, MetricInfos can be dynamically registered (see "Create Metric" ) when a metric is created.
		The performace metric is created by a base class in the Monitoring and Alerting Client jar. 


* 7.7 Sequence Diagram -  
	sequenceDiagrams/createMetric.txt

	The following diagram illustrates the creation of a metric. Also included in this flow is the dynamic
		registration of a MetricInfo as needed. 

* 7.8 Sequence Diagram -  
	sequenceDiagrams/createLogInMnA.txt

	The following diagram illustrates the creation of a log. This highlights the use of a custom Log4J 
		appender which utilizes the Monitoring and Alerting Client jar. 
		NOTE: Test Item Bank has been integrated to use this appender to centralize it's logging into M&A


7.9
	The following four sequence diagrams depict asyncronous scheduled jobs that perform various maintinance
		tasks at regular intervals. The majority of the tasks need to be scheduled due to timing prerequistes 
		constrained by the Hyperic API. Additionally, the dynamic nature of metrics and components requires
		the ability to change Hyperic without requiring downtime.

* 7.9.1 Sequence Diagram -  
	sequenceDiagrams/asyncAutoApprover.txt

	The following sequence diagram captures the scheduled process that approves resources which were auto discovered 
		by the Hyperic agent/HQ. These resources may include servers, as well as SB11 components and metrics
		as well.

* 7.9.2 Sequence Diagram -  
	sequenceDiagrams/asyncAlertCreator.txt


	The following sequence diagram captures the scheduled process that creates a default alert for Availability Metrics
		when a component registers itself. The alert is a simple email alert that is customizable in the property 
		files utilized by Monitoring and Alerting. The alert will be generated by Hyperic HQ utilizing some defaulted
		values that are applicable to Availiablity (heartbeat) metrics. The reason this process happens on a schedule
		is due to the need for a metric to have been created before an alert definition can be created in Hyperic. 


* 7.9.3 Sequence Diagram -  
	sequenceDiagrams/asyncMetricLoader.txt

	The following sequence diagram captures the scheduled process that prepopulates the resouce cache utilized by the 
		other scheduled asyncronous processes. The reason this process happens on a schedule s due to the need for a metric to have been created before a resource can be accessed in Hyperic HQ.


* 7.9.4 Sequence Diagram -  
	sequenceDiagrams/asyncMetricRefresher.txt

	The following sequence diagram captures the scheduled process that custimizes attributes on created metrics. The
		attribute currently modified is the refresh rate. This allows the component to customize how frequently a
		metric will be captured and graphed in HQ. For Example: the refresh rate varies by metric type: Availiabity may have a less	frequent refresh rate than a Performance metric.

Section 8: 

	8.3: (I may make this more generic, as it is well described in the pom.xml)

Section 9: Deployment View
* designPics/MnA_webapp_deployment.jpg
* designPics/MnA_rest_deployment.jpg
* designPics/MnA_jmx_deployment.jpg

Section 10-12: (should be about the same. We're not doing anything real new here. 
I will proof it & get you my edits as time allows)

Section 13 API: this is a new section, I think you can encorporate the API docs being generated as you see fit.