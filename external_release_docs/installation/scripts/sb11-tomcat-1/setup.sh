#!/bin/bash -e

$DRCEC2/common-scripts/tomcat/install.sh
$DRCEC2/common-scripts/tomcat/add-vhost.sh "sb11-tib"
$DRCEC2/common-scripts/tomcat/add-vhost.sh "sb11-ma"
$DRCEC2/common-scripts/hyperic-agent/install.sh
