#!/bin/bash -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS="$DIR/../"

# Make sure it isn't already installed
[ -d /opt/tomcat/ ] && exit 0

# Install tomcat 7 (authbind allows us to run it on port 80)
apt-get -y install tomcat7
/etc/init.d/tomcat7 stop
ln -s /var/lib/tomcat7 /opt/tomcat
echo "hello world" > /opt/tomcat/webapps/ROOT/index.html
echo "# Tomcat Defaults" > /etc/default/tomcat7
echo "TOMCAT7_USER=${VM_USER}" >> /etc/default/tomcat7
echo "TOMCAT7_GROUP=${VM_USER}" >> /etc/default/tomcat7
echo "JAVA_HOME=/opt/java" >> /etc/default/tomcat7
echo "JAVA_OPTS=\"-Djava.awt.headless=true -Xmx512m -XX:+UseConcMarkSweepGC\"" >> /etc/default/tomcat7
echo "AUTHBIND=yes" >> /etc/default/tomcat7

# Replace the PATH that clobbers everything else...
sed -i "s,PATH=/bin:/usr/bin:/sbin:/usr/sbin,$(cat /etc/environment | grep PATH),g" /etc/init.d/tomcat7

# Set CATALINA_OPTS (see comments in /usr/share/tomcat7/bin/catalina.sh for other settings)
mkdir -p /opt/tomcat/bin/
su - $VM_USER -c "mkdir -p /home/${VM_USER}/config"
CATALINA_OPTS="export CATALINA_OPTS=\"-Xms512m -Xmx1g -XX:PermSize=256m -Duser.timezone=America/Chicago -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=true -Dcom.sun.management.jmxremote.password.file=/opt/tomcat/conf/jmxremote.password -Dcom.sun.management.jmxremote.access.file=/opt/tomcat/conf/jmxremote.access -Djava.rmi.server.hostname=${FQDN} -DmnaServerName=${FQDN}\"" 
DRC_CONFIG_DIR="export DRC_CONFIG_DIR=/home/${VM_USER}/config"
SB11_CONFIG_DIR="export SB11_CONFIG_DIR=/home/${VM_USER}/config"
echo $CATALINA_OPTS >> /opt/tomcat/bin/setenv.sh
echo $DRC_CONFIG_DIR >> /opt/tomcat/bin/setenv.sh
echo $SB11_CONFIG_DIR >> /opt/tomcat/bin/setenv.sh
echo "<readonly-username> readonly" >> /opt/tomcat/conf/jmxremote.access
echo "<readwrite-username> readwrite" >> /opt/tomcat/conf/jmxremote.access
echo "<readonly-username <readonly-password>" >> /opt/tomcat/conf/jmxremote.password
echo "<readwrite-username> <readwrite-password>" >> /opt/tomcat/conf/jmxremote.password

# Setup tomcat for the virtual hosting... (and we need to add the additional jar to allow remote JMX since we define it in our canned tomcat-server.xml)
URL="http://repo1.maven.org/maven2/org/apache/tomcat/tomcat-catalina-jmx-remote/7.0.4/tomcat-catalina-jmx-remote-7.0.4.jar"
$SCRIPTS/utils/download-something.sh "${URL}" "/usr/share/tomcat7/lib/catalina-jmx-remote.jar"
cp $DIR/tomcat-server.xml /opt/tomcat/conf/server.xml

# Setting up authbind, cleaning things up, and restarting tomcat...
apt-get -y install authbind
chown -RLh $VM_USER.$VM_USER /opt/tomcat
chown -RLh $VM_USER.$VM_USER /var/log/tomcat7
chmod 755 -R /var/log/tomcat7
chown -RLh $VM_USER.$VM_USER /var/cache/tomcat7
ln -s /var/log/tomcat7 /usr/share/tomcat7/logs
touch /etc/authbind/byport/80
chmod 500 /etc/authbind/byport/80
chown $VM_USER.$VM_USER /etc/authbind/byport/80
/etc/init.d/tomcat7 restart
