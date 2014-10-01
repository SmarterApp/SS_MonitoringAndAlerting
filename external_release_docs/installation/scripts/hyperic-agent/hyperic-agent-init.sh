#!/bin/bash -e

# Setup variables to hold helpful info about the env this script is running in.
#---------------------------------------------------------------------------------------
VM_USER=$(stat -c %U /opt/hyperic-agent/)
echo "Executing the commands as user: $VM_USER"
APP_NAME="hyperic-agent"
APP_LONG_NAME="HQ Agent"

### BEGIN INIT INFO
# Provides: @app.name@
# Required-Start: $local_fs $network $syslog
# Should-Start: 
# Required-Stop:
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: @app.long.name@
# Description: @app.description@
### END INIT INFO

#---------------------------------------------------------------------------------------

case $1 in

    'start')
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-agent/bin/hq-agent.sh start
        ;;

    'stop')
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-agent/bin/hq-agent.sh stop
        ;;

    'restart')
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-agent/bin/hq-agent.sh stop
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-agent/bin/hq-agent.sh start
        ;;
    *)
        echo "Invalid choice. Usage: $0 { start | stop | restart }"
        exit 1
        ;;
esac

exit 0
