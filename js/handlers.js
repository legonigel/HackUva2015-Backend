/**
 * Handler functions for app and FB api
 */

/**
 * Handles the response object sent when api authenticates a user,
 * either through user login, or an already existing session
 */
function handleUserAuthentication(response) {

	// assign authentication response to global pointer
	facebookUserAuthenticationResponse = response;

	fetchUserInformation(function(userData) {

		// show our friends list area
		View.mainFriendsListArea.style.display = 'table';

		// append each of the friends using this app to the friends list area
		userData.friends.data.forEach(function(friend) {
			View.mainFriendsListArea.innerHTML += '<tr><td>' + friend.name + '</td></tr>';
		});

	});

}