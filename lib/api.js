#!/bin/env node

/**
 * Core api functions. Handles functions exposed by the public api endpoints. The API module is invoked any time a request
 * is sent with /api/... at its root.
 */

// import Database object
var Database 		= require('./database.js');
var PublicResponses = require('./public_responses.js');

var API = {};

/**
 * adds a message to the database
 */
API.postMessageToDatabase = function(sender, recipient, header, body) {
	// Database.insertInto();
}

/**
 * Fetch an individual message for a user from mysql database. Returns as JSON response
 *
 * @param messageId = [Integer]		id of message to fetch
 * @param callback 	= [Function]	function to call after message is returned
 */
API.getMessageFromDatabase = function(messageId, callback) {
	Database.selectFrom('keeptouch_message', ['*'], 'id="' + messageId + '"', callback);
}

/**
 * Fetch an individual conversation for a pair of users from mysql database. Returns as JSON response
 * Does NOT include any messages. Simply the conversation's data
 *
 * @param conversationId 	= [Integer]		id of conversation item to fetch (Does NOT include messages)
 * @param callback 			= [Function]	function to call after message is returned
 */
API.getConversationFromDatabase = function(conversationId, callback) {
	Database.selectFrom('keeptouch_conversation', ['*'], 'id="' + conversationId + '"', callback);
}

/**
 * Requires a conversation id. Returns the last 20 messages in a conversation between two users,
 * ordered by message timestamp.
 *
 * @param conversationId 	= [Integer] id of conversation to return
 * @param callback			= [Function] id of second user participating in conversation to fetch
 */
API.getConversationMessagesFromDatabase = function(conversationId, callback) {
	Database.selectFrom('keeptouch_message', ['*'], 'conversation_id="' + conversationId + '" ORDER BY timestamp ASC LIMIT 20', callback);
}

/**
 * Returns all conversations where a user is either the recipient or sender. Ordered by timestamp, descending. Includes the latest message for each conversation in
 * the returned object.
 * 
 * @param recipientId 	= [Integer] 	id of recipient to return messages by sender for
 * @param callback		= [Function]	function to call after query returns
 */
API.getConversationsForRecipientIdFromDatabase = function(recipientId, callback) {
	Database.selectFrom('keeptouch_conversation', ['*'], 'reciever_id="' + recipientId + '" OR sender_id="' + recipientId + '"', callback);
}

/**
 * Parse any request with /api/ as its root
 */
API.parseGETRequest = function(request, response) {

	var apiRequest = request.url.split('/api/')[1];
	var apiRequestFragment = apiRequest.split('/');

	// handle a get-message request. Fetch a single message by message_id
	if(apiRequestFragment[0] == 'message') {

		API.getMessageFromDatabase(apiRequestFragment[1], function(err, rows, cols) {

			if(err) {
				console.log('Mysql error: ' + err);
				return PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
			}

			PublicResponses.respondWithJSON(response, rows, 200);

		});

		// handle multiple mssage fetching by conversation-batches (conversation_id)
	} else if(apiRequestFragment[0] == 'messages') {

		// fetch all messages for a conversation_id
		if(apiRequestFragment[1] == 'conversation') {

			// check to see that a conversation id is given
			if(!apiRequestFragment[2]) {
				return PublicResponses.respondWithMessage(response, 'Api error: A conversation id is required', 500);
			}

			API.getConversationMessagesFromDatabase(apiRequestFragment[2], function(err, rows, cols) {

				if(err) {
					return PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
				}

				PublicResponses.respondWithJSON(response, rows, 200);

			});

		} else {
			PublicResponses.respondWithMessage(response, 'unimplemented api', 500);
		}

		// handle single-conversation fetching by conversation_id
	} else if(apiRequestFragment[0] == 'conversation') {
		
		// get a single conversation item
		API.getConversationFromDatabase(apiRequestFragment[1], function(err, rows, cols) {

			if(err) {
				return PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
			}

			PublicResponses.respondWithJSON(response, rows, 200);
		});

		// handle multiple conversation fetching by user_id
	} else if(apiRequestFragment[0] == 'conversations') {

		// get all conversations where user_id is participating
		if(apiRequestFragment[1] == 'user') {

			// check to see that a user id is given
			if(!apiRequestFragment[2]) {
				return PublicResponses.respondWithMessage(response, 'Api error: A user id is required', 500);
			}

			API.getConversationsForRecipientIdFromDatabase(apiRequestFragment[2], function(err, rows, cols) {

				if(err) {
					return PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
				}

				PublicResponses.respondWithJSON(response, rows, 200);

			});

		} else {
			PublicResponses.respondWithMessage(response, 'unimplemented api', 500);
		}

		// handle multiple contact fetching by user_id
	} else if(apiRequestFragment[0] == 'contacts') {

		// get all contacts where user_id is user_from
		if(apiRequestFragment[1] == 'user') {

			// check to see that a user id is given
			if(!apiRequestFragment[2]) {
				return PublicResponses.respondWithMessage(response, 'Api error: A user id is required', 500);
			}

			API.getConversationsForRecipientIdFromDatabase(apiRequestFragment[2], function(err, rows, cols) {

				if(err) {
					return PublicResponses.respondWithMessage(response, 'Mysql error: ' + err, 500);
				}

				PublicResponses.respondWithJSON(response, rows, 200);

			});

		} else {
			PublicResponses.respondWithMessage(response, 'unimplemented api', 500);
		}

	} else {
		PublicResponses.respondWithMessage(response, 'Unimplemented api request: ' + apiRequest, 500);
	}

}

// expose our api functions
module.exports = API;