/**
 * stac-proxy
 *
 * Copyright 2023 Jérôme Gasperi
 *
 * Licensed under the Apache License, version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 */

const config = {

    // Input STAC URL
    INPUT_STAC_URL: process.env.INPUT_STAC_URL,

    // Public endpoint - without trailing /
    PUBLIC_ENDPOINT: process.env.PUBLIC_ENDPOINT

};

module.exports = config