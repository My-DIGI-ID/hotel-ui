#!/bin/sh
#
# Copyright 2021 Bundesrepublik Deutschland
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# get the last tag that is a semver, e.g. 0.1.0
LAST_TAG=`git tag | grep -Eo [0-9]+\.[0-9]+\.[0-9]+ | sort -t "." -k1,1n -k2,2n -k3,3n | tail -1`

# split the tag into major minor and patch 
VERSION_ARRAY=$(echo $LAST_TAG | sed 's/\./\ /g')
LAST_MAJOR=$(echo $VERSION_ARRAY | awk '{print $1;}')
LAST_MINOR=$(echo $VERSION_ARRAY | awk '{print $2;}')
LAST_PATCH=$(echo $VERSION_ARRAY | awk '{print $3;}')

# print calculated
echo "$LAST_MAJOR.$LAST_MINOR.$(( $LAST_PATCH + 1 ))"
