/* User stories
-I can add bookmarks to the list containing a title (string, required), url (string, required),
description (string, optional), rating (number 1-5, optional)

- I can see a list of my bookmarks when I first load the app in a condensed view

- I can click on a bookmark to display the detailed view

- I can remove bookmarks from my bookmark list

- I can receive appropriate feedback when I cannot submit a bookmark (see api validations)

- I can filter by rating
*/

/* global Store, Bookmarks, API */

$(function() {
  console.log('dom ready');
  // Bind the event listeners
  Bookmarks.bindEventListeners();
  // Make the initial API call to the server to get all the bookmarks that are present
  API.getBookmarks(bookmarks => {
    // Loop through bookmarks and add them to the store
    bookmarks.forEach(bookmark => Store.addBookmark(bookmark));
    // Render the page
    Bookmarks.render();
  });
});

/* Important todos/follow-ups:
-Make sure that we should be exposing stuff like addingBookmark in Store.js that we are modifying with functions
-Need error handling
-Strech font awesome stars
*/
