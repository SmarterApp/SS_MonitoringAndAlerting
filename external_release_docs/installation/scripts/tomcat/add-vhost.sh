#!/bin/bash -e

#--------------------------------------------------------------
# This script will add a virtual host to a tomcat installation
#--------------------------------------------------------------

EXPECTED_ARGS=1
if [ $# -ne $EXPECTED_ARGS ]; then
  echo "Usage: `basename $0` <domain-name>"
  echo "Example: `basename $0` sb11-tib"
  exit 1
fi

DOMAIN_NAME="${1}.drc-ec2.com"
case $1 in *.drc-ec2.com) DOMAIN_NAME="${1}";; esac
[ "$VM_TYPE" ] && DOMAIN_NAME="${1}-${VM_TYPE}.drc-ec2.com"

# ---------------------------------------------------------------------------
# NOTE: For this to work locally when using vagrant, you need to update
# your hosts file (/etc/hosts on Linux and Mac) to map the VMs IP
# to the domain name defined below otherwise it will hit the real server
# ---------------------------------------------------------------------------

# WARs should be deployed as ROOT.war to their respective webapps directory.

[ -d /opt/tomcat/${DOMAIN_NAME}/ ] && exit 0
mkdir -p /opt/tomcat/${DOMAIN_NAME}/
chmod 755 /opt/tomcat/${DOMAIN_NAME}/
chown -R $VM_USER.$VM_USER /opt/tomcat/${DOMAIN_NAME}
ENGINE_SPACE="      "
HOST_SPACE="         "
VALVE_SPACE="            "
VHOST="${HOST_SPACE}<Host name=\"${DOMAIN_NAME}\" appBase=\"${DOMAIN_NAME}\" unpackWARs=\"true\" autoDeploy=\"true\">\n${VALVE_SPACE}<Valve className=\"org.apache.catalina.valves.AccessLogValve\" directory=\"logs\" prefix=\"${DOMAIN_NAME}_log.\" suffix=\".txt\" pattern=\"%h %l %u %t \&quot\;%r\&quot\; %s %b\"/>\n${HOST_SPACE}</Host>"
sed -i "s,${ENGINE_SPACE}</Engine>,${VHOST}\n${ENGINE_SPACE}</Engine>,g" /opt/tomcat/conf/server.xml
/etc/init.d/tomcat7 restart
