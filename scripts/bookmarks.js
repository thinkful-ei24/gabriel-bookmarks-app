/* global Store */

const Bookmarks = (function() {
  /***** Event listener handlers *****/
  // Handle binding all event listeners
  function bindEventListeners() {
    handleNewBookmarkClicked();
    handleAddBookmarkClicked();
    handleDeleteBookmarkClicked();
    handleFilterRatingsDropdown();
    handleToggleExpandedBookmarkView();
  }

  // Handler for new bookmark button clicked
  function handleNewBookmarkClicked() {}

  // Handler for add bookmark clicked
  function handleAddBookmarkClicked() {}

  // Handler for delete bookmark clicked
  function handleDeleteBookmarkClicked() {}

  // Handler for filtering based on drop down
  function handleFilterRatingsDropdown() {}

  // Handler for condensing/expanding bookmark
  function handleToggleExpandedBookmarkView() {}

  // Generate list item HTML
  // TODO - make this html not bad
  function generateSingleBookmarkListHTML(bookmark) {
    return `
      <li>
        Title: ${bookmark.title} - URL: ${bookmark.url} - Rating: ${
    bookmark.rating
  } Description: ${bookmark.description}
      </li>
    `;
  }

  // Generate and return HTML for bookmarks list
  function generateBookmarksListHTML(arrayOfBookmarks) {
    return arrayOfBookmarks.map(generateBookmarksListHTML);
  }

  // Render page
  function render() {
    // Store bookmarks as a variable
    const bookmarks = Store.bookmarks;
    // Get the generated HTML for the bookmarks list
    const bookmarkListHTML = generateBookmarksListHTML(bookmarks);
  }

  return {
    render,
    bindEventListeners
  };
})();
