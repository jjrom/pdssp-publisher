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

const fetch = require('node-fetch')
const config = require('../config')

/**
 * Proxify STAC url
 * 
 * @param {Object} req Request object
 * @param {Object} res Response object
 */
async function proxify(req, res) {

	if (!config.INPUT_STAC_URL) {
		res.status(400).send()
	}
	
	const relativePath = '.' + req.originalUrl

	try {
		const response = await fetch(absoluteHref(config.INPUT_STAC_URL, relativePath))
		const text = await response.text()
		const data = JSON.parse(text)
		res.status(200).json(absoluteLinks(data, config.PUBLIC_ENDPOINT + req.originalUrl, relativePath))
	} catch (err) {
		console.log(err)
		res.status(404).json({
			status:404,
			message:'Not Found'
		})
	}
	
}

/**
 * Convert relative links to absolute one
 * 
 * @param {object} data
 * @param {string} url
 */
function absoluteLinks(data, url) {

	if ( !data || !data.links ) {
		return data
	}

	for (var i = 0, ii = data.links.length; i < ii; i++) {
		if ( !data.links[i].href || data.links[i].href.toLowerCase().indexOf('http') === 0 ) {
			continue
		}
		data.links[i].href = absoluteHref(url, data.links[i].href)
	}

	return data
}

function absoluteHref(base, rel) {
	var st = base.split("/");
	var arr = rel.split("/");
	if (rel === './') {
		return base
	}
	st.pop(); // ignore the current file name (or no string)
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == ".")
			continue;
		if (arr[i] == "..")
			st.pop();
		else
			st.push(arr[i]);
	}
	return st.join("/");
}

module.exports = {
	proxify
}
