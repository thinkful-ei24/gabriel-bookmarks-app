// eslint-disabled-next-line no-unused-vars
const Store = (function() {
  /***** Functions for modifying the store *****/
  // Function for adding a bookmark
  function addBookmark(bookmarkObject) {
    // Default object to merge into bookmarkObject, which will give it the KVP of expanded: false
    const defaultObjectProps = {
      expanded: false
    };
    this.bookmarks.push(Object.assign(bookmarkObject, defaultObjectProps));
  }

  // Function for updating a bookmark
  function updateBookmark(bookmarkID, bookmarkToMerge) {
    const object = this.bookmarks.find(bookmark => bookmark.id === bookmarkID);
    Object.assign(object, bookmarkToMerge);
  }

  // Function for toggling adding bookmark property
  function setAddingBookmarkStatus(bool) {
    this.addingBookmark = bool;
  }

  // Function for toggling updating bookmark property
  function setUpdatingBookmarkStatus(bool) {
    this.updatingBookmark = bool;
  }

  // Function for deleting a bookmark by ID
  function deleteBookmark(bookmarkID) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkID
    );
  }

  // Function for filtering out bookmarks with rating < rating
  function filterBookmarksByRating(rating) {
    updateRatingFilter(rating);
    this.bookmarks = filterStoreBookmarksArray();
  }

  // Function for updating rating filter value
  function updateRatingFilter(rating) {
    this.ratingFilter = rating;
  }

  // Function for creating filtered array of bookmarks based on rating
  function filterStoreBookmarksArray() {
    this.bookmarks.filter(bookmark => bookmark.rating >= this.ratingFilter);
  }

  // Function for toggling the expanded status of a bookmark by ID
  function toggleBookmarkExpanded(bookmarkID) {
    const bookmarkToToggle = this.bookmarks.find(
      bookmark => bookmark.id === bookmarkID
    );
    bookmarkToToggle.expanded = !bookmarkToToggle.expanded;
  }

  /***** Setter functions *****/
  // Store and display error messages
  function setErrorMessage(error) {
    this.errorMessage = error;
  }

  // set the ratingFilter
  function setRatingFilter(value) {
    this.ratingFilter = value;
  }

  /***** Functions for navigating the store *****/
  // Find and return a bookmark by ID value
  function findByID(bookmarkID) {
    return this.bookmarks.find(bookmark => bookmark.id === bookmarkID);
  }

  // Find and delete a bookmark by ID value
  function findAndDelete(bookmarkID) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkID
    );
  }

  // Function for checking the hidden status
  function checkIfShouldBeHidden(bookmark) {
    return !bookmark.expanded ? 'hidden' : '';
  }

  // Function for checking if we're adding a bookmark
  function checkIfAddingBookmark() {
    return this.addingBookmark;
  }

  // Function for checking if we're editing a bookmark
  function checkIfEditingBookmark() {
    return this.updatingBookmark;
  }

  return {
    bookmarks: [],
    ratingFilter: 0,
    addBookmark,
    checkIfAddingBookmark,
    setAddingBookmarkStatus,
    deleteBookmark,
    filterBookmarksByRating,
    toggleBookmarkExpanded,
    setErrorMessage,
    findByID,
    setRatingFilter,
    findAndDelete,
    checkIfShouldBeHidden,
    updateBookmark,
    setUpdatingBookmarkStatus,
    checkIfEditingBookmark
  };
})();
