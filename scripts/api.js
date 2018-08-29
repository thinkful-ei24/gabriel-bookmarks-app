const API = (function() {
  // Base url for API
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/gabriel';

  // I can add a new bookmark
  function createNewBookmark(bookmarkObject, callback, errorCallback) {
    const newBookmark = JSON.stringify(bookmarkObject);

    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      success: callback,
      error: errorCallback
    });
  }

  // I can delete a bookmark
  function deleteBookmark() {}

  // I can get all bookmarks
  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  return {
    createNewBookmark,
    deleteBookmark,
    getBookmarks
  };
})();
