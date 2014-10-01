#!/bin/bash -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if tomcat is already installed
[ -d /opt/tomcat/ ] && exit 0

$DIR/../java/install.sh
$DIR/base-install.sh