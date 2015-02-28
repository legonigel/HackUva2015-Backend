/**
 * App view controllers
 */

/**
 * initialize references to html objects
 */
 function initializeAppViews() {

 	if(!View.mainThumbnailOutput) {
		View.mainThumbnailOutput = document.getElementById(View.id.mainThumbnailOutput);
	}

	if(!View.mainFriendsListArea) {
		View.mainFriendsListArea = document.getElementById(View.id.mainFriendsListArea);
	}

 }