const API = (function() {
  // Base url for API
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/gabriel';

  // Function for sending GET request to the DB
  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  // Function for creating a new bookmark to POST to DB
  function createNewBookmark(bookmarkObject, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookmarkObject),
      success: callback,
      error: errorCallback
    });
  }

  // Function for sending a DELETE request to the DB
  function deleteBookmark(id, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      success: callback,
      error: errorCallback
    });
  }

  // Function for updating a new bookmark
  function updateBookmark(id, updateObject, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateObject),
      success: callback,
      error: errorCallback
    });
  }

  return {
    createNewBookmark,
    deleteBookmark,
    getBookmarks,
    updateBookmark
  };
})();
