#!/bin/bash -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS="$DIR/../"

# Don't do anything if it's already installed
[ -d "/opt/hyperic-server" ] && exit 0

# Install hyperic server
apt-get install bc
mkdir -pv /opt/hyperic-hq-server-5.0.0
FILE="hyperic-hq-installer-x86-64-linux-5.0.0.tar.gz"
URL="http://downloads.sourceforge.net/project/hyperic-hq/Hyperic%205.0.0/hyperic-hq-installer-x86-64-linux-5.0.0.tar.gz?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fhyperic-hq%2Ffiles%2FHyperic%25205.0.0%2F&ts=1361902169&use_mirror=superb-dca2"
$SCRIPTS/utils/download-something.sh "${URL}" "/tmp/${FILE}"
tar -C /tmp/ -xvzf /tmp/${FILE}
cp $DIR/hyperic-install.properties /tmp/hyperic-hq-installer-5.0.0/installer/data
/tmp/hyperic-hq-installer-5.0.0/installer/data/hqdb/tune-os.sh
chown -R $VM_USER.$VM_USER /tmp/hyperic-hq-installer-5.0.0
chown -R $VM_USER.$VM_USER /opt/hyperic-hq-server-5.0.0
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ These hyperic scripts need help...
sed -i "s,exit,exit 0,g" /tmp/hyperic-hq-installer-5.0.0/setup.sh
sed -i "s,exit 0,,g" /tmp/hyperic-hq-installer-5.0.0/installer/bin/hq-setup.sh
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
su - $VM_USER -c '/tmp/hyperic-hq-installer-5.0.0/setup.sh /tmp/hyperic-hq-installer-5.0.0/installer/data/hyperic-install.properties'
mv /opt/hyperic-hq-server-5.0.0 /opt/hyperic-hq-server-5.0.0.tmp
mv /opt/hyperic-hq-server-5.0.0.tmp/server-5.0.0 /opt/hyperic-hq-server-5.0.0
rm -rf /opt/hyperic-hq-server-5.0.0.tmp
ln -s /opt/hyperic-hq-server-5.0.0 /opt/hyperic-server
cp $DIR/hyperic-server-init.sh /etc/init.d/hyperic-server
chmod 755 /etc/init.d/hyperic-server
update-rc.d hyperic-server defaults 90
chown $VM_USER.$VM_USER /etc/init.d/hyperic-server
chown -R $VM_USER.$VM_USER /opt/hyperic-server
chmod -R 755 /opt/hyperic-server
chmod 700 /opt/hyperic-server/hqdb/data
/etc/init.d/hyperic-server start

# add a bit of a delay here to make sure that the server starts up completely before the agent gets started
sleep 60

# Install hyperic agent
$SCRIPTS/hyperic-agent/install.sh

# Install a vhost in apache to expose hyperic-server UI on port 80
$SCRIPTS/apache/install.sh
$SCRIPTS/apache/add-vhost.sh $DIR/apache-default "${FQDN}"
/etc/init.d/apache2 restart