/* global Store, Bookmarks, API */
$(function() {
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

/* TODOS
1. Add editing prop to store so we can use render() to render the update form
2. Allow malformed requests from updates
3. Make sure CSS isn't borked
*/
