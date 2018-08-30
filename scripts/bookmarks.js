/* global Store, API */

const Bookmarks = (function() {
  /***** Event listener handlers *****/
  // Handle binding all event listeners
  function bindEventListeners() {
    handleNewBookmarkClicked();
    handleAddBookmarkClicked();
    handleDeleteBookmarkClicked();
    handleFilterRatingsDropdown();
    handleToggleExpandedBookmarkView();
    handleEditBookmarkClicked();
  }

  // Handler for new bookmark button clicked
  function handleNewBookmarkClicked() {
    $('#js-new-bookmark').on('click', () => {
      Store.toggleAddingBookmarkStatus();
      render();
    });
  }

  // Handler for add bookmark clicked
  function handleAddBookmarkClicked() {
    $('#js-form-container').submit(event => {
      event.preventDefault();
      // Serialize the JSON and parse it into an object
      const serializedJSON = JSON.parse($(event.target).serializeJSON());
      const newBookmarkObject = constructBookmarkObject(serializedJSON);

      API.createNewBookmark(
        newBookmarkObject,
        newBookmark => {
          // Add bookmark to the store
          Store.addBookmark(newBookmark);
          // Toggle the form visibility
          Store.toggleAddingBookmarkStatus();
          // Render
          render();
        },
        error => errorCallback(error)
      );
    });
  }

  // Handler for delete bookmark clicked
  function handleDeleteBookmarkClicked() {
    $('.js-bookmarks-container').on('click', '.js-btn-delete', event => {
      // Captured the bookmark's ID
      const bookmarkUniqueID = getDataID(event.currentTarget);
      // Use the ID to delete the item from the DB
      API.deleteBookmark(
        bookmarkUniqueID,
        () => {
          // Also delete from store
          Store.findAndDelete(bookmarkUniqueID);
          // Render the updated page
          render();
        },
        error => errorCallback(error)
      );
    });
  }

  // Handler for edit button
  function handleEditBookmarkClicked() {
    $('.js-bookmarks-container').on('click', '.js-btn-edit', event => {
      const bookmarkUniqueID = getDataID(event.currentTarget);
      const currentBookmarkObject = Store.findByID(bookmarkUniqueID);

      let title = prompt('Enter new title', currentBookmarkObject.title);
      let rating = prompt('Enter new rating', currentBookmarkObject.rating);
      let description = prompt(
        'Enter a new description',
        currentBookmarkObject.desc
      );
      let url = prompt('Enter a new URL', currentBookmarkObject.url);

      if (description.length < 1) {
        description = currentBookmarkObject.description;
      }

      const editedObject = constructBookmarkObject({
        title: title,
        rating: rating,
        description: description,
        url: url
      });

      API.updateBookmark(
        bookmarkUniqueID,
        editedObject,
        response => {
          console.log(response);
          Store.updateBookmark(bookmarkUniqueID, editedObject);
          render();
        },
        error => errorCallback(error)
      );
    });
  }

  // Handler for filtering based on drop down
  function handleFilterRatingsDropdown() {
    $('#js-filter-control').change(() => {
      Store.setRatingFilter(getRatingsFilterDropdownValue());
      render();
    });
  }

  // Function for getting the desired rating filter value
  function getRatingsFilterDropdownValue() {
    return $('#js-filter-control').val();
  }

  // Handler for condensing/expanding bookmark
  function handleToggleExpandedBookmarkView() {
    $('.js-bookmarks-container').on('click', '.js-bookmark-header', event => {
      Store.toggleBookmarkExpanded(getDataID(event.currentTarget));
      render();
    });
  }

  /***** Error handling *****/
  // Function for handling errors
  function errorCallback(error) {
    // Sets error message to the response's message
    Store.setErrorMessage(`Error - ${getErrorMessage(error)}`);
    // Render the page
    render();
  }

  // Function for getting error message
  function getErrorMessage(error) {
    return error.responseJSON.message;
  }

  /***** Utility functions *****/
  // Function for constructing a new bookmark object
  function constructBookmarkObject(serializedJSON) {
    const newObject = {};

    // Make sure that object properties are valid before adding them to update object
    if (serializedJSON.title.length > 1)
      newObject['title'] = serializedJSON.title;
    if (serializedJSON.url.length > 5) newObject['url'] = serializedJSON.url;
    if (serializedJSON.description.length > 1)
      newObject['desc'] = serializedJSON.description;
    if (
      parseInt(serializedJSON.rating) > 0 &&
      parseInt(serializedJSON.rating) <= 5
    )
      newObject['rating'] = serializedJSON.rating;

    return newObject;
  }

  // Extend jQuery to serialize forms into JSON
  $.fn.extend({
    serializeJSON: function() {
      const formData = new FormData(this[0]);
      const object = {};
      formData.forEach((value, name) => {
        return (object[name] = value);
      });
      return JSON.stringify(object);
    }
  });

  /* Data ID functions */
  // Gets the data-id of a given bookmark
  function getDataID(bookmark) {
    return getDataIDAttributeValue(bookmark);
  }

  // Function for getting the data-id attribute of the nearest js-bookmark-item
  function getDataIDAttributeValue(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-item')
      .attr('data-id');
  }

  /***** HTML generators *****/
  // Generate list item HTML
  function generateSingleBookmarkListHTML(bookmark) {
    // Check the expanded status in the store and set class appropriately
    let hiddenStatus = Store.checkIfShouldBeHidden(bookmark);

    return runGeneratorFunctions(bookmark, hiddenStatus);
  }

  // Function that runs all generator functions and returns an item's HTML
  function runGeneratorFunctions(bookmark, hiddenStatus) {
    return `
    <li class='bookmark-item js-bookmark-item' ${generateBookmarkIDHTML(
    bookmark
  )}>
    ${generateBookmarkHeader(bookmark)}
    <div class='bookmark-body ${hiddenStatus}'>
      <p>${generateBookmarkDescriptionHTML(bookmark)}</p>
      ${generateBookmarkURLHTML(bookmark)}${generateBookmarkEditButtonHTML()}
      ${generateDeleteButtonHTML(bookmark)}
    </div>
  </li>
    `;
  }

  // Function for generating HTML for IDs
  function generateBookmarkIDHTML(bookmark) {
    return `data-id=${bookmark.id}`;
  }

  // Function for generating HTML for titles
  function generateBookmarkHeader(bookmark) {
    return `<div class='bookmark-header js-bookmark-header'><button class='header-button'>${
      bookmark.title
    } ${generateBookmarkRatingHTML(bookmark)}</button></div>`;
  }

  // Function for generating HTML for URLs
  function generateBookmarkURLHTML(bookmark) {
    return `<a href='${bookmark.url}'>${generateBookmarkVisitButtonHTML()}</a>`;
  }

  // Function for generating visit button HTML
  function generateBookmarkVisitButtonHTML() {
    return '<button class="js-btn-visit">VISIT</button>';
  }

  // Function for generating edit button HTML
  function generateBookmarkEditButtonHTML() {
    return '<button class="edit-btn js-btn-edit">EDIT</button>';
  }

  // Function for generating delete button HTML
  function generateDeleteButtonHTML() {
    return '<button class="bookmark-button js-btn-delete">DELETE</button>';
  }

  // Function for generating HTML for descriptions
  function generateBookmarkDescriptionHTML(bookmark) {
    return checkIfBookmarkHasDescription(bookmark)
      ? `Description: ${bookmark.desc}`
      : '';
  }

  // Function for checking if a bookmark has a description
  function checkIfBookmarkHasDescription(bookmark) {
    if (bookmark.desc) return true;
    return false;
  }

  // Function for generating HTML for ratings
  function generateBookmarkRatingHTML(bookmark) {
    return checkIfBookmarkHasRating(bookmark)
      ? `| ${generateStarsHTML(bookmark.rating)}`
      : '';
  }

  // Function for checking if bookmark has a rating
  function checkIfBookmarkHasRating(bookmark) {
    if (bookmark.rating) return true;
    return false;
  }

  // Function for generating FA star HTML rating times
  function generateStarsHTML(rating) {
    const arrayOfStarsHTML = [];

    for (let i = 0; i < rating; i++) {
      generateStarHTML(arrayOfStarsHTML);
    }
    return arrayOfStarsHTML.join('');
  }

  // Function for generating a single FA star and pushing to a given array
  function generateStarHTML(array) {
    array.push('<i class="fas fa-star"></i>');
  }

  // Generate and return HTML for bookmarks list
  function generateBookmarksListHTML(arrayOfBookmarks, filterValue) {
    return mapFilteredArrayOfBookmarksToHTML(
      filterArrayOfBookmarks(arrayOfBookmarks, filterValue)
    );
  }

  // Filter an array of bookmarks based on rating
  function filterArrayOfBookmarks(arrayOfBookmarks, filterValue) {
    return arrayOfBookmarks.filter(bookmark => bookmark.rating >= filterValue);
  }

  // Map an array of store objects to HTML
  function mapFilteredArrayOfBookmarksToHTML(arrayOfBookmarks) {
    return arrayOfBookmarks.map(generateSingleBookmarkListHTML);
  }

  // Generate and return HTML for new bookmark form
  function generateNewBookmarkFormHTML() {
    return `
    <form>
      <div class='col-6'>
        <!-- Title -->
        <label for='js-form-title'>Title</label>
        <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Amazing programming article' ></li>

        <!-- Description -->
        <label for='js-form-description'>Description</label>
        <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="I can't believe its not PHP!"></textarea>
      </div>
      <div class='col-6'>
      <!-- URL -->
        <label for='js-form-url'>URL</label>
        <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='https://...' ></li>

        <!-- Rating -->
        <label for='js-form-rating'>Rating: </label>
        <select id='js-form-rating' name='rating'>
          <option value='5'>5</option>
          <option value='4'>4</option>
          <option value='3'>3</option>
          <option value='2'>2</option>
          <option value='1'>1</option>
        </select>
      </div>
      <!-- Add button -->
      <div class='add-btn-container col-12'>
        <button type='submit' id='js-add-bookmark' class='add-button'>ADD BOOKMARK</button>
      </div>
    </form>
    `;
  }

  // Render page
  function render() {
    // Store bookmarks as a variable
    const bookmarks = Store.bookmarks;
    // Get the current filter value
    const filterValue = Store.ratingFilter;
    // Get the generated HTML for the bookmarks list
    let bookmarkListHTML;

    // If addingBookmark is true we need to render the form
    if (Store.checkIfAddingBookmark()) {
      // Add the form onto the page
      $('#js-form-container').html(generateNewBookmarkFormHTML());
    } else {
      // Otherwise clear out the HTML in the form container
      $('#js-form-container').html('');
    }

    // Displays errors if found
    if (Store.errorMessage) {
      $('#js-error-message').html(Store.errorMessage);
      Store.setErrorMessage('');
    } else {
      $('#js-error-message').html('');
    }

    // If a ratingFilter is active only render the relevant parts of store
    if (filterValue > 0) {
      // Restrict rendering
      bookmarkListHTML = generateBookmarksListHTML(bookmarks, filterValue);
      // Render the bookmarks list
      $('.js-bookmarks-container').html(bookmarkListHTML);
    } else {
      // Render everything
      bookmarkListHTML = generateBookmarksListHTML(bookmarks, filterValue);
      $('.js-bookmarks-container').html(bookmarkListHTML);
    }
  }

  return {
    render,
    bindEventListeners
  };
})();
