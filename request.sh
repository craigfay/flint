#!/usr/bin/env bash
curl \
--header "Content-Type: application/json" \
--request POST \
--data '{ "user":"alan" }' \
http://localhost:4000/data