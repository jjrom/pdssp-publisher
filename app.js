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

// Packages initialization
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const services = require('./app/services')

// [IMPORTANT] HOST is set to 0.0.0.0 to be called outside of docker 
const PORT = 80;
const HOST = '0.0.0.0';

var app = express()

// Allow cors on this API
app.use(cors())

// Fix AWS wrong headers
app.use(function (req, res, next) {
	if (req.headers['x-amz-sns-message-type']) {
		req.headers['content-type'] = 'application/json;charset=UTF-8'
	}
	next()
})

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/*
 * Routes
 */
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(404);
});
app.get('/*', services.proxify);

// Start the server on localhost only
app.listen(PORT, HOST, function () {
	console.log('stac-proxy ' + process.pid + ' running on http://' + HOST + ':' + PORT + ' to all incoming requests')
})

// This is for clustering
process.on('message', function (message) {
	if (message.type === 'shutdown') {
		process.exit(0)
	}
})
