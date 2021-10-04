#!/usr/bin/env sh
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

set -eu

jq -n env | grep -E '\{|\}|SSIBK_HOTEL_UI_' | sed ':begin;$!N;s/,\n}/\n}/g;tbegin;P;D' > /usr/share/nginx/html/configurations.json

exec "$@"
