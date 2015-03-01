/**
 * Response handling object for public api requests. Automatically sets the access-control-allow-origin All methods require a response object to be passed.
 * Warning, only use for public data exposure, access-control allows * domains
 */

// import library components
var Globals = require('./globals.js');

 var PublicResponses = {};

/**
 * Monadic function for applying headers to a response
 */
PublicResponses.writeHead = function(response, status, headers) {

	// import global default headers
	var responseHeaders = Globals.defaultPublicResponseHeaders;

	// add, or change, any headers passed by the user
	for(var i in headers) {
		responseHeaders[i] = headers[i];
	}

	response.writeHead(status, responseHeaders);
	return response;
}

/**
 * handles headers and responses for requests. Ends the response object.
 * Base function for all respond methods
 */
PublicResponses.respond = function(response, message, status, headers) {
	PublicResponses.writeHead(response, status, headers).end(message);
}

/**
 * handles a response with headers, message, and status passed. Calls PublicResponses.respond
 * as its base function
 */
PublicResponses.respondWithMessageAndHeaders = function(response, message, status, headers) {
	PublicResponses.respond(response, message, status, headers);
}

PublicResponses.respondWithMessage = function(response, message, status) {
	PublicResponses.respond(response, message, status, {});
}

PublicResponses.respondWithJSON = function(response, message, status) {
	PublicResponses.respond(response, JSON.stringify(message), status, {
		'Content-Type' : 'application/json'
	});
}

PublicResponses.respondOk = function(response) {
	PublicResponses.respond(response, 'OK', 200, {});
}

PublicResponses.respond404 = function(response) {
	PublicResponses.respond(response, '404. Not Found.', 404, {});
}

PublicResponses.respond500 = function(response) {
	PublicResponses.respond(response, '500. Internal Server Error.', 500, {});
}

 // expose our responses object
 module.exports = PublicResponses;