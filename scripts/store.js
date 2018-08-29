/* Store: {
  bookmarks: [
  {
    title: 'name',
    id: num,
    url: 'url',
    rating: 5,
    description: 'string',
    expanded: false
  }
  ],
  error: '',
  addingBookmark: false,
  ratingFilter: 0
} */

// eslint-disabled-next-line no-unused-vars
const Store = (function() {
  /***** Functions for modifying the store *****/
  // Function for adding a bookmark
  function addBookmark(bookmarkObject) {
    this.bookmarks.push(bookmarkObject);
  }

  // Function for toggling adding bookmark property
  function toggleAddingBookmarkStatus() {
    this.addingBookmark = !this.addingBookmark;
  }

  // Function for deleting a bookmark by ID
  function deleteBookmark(bookmarkID) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkID
    );
  }

  // Function for filtering out bookmarks with rating < rating
  // TODO - make sure that this works as expected
  function filterBookmarksByRating(rating) {
    this.ratingFilter = rating;
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.rating >= this.ratingFilter
    );
  }

  // Function for toggling the expanded status of a bookmark by ID
  function toggleBookmarkExpanded(bookmarkID) {
    const bookmarkToToggle = this.bookmarks.find(
      bookmark => bookmark.id === bookmarkID
    );
    bookmarkToToggle.expanded = !bookmarkToToggle.expanded;
  }

  // Store and display error messages
  function setErrorMessage(error) {
    this.errorMessage = error;
  }

  /***** Functions for navigating the store *****/
  // Find and return a bookmark by ID value
  function findByID(bookmarkID) {
    return this.bookmarks.find(bookmark => bookmark.id === bookmarkID);
  }

  return {
    bookmarks: [],
    errorMessage: '',
    addingBookmark: false,
    ratingFilter: 0,
    addBookmark,
    toggleAddingBookmarkStatus,
    deleteBookmark,
    filterBookmarksByRating,
    toggleBookmarkExpanded,
    setErrorMessage,
    findByID
  };
})();
