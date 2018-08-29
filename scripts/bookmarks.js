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
  }

  // Handler for new bookmark button clicked
  // NOTE - this is not delegated because currently the button always exists, must be delegated if we decide button should be hidden
  // TODO - reset store addingbookmark status
  function handleNewBookmarkClicked() {
    $('#js-new-bookmark').on('click', function() {
      // Update the store's adding bookmark status
      Store.toggleAddingBookmarkStatus();
      // Render the DOM
      render();
    });
  }

  // Handler for add bookmark clicked
  function handleAddBookmarkClicked() {
    $('#js-form-container').on('click', '#js-add-bookmark', function(event) {
      event.preventDefault();
      const title = $('#js-form-title').val();
      const url = $('#js-form-url').val();
      const rating = $('#js-form-rating').val();
      const description = $('#js-form-description').val();

      const newBookmarkObject = {
        title: title,
        url: url,
        rating: rating,
        desc: description
      };

      API.createNewBookmark(
        newBookmarkObject,
        function(newBookmark) {
          console.log('successfully added to db');
          // Add bookmark to the store
          Store.addBookmark(newBookmark);
          // Toggle the form visibility
          Store.toggleAddingBookmarkStatus();
          // Render
          render();
        },
        function(error) {
          // TODO - error handling
          console.log('failed to add to db');
          console.error(error);
        }
      );
    });
  }

  // Handler for delete bookmark clicked
  function handleDeleteBookmarkClicked() {}

  // Handler for filtering based on drop down
  function handleFilterRatingsDropdown() {
    $('#js-filter-control').change(function() {
      console.log('filter changed');
      // Capture value of filter
      const filterValue = $('#js-filter-control').val();
      // Modify ratingFilter in store
      Store.setRatingFilter(filterValue);
      // Render page
      render();
    });
  }

  // Handler for condensing/expanding bookmark
  function handleToggleExpandedBookmarkView() {}

  /***** HTML generators *****/
  // Generate list item HTML
  // TODO - make this html not bad
  function generateSingleBookmarkListHTML(bookmark) {
    return `
      <li>
        Title: ${bookmark.title} - URL: ${bookmark.url} - Rating: ${
    bookmark.rating
  } Description: ${bookmark.desc}
      </li>
    `;
  }

  // Generate and return HTML for bookmarks list
  function generateBookmarksListHTML(arrayOfBookmarks, filterValue) {
    const filteredArrayOfBookmarks = arrayOfBookmarks.filter(bookmark => {
      return bookmark.rating >= filterValue;
    });
    return filteredArrayOfBookmarks.map(generateSingleBookmarkListHTML);
  }

  // Generate and return HTML for new bookmark form
  function generateNewBookmarkFormHTML() {
    return `
    <form>
    <!-- Title -->
    <input type='text' id='js-form-title' name='title' placeholder='Title'>

    <!-- URL -->
    <input type='text' id='js-form-url' name='url' placeholder='URL'>

    <!-- Rating -->
    <label for='rating'>Rating: </label>
    <select id='js-form-rating' name='rating'>
      <option value='5'>5</option>
      <option value='4'>4</option>
      <option value='3'>3</option>
      <option value='2'>2</option>
      <option value='1'>1</option>
    </select>

    <!-- Description -->
    <textarea id='js-form-description' name='description' placeholder='Description'></textarea>

    <!-- Add button -->
    <button id='js-add-bookmark'>ADD BOOKMARK</button>
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
    if (Store.addingBookmark) {
      // Add the form onto the page
      const newBookmarkFormHTML = generateNewBookmarkFormHTML();
      $('#js-form-container').html(newBookmarkFormHTML);
    } else {
      // Otherwise clear out the HTML in the form container
      $('#js-form-container').html('');
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
