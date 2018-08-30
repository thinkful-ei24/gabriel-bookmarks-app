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

  // Serialize forms into JSON
  $.fn.extend({
    serializeJSON: function() {
      const formData = new FormData(this[0]);
      const object = {};
      formData.forEach((value, name) => {
        console.log(`name: ${name} value: ${value}`);
        return (object[name] = value);
      });
      return JSON.stringify(object);
    }
  });

  // Handler for add bookmark clicked
  function handleAddBookmarkClicked() {
    $('#js-form-container').submit(event => {
      event.preventDefault();
      // Serialize the JSON and parse it into an object
      console.log($(event.target).serializeJSON());
      const serializedJSON = JSON.parse($(event.target).serializeJSON());

      const newBookmarkObject = {
        title: serializedJSON.title,
        url: serializedJSON.url,
        rating: serializedJSON.rating,
        desc: serializedJSON.description
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
  function handleDeleteBookmarkClicked() {
    $('.js-bookmarks-container').on('click', '.js-btn-delete', function(event) {
      // Captured the bookmark's ID
      const bookmarkUniqueID = getDataID(event.currentTarget);
      // Use the ID to delete the item from the DB
      API.deleteBookmark(
        bookmarkUniqueID,
        function() {
          // Also delete from store
          Store.findAndDelete(bookmarkUniqueID);
          // Render the updated page
          render();
        },
        function(error) {
          // TODO - error handling
          console.log('Error deleting item');
          console.error(error);
        }
      );
    });
  }

  // Gets the data-id of a given bookmark
  function getDataID(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-item')
      .attr('data-id');
  }

  // Handler for filtering based on drop down
  function handleFilterRatingsDropdown() {
    $('#js-filter-control').change(function() {
      // Capture value of filter
      const filterValue = $('#js-filter-control').val();
      // Modify ratingFilter in store
      Store.setRatingFilter(filterValue);
      // Render page
      render();
    });
  }

  // Handler for condensing/expanding bookmark
  function handleToggleExpandedBookmarkView() {
    $('.js-bookmarks-container').on('click', '.js-bookmark-item', function(
      event
    ) {
      console.log('li clicked');
    });
  }

  /***** HTML generators *****/
  // Generate list item HTML
  // TODO - make this html not bad
  function generateSingleBookmarkListHTML(bookmark) {
    return `
      <li class='bookmark-item js-bookmark-item' data-id=${bookmark.id}>
        Title: ${bookmark.title} - URL: ${bookmark.url} - Rating: ${
    bookmark.rating
  } Description: ${bookmark.desc}
  <button class='js-btn-delete'>DELETE</button>
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
      <div class='col-6'>
        <!-- Title -->
        <label for='js-form-title'>Title</label>
        <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Amazing programming article' required></li>

        <!-- Description -->
        <label for='js-form-description'>Description</label>
        <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="I can't believe its not PHP!"></textarea>
      </div>
      <div class='col-6'>
      <!-- URL -->
        <label for='js-form-url'>URL</label>
        <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='https://...' required></li>

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
