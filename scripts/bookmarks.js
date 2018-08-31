/* global Store, API, Generator */

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
    handleCancelButton();
  }

  // Handler for new bookmark button clicked
  function handleNewBookmarkClicked() {
    $('#js-new-bookmark').on('click', () => {
      Store.setAddingBookmarkStatus(true);
      Store.setUpdatingBookmarkStatus(false);
      render();
    });
  }

  // Handler for add bookmark clicked
  function handleAddBookmarkClicked() {
    $('#js-form-container').on('submit', '#js-new-item-form', event => {
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
          Store.setAddingBookmarkStatus(false);
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
      // Prompt user for confirmation
      const confirmedDeletion = confirm(
        'Are you sure you want to delete this bookmark?'
      );
      // Use the ID to delete the item from the DB
      if (confirmedDeletion) {
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
      }
    });
  }

  // Handler for edit button
  function handleEditBookmarkClicked() {
    $('.js-bookmarks-container').on('click', '.js-btn-edit', event => {
      // Capture the data ID and find the relevant object in the store
      const bookmarkUniqueID = getDataID(event.currentTarget);
      const currentBookmarkObject = Store.findByID(bookmarkUniqueID);

      // Set updating status to true, adding status to false, and assign the editing object in store
      Store.setUpdatingBookmarkStatus(true);
      Store.setAddingBookmarkStatus(false);
      Store.setEditingObject(currentBookmarkObject);
      // Render page
      render();

      /* Create a listener on the form
      This needs to not be delegated to not conflict with the new bookmark form
      Otherwise we'll update multiple objects s i m u l t a n e o u s l y */
      $('#js-edit-form').on('submit', event => {
        event.preventDefault();

        // Capture all the field values and pass them to the object constructor
        const title = $('#js-form-title').val();
        const description = $('#js-form-description').val();
        const url = $('#js-form-url').val();
        const rating = $('#js-form-rating').val();

        const editedObject = constructBookmarkObject({
          title: title,
          rating: rating,
          description: description,
          url: url
        });

        // Update the bookmark in the API
        API.updateBookmark(
          bookmarkUniqueID,
          editedObject,
          () => {
            // Update bookmark in store, reset updating status and editing object
            Store.updateBookmark(bookmarkUniqueID, editedObject);
            Store.setUpdatingBookmarkStatus(false);
            Store.resetEditingObject();
            // Render
            render();
          },
          error => errorCallback(error)
        );
      });
    });
  }

  // Handler for cancel button
  function handleCancelButton() {
    $('#js-form-container').on('click', '#js-cancel-bookmark', () => {
      // If we cancel we set the updating/adding statuses to false
      Store.setAddingBookmarkStatus(false);
      Store.setUpdatingBookmarkStatus(false);
      // Render
      render();
    });
  }

  // Handler for filtering based on drop down
  function handleFilterRatingsDropdown() {
    $('#js-filter-control').change(() => {
      // Dynamically set the rating filter
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
      // Sets expanded status on the target by ID
      Store.toggleBookmarkExpanded(getDataID(event.currentTarget));
      render();
    });
  }

  /***** Error handling *****/
  // Function for handling errors
  function errorCallback(error) {
    // Sets error message to the response's message
    Store.setErrorMessage(`Error - ${getErrorMessage(error)}`);
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
    if (serializedJSON.title.length > 0) {
      newObject['title'] = serializedJSON.title;
    } else {
      newObject['title'] = '';
    }

    if (serializedJSON.url.length > 5) {
      newObject['url'] = serializedJSON.url;
    } else {
      newObject['url'] = '';
    }

    if (serializedJSON.description.length > 0) {
      newObject['desc'] = serializedJSON.description;
    }

    if (
      parseInt(serializedJSON.rating) > 0 &&
      parseInt(serializedJSON.rating) <= 5
    ) {
      newObject['rating'] = serializedJSON.rating;
    }

    return newObject;
  }

  /*** Data ID functions ***/
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

  // Function for clearing form values
  function clearFormValues() {
    $('#js-form-title').val('');
    $('#js-form-description').val('');
    $('#js-form-url').val('');
    $('#js-form-rating').val('');
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
      $('#js-form-container').html(Generator.generateNewBookmarkFormHTML());
    } else if (Store.checkIfEditingBookmark()) {
      $('#js-form-container').html(Generator.generateUpdateBookmarkForm());
    } else {
      // Otherwise clear out the HTML in the form container
      $('#js-form-container').html('');
    }

    // Sets form text if there is an editingObject and if not adding a bookmark (this means the form will be cleared if user does edit -> new bookmark)
    if (Store.editingObject && !Store.checkIfAddingBookmark()) {
      $('#js-form-title').val(Store.editingObject.title);
      $('#js-form-description').val(Store.editingObject.desc);
      $('#js-form-url').val(Store.editingObject.url);
      $('#js-form-rating').val(Store.editingObject.rating);
    } else if (!Store.checkIfAddingBookmark()) {
      clearFormValues();
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
      bookmarkListHTML = Generator.generateBookmarksListHTML(
        bookmarks,
        filterValue
      );
      // Render the bookmarks list
      $('.js-bookmarks-container').html(bookmarkListHTML);
    } else {
      // Render everything
      bookmarkListHTML = Generator.generateBookmarksListHTML(
        bookmarks,
        filterValue
      );
      $('.js-bookmarks-container').html(bookmarkListHTML);
    }
  }

  return {
    render,
    bindEventListeners
  };
})();
