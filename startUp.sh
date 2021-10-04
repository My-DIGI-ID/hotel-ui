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

CYAN='\033[0;36m'
RESET='\033[0m'

containerName=$(docker ps -f name=hotel-ui --format '{{.Names}}' | grep -w hotel-ui)

if [ -n "$containerName" ]; then
  docker stop "$containerName"
  docker rm "$containerName"
  printf "${CYAN}Running Docker container stopped and removed.${RESET}\n"
else
  printf "${CYAN}Docker container is not running.${RESET}\n"
fi

if [ "$1" = "dev" ]; then
  npm run buildAndStartAppInDevMode
else
  npm run buildAndStartAppInLocalMode
fi

