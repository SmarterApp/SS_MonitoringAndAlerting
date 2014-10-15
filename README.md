# Welcome to the Monitoring and Alerting Application #
The Monitoring and Alerting (MnA) component aggregates Logging, Metrics, and Notifications. Log entries and notifications can be searched and managed through a central UI.

## License ##
This project is licensed under the [AIR Open Source License v1.0](http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf).

## Getting Involved ##
We would be happy to receive feedback on its capabilities, problems, or future enhancements:

* For general questions or discussions, please use the [Forum](http://forum.opentestsystem.org/viewforum.php?f=6).
* Use the **Issues** link to file bugs or enhancement requests.
* Feel free to **Fork** this project and develop your changes!

## Usage

Many of the Monitoring and Alerting modules require configuration to be setup in Program Management in order for the modules to configure themselves correctly.  A sample configuration file that includes all the properties can be found in: [the repository](external_release_docs/required-progman-configuration.properties).  The contents of the file can be copied and pasted into Program Management.

* `mna.mongo.hostname=mongo.host` - The server on which MongoDB is running
* `mna.mongo.port=27017` - MongoDB port
* `mna.mongo.user=` - MongoDB user
* `mna.mongo.password=` MongoDB password
* `mna.mongo.dbname=mna` - Name of the MongoDB database
* `mna.email.active=true` - Enable or disable email from MNA
* `mna.email.address.from=from@somecorp.com` - From address when email from MNA is sent
* `mna.email.subject.prefix=TEST EMAIL ONLY -` - Subject of email from MNA 
* `mna.email.host=email.host` - Host address of mail server
* `mna.email.port=465` - Email port
* `mna.email.user=emailuser` - Email username
* `mna.email.password=emailpassword` - Email password
* `mna.email.smtp.starttls.enable=true` - Start TLS enabled
* `mna.email.transport.protocol=smtp` - Email protocol used
* `mna.email.smtp.auth=true` - Use email authentication?
* `mna.email.smtp.ssl.enable=true` - Enable ssl over SMTP
* `mna.rest.context.root=/rest/` - MNA REST context root path
* `mna.clean.days=30` - How long to retain logs before cleaning out. Not required.  defaults to 30
* `mna.clean.cron=0 0 0 * * ?` - timing for cron job. Not required.  defaults to 0 0 0 * * ?

### REST Module
The REST module is a deployable WAR file (```monitoring-alerting.rest-VERSION.war```) that provides REST endpoints that can be used to access and modify Monitoring and Alerting data.  The REST module has an internal dependency to the SB11 Program Management Client.

In order to run the REST WAR application, all setup necessary for the Persistence module must be performed.  All setup to use the Program Management Client must also be performed.  Details for the usage of the Program Management Client can be found in the Program Management Readme.  The WAR should be deployed to a Tomcat-compatible application server.

### Webapp Module
The Webapp module is a deployable WAR file (```monitoring-alerting.webapp-VERSION.war```) that provides the administrative UI for Monitoring and Alerting functionality.  The Monitoring and Alerting UI provides search capabilities for aggregated log entries and notifications that have been sent by the system.  It also provides the ability to create and manage notification groups and set the triggers that will send notifications to users.

The Webapp module uses the REST module for all data access, but this is a runtime dependency through a REST endpoint and not a direct code dependency.  It also requires configuration to be setup in Program Management and it uses the Program Management Client to retrieve the configuration.  Details for the usage of the Program Management Client can be found in the Program Management Readme.
The WAR should be deployed to a Tomcat-compatible application server.

### Persistence Module
The Persistence module is a JAR artifact that is used by the REST and JMX modules.  It provides access to the data as well as services that can be invoked by other modules.

This module requires configuration to be set up in Program Management.  It will use the Program Management client to retrieve the configuration data.  Details for the usage of the Program Management Client can be found in the Program Management Readme.

### Domain Module
The domain module contains all of the domain beans used to model the Monitoring and Alerting data as well as code used as search beans to create Mongo queries.  It is a JAR artifact that is used by other modules.


## Build
These are the steps that should be taken in order to build all of the Monitoring and Alerting related artifacts.

### Pre-Dependencies
* Mongo 2.0 or higher
* Tomcat 6 or higher
* Maven (mvn) version 3.X or higher installed
* Java 7
* Access to sb11-shared-build repository
* Access to sb11-shared-code repository
* Access to sb11-rest-api-generator repository
* Access to sb11-program-management repository
* Access to sb11-monitoring-alerting repository

### Build order

* sb11-shared-build
* sb11-shared-code
* sb11-rest-api-generator
* sb11-program-management
* sb11-monitoring-alerting

Additional instructions are located in the [repository](external_release_docs/installation).

## Dependencies
Monitoring and Alerting has a number of direct dependencies that are necessary for it to function.  These dependencies are already built into the POM files.

### Compile Time Dependencies
* Apache Commons IO
* Apache Commons Beanutils
* Jackson Datatype Joda
* Hibernate Validator
* Apache Commons File Upload
* Java Mail
* SB11 Program Management
* SB11 Shared Code
	* Logback
	* SLF4J
	* JCL over SLF4J
	* Spring Core
	* Spring Beans
	* Spring Data MongoDb
	* Mongo Data Driver
	* Spring Context
	* Spring WebMVC
	* Spring Web
	* Spring Aspects
	* AspectJ RT
	* AspectJ Weaver
	* Javax Inject
	* Apache HttpClient
	* JSTL API
	* Apache Commons Lang
	* Joda Time
	* Jackson Core
	* Jackson Annotations
	* Jackson Databind
	* SB11 REST API Generator
	* JSTL
	* Apache Commons Lang
	

### Test Dependencies
* Spring Test
* Hamcrest
* JUnit 4
* Flapdoodle
* Podam
* Log4J over SLF4J
* JSONPath
* Tomcat Catalina JMX Remote

### Runtime Dependencies
* Servlet API
* EL API