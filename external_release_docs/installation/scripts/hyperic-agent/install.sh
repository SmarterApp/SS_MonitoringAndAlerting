#!/bin/bash -e
# Setup our install location
HYPERIC_AGENT_HOME=/opt/hyperic-agent

# The directory this script resides in
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS="$DIR/../"

# Exit if we've already installed it
[ -d /opt/hyperic-agent ] && exit 0

# Download the agent and install it
URL="http://downloads.sourceforge.net/project/hyperic-hq/Hyperic%205.0.0/hyperic-hq-agent-x86-64-linux-5.0.0.tar.gz?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fhyperic-hq%2Ffiles%2FHyperic%25205.0.0%2F&ts=1361334597&use_mirror=superb-dca3"
$SCRIPTS/utils/download-something.sh "${URL}" "/tmp/hyperic-hq-agent-x86-64-linux-5.0.0.tar.gz"
tar -C /tmp/ -xvzf /tmp/hyperic-hq-agent-x86-64-linux-5.0.0.tar.gz
mv /tmp/hyperic-hq-agent-5.0.0 /opt
chown -R $VM_USER.$VM_USER /opt/hyperic-hq-agent-5.0.0
ln -s /opt/hyperic-hq-agent-5.0.0 /opt/hyperic-agent
cp $DIR/hyperic-agent.properties /opt/hyperic-agent/conf/agent.properties
HYPERIC_SERVER="sb11-hyperic.drc-ec2.com"
[ "${VM_TYPE}" ] && HYPERIC_SERVER="sb11-hyperic-${VM_TYPE}.drc-ec2.com"
sed -i "s,XXXXX,${HYPERIC_SERVER},g" /opt/hyperic-agent/conf/agent.properties
sed -i "s,FQDN,${FQDN}, g" /opt/hyperic-agent/conf/agent.properties

# Add the additional jar to allow remote JMX
URL="http://repo1.maven.org/maven2/org/apache/tomcat/tomcat-catalina-jmx-remote/7.0.4/tomcat-catalina-jmx-remote-7.0.4.jar"
$SCRIPTS/utils/download-something.sh "${URL}" "/opt/hyperic-agent/bundles/agent-5.0.0/lib/catalina-jmx-remote.jar"

# Set it up so that it starts on boot
cp $DIR/hyperic-agent-init.sh /etc/init.d/hyperic-agent
chmod 755 /etc/init.d/hyperic-agent
update-rc.d hyperic-agent defaults 99
chown $VM_USER.$VM_USER /etc/init.d/hyperic-agent
chown -R $VM_USER.$VM_USER /opt/hyperic-agent
chmod -R 755 /opt/hyperic-agent

# Start up the agent (note: for some reason a slight delay helps fix a problem starting)
echo "/etc/init.d/hyperic-agent start" | at now + 1 minute