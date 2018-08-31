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
3. Make sure CSS isn't borked - mobile size
1. if editing a bookmark expanding new bookmark will purge -> we can solve this by keeping edited stuff in store (which is probably preferable anyway)
2. confirm on delete
3. Take a look at the edit handler and clean that up
4. ACCESSIBILITY!!!!!!!!!!!!!!!!!!!
*/
