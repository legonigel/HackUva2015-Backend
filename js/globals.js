/**
 * Conatins global pointers for app and facebook
 * API pointers
 */

// main facebook api object
var Facebook 							= null;
var isLoggedIn 							= false;
var facebookUserAuthenticationResponse 	= null;
var facebookAppPermissions 				= 'public_profile,user_friends';