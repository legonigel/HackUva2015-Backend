#!/bin/env node

/**
 * Node.js server request handlers
 */

// import global variables and dependencies
var fs 				= require('fs');
var url 			= require('url');
var https 			= require('https');
var Globals 		= require('./globals.js');
var Routers 		= require('./routers.js');
var Mimes 			= require('./mimes.js');
var API 			= require('./api.js');
var PublicResponses	= require('./public_responses.js');

var Handlers = {};

/**
 * determine if API message is to be served (GET) or posted (POST)
 */
Handlers.handleRequestAsAPIMessageEndpoint = function(request, response) {

	if(request.method != 'POST') {
		return PublicResponses.respondWithMessage(response, 'Warning: This endpoint requires POST method.', 500);
	}

	var postBody = '';

	// get response body
	request.on('data', function(chunk) {
		postBody += chunk;
	});

	request.on('end', function() {

		var postBodyAsJSON = {};
		var postBodyFragments = postBody.split('&');

		postBodyFragments.forEach(function(bodyFragment) {
			var bodyFragmentPair = bodyFragment.split('=');
			postBodyAsJSON[bodyFragmentPair[0]] = bodyFragmentPair[1];
		});

		// calculate the current time stamp
		var date = new Date();
		var dateISOString = date.toISOString().replace(/T/gi, ' ').split('.')[0];

		// check to see that the correct message parameters were sent and post message to the database
		if(postBodyAsJSON['sender'] && postBodyAsJSON['recipient'] && postBodyAsJSON['message'] && postBodyAsJSON['conversation_id']) {
			API.postMessageToDatabase(postBodyAsJSON['sender'], postBodyAsJSON['recipient'], postBodyAsJSON['message'], dateISOString, postBodyAsJSON['conversation_id'], function(err, rows, columns) {
				
				if(err) {
					PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
				}

				PublicResponses.respondWithMessage(response, 'success', 200);
			});
		} else {
			PublicResponses.respondWithMessage(response, '', 500);
		}

	});

}

/**
 * POSTs current api request to endpoint uri and returns response to client
 */
Handlers.handleRequestAsAPIPOSTCall = function (request, response) {

	var APIURI 				= request.url.split('/api/post/')[1];
	var URIComponents		= url.parse(APIURI);
	var POSTDataFromClient 	= '';
	var APIResponseData 	= '';

	if(APIURI == '') {
		response.writeHead(Globals.SERVER_HEAD_ERROR);
		return response.end(Globals.SERVER_RES_ERROR);
	}

	// receive data to relay from client
	request.on('data', function(chunk) {
		POSTDataFromClient += chunk;
	});

	request.on('end', function() {

		var APIPostRequest = https.request({

			host 	: URIComponents.host,
			path 	: URIComponents.path,
			href 	: URIComponents.href,
			method 	: 'POST',
			headers : {
				'Content-Type' : request.headers['content-type']
			}

		}, function(APIResponse) {

			APIResponse.on('data', function(chunk) {
				APIResponseData += chunk;
			});

			APIResponse.on('end', function() {

				response.writeHead(Globals.SERVER_HEAD_OK, {
					'Content-Type' : 'text/html',
				});

				console.log(APIResponseData);
				response.end(APIResponseData);

			});

		}).end(POSTDataFromClient);

	});
}

/**
 * Serves current request as a stream from a file on the server
 */
Handlers.handleRequestAsFileStream = function (request, response) {

	var requestToHandle = Routers.requestRouter(request, response);

	fs.readFile(Globals.rootDirectory + '/' + requestToHandle, function(error, data) {

		if(error) {

			console.log('File ' + requestToHandle + ' could not be served -> ' + error);
			
			response.writeHead(Globals.SERVER_HEAD_NOTFOUND);
			response.end(Globals.SERVER_RES_NOTFOUND);
		}

		response.writeHead(Globals.SERVER_HEAD_OK, {
			'Content-Type' : Mimes.mimeTypeParser(request, response)
		});

		response.end(data);

	});

}

/** 
 * Handle all server requests
 */
Handlers.mainRequestHandler = function(request, response) {

	// assign global definition for current request being handled
	Globals.currentRequest = Routers.requestRouter(request, response);

	if(typeof Globals.currentRequest == 'function') {
		Handlers[Globals.currentRequest()](request, response);
	} else if(Globals.currentRequest.match(/^\/test(\/)?$/gi)) {
		response.writeHead(Globals.SERVER_HEAD_OK);
		response.end(Globals.SERVER_RES_OK);
	} else if(Globals.currentRequest.match(/^\/api\/([a-z0-9\/])+/gi)) {
		API.parseGETRequest(request, response);
	} else {
		Handlers.handleRequestAsFileStream(request, response);
	}
}

// expose our api
module.exports = Handlers;