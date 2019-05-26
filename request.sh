#!/usr/bin/env bash

# This script is being used to debug the project by...
# ...making request to the webserver it creates
curl \
--header "Content-Type: application/json" \
--request POST \
--data '{ "user":"alan" }' \
http://localhost:4000/data