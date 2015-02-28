/**
 * Loads and initializes main app views and modals. 
 */

/**
 * Called after the FBAsync script is done loading
 */
function initialize(FB) {

	// initialize the app view references
	initializeAppViews();

	// assign FB pointer to global variabke
	Facebook = FB;

	// get login status and handle response
    Facebook.getLoginStatus(function(response) {
      checkLoginStatus(response);
    });

}

/**
 * initializes handling of facebook login status
 */
function checkLoginStatus(response) {

	// determine if user is already logged in
	if(response.status === 'connected') {
		handleUserAuthentication(response);
	} else {

		// replace loader with login button
		var loginButton 		= document.createElement('button');
		loginButton.type 		= 'submit';
		loginButton.className 	= 'btn btn-default fb-login-button';

		loginButton.addEventListener('click', function() {
			Facebook.login(handleUserAuthentication, {
				scope : facebookAppPermissions
			});
		});

		View.mainThumbnailOutput.removeChild(View.mainThumbnailOutput.children[0]);
		View.mainThumbnailOutput.appendChild(loginButton);

	}

}

/**
 * Requires user to be logged in. Called after API has loaded, 
 * and user authentication has been handled
 *
 * @param callback Function to be calledonce all three facebook api requests are returned
 */
function fetchUserInformation(callback) {

	var apiRequestsLoaded = 0;

	// make sure parameter passed is of type function
	if(typeof callback != 'function') {
		callback = function() {};
	}

	// fetch basic user information and store it globaly
	Facebook.api('/me', function(response) {
		
		User.id 		= response.id
		User.first_name = response.first_name
		User.last_name 	= response.last_name
		User.is_online 	= true;

		handleApiRequestLoad();

	});

	// fetch user thumbnail
	Facebook.api('/me/picture?redirect=0', function(response) {
		User.thumb = response.data;
		handleApiRequestLoad();
	});

	// fetch user friend's list
	Facebook.api('/me/friends', function(response) {
		User.friends = response;
		handleApiRequestLoad();
	});

	// handles an api request load
	function handleApiRequestLoad() {

		// check to see that all three user requests have loaded
		// and saved respective information to global variables
		if(++apiRequestsLoaded == 3) {

			// create and set the user's thumbnail to the front page
			var userThumbnail = new Image();
			userThumbnail.src = User.thumb.url;
			userThumbnail.addEventListener('load', function() {
				View.mainThumbnailOutput.appendChild(this);
				View.mainThumbnailOutput.removeChild(View.mainThumbnailOutput.children[0]);
			});

			// call the passed callback function
			callback.call(Facebook, User);
		}

	}
}