#!/bin/bash -e

# Setup variables to hold helpful info about the env this script is running in.
#---------------------------------------------------------------------------------------
VM_USER=$(stat -c %U /opt/hyperic-server/)
echo "Executing the commands as user: $VM_USER"
APP_NAME="hyperic-server"
APP_LONG_NAME="HQ Server"

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
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-server/bin/hq-server.sh start
        ;;

    'stop')
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-server/bin/hq-server.sh stop
        ;;

    'restart')
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-server/bin/hq-server.sh stop
        sudo -u $VM_USER -g $VM_USER /opt/hyperic-server/bin/hq-server.sh start
        ;;
    *)
        echo "Invalid choice. Usage: $0 { start | stop | restart }"
        exit 1
        ;;
esac

exit 0
