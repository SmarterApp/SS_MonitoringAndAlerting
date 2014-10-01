#!/bin/bash -e

$DRCEC2/common-scripts/java/install.sh

# Install the hyperic server
$DRCEC2/common-scripts/hyperic-server/install.sh
