/* global Store */
const Generator = (function() {
  /***** HTML generators *****/
  // Generate and return HTML for bookmarks list
  function generateBookmarksListHTML(arrayOfBookmarks, filterValue) {
    return mapFilteredArrayOfBookmarksToHTML(
      filterArrayOfBookmarks(arrayOfBookmarks, filterValue)
    );
  }

  // Generate list item HTML
  function generateSingleBookmarkListHTML(bookmark) {
    // Check the expanded status in the store and set class appropriately
    let hiddenStatus = Store.checkIfShouldBeHidden(bookmark);

    return runGeneratorFunctions(bookmark, hiddenStatus);
  }

  // Function that runs all generator functions and returns an item's HTML
  function runGeneratorFunctions(bookmark, hiddenStatus) {
    return `
    ${generateLiItemWithDataID(bookmark)}
    ${generateBookmarkHeader(bookmark)}
    ${genereateDivWithClassHTML(hiddenStatus)}
      ${generateBookmarkDescriptionHTML(bookmark)}
      ${generateBookmarkURLHTML(bookmark)}${generateBookmarkEditButtonHTML()}
      ${generateDeleteButtonHTML(bookmark)}
    ${generateAsideLiClosingTags()}
    `;
  }

  // Function for generating HTML for IDs
  function generateLiItemWithDataID(bookmark) {
    return `<li class='bookmark-item js-bookmark-item' data-id=${bookmark.id}>`;
  }

  // Function for closing divs and li
  function generateAsideLiClosingTags() {
    return `</aside>
    </li>`;
  }

  // Function for generating div with hidden status
  function genereateDivWithClassHTML(hiddenStatus) {
    return `<aside class='bookmark-body ${hiddenStatus}' role="complementary">`;
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
      ? `<p>Description: ${bookmark.desc}</p>`
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
      generateStarHTML(arrayOfStarsHTML, rating);
    }
    return arrayOfStarsHTML.join('');
  }

  // Function for generating a single FA star and pushing to a given array
  function generateStarHTML(array, rating) {
    array.push(
      `<i class="fa fa-star" aria-label="rating: ${rating} stars"></i>`
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
  function generateUpdateBookmarkForm() {
    return `
      <form id='js-edit-form'>
      <fieldset>
      <legend>Update Bookmark</legend>
        <div class='col-6'>
          <!-- Title -->
          <label for='js-form-title'>Title</label>
          <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Amazing programming article'></li>

          <!-- Description -->
          <label for='js-form-description'>Description</label>
          <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="I can't believe its not PHP!"></textarea>
        </div>
        <div class='col-6'>
        <!-- URL -->
          <label for='js-form-url'>URL</label>
          <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='https://...'></li>

          <!-- Rating -->
          <label for='js-form-rating' id='rating-label'>Rating: </label>
          <select id='js-form-rating' name='rating' aria-labelledby='rating-label'>
            <option value='5'>5</option>
            <option value='4'>4</option>
            <option value='3'>3</option>
            <option value='2'>2</option>
            <option value='1'>1</option>
          </select>
        </div>
        <!-- Add/Cancel button -->
        <div class='add-btn-container col-12'>
          <button type='submit' id='js-update-bookmark' class='add-button'>UPDATE BOOKMARK</button>
          <button type='button' id='js-cancel-bookmark'>CANCEL</button>
        </div>
        </fieldset>
      </form>
      `;
  }

  // Generate and return HTML for new bookmark form
  function generateNewBookmarkFormHTML() {
    return `
    <form id='js-new-item-form'>
    <fieldset>
    <legend>New Bookmark</legend>
      <div class='col-6'>
        <!-- Title -->
        <label for='js-form-title'>Title</label>
        <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Amazing programming article'></li>

        <!-- Description -->
        <label for='js-form-description'>Description</label>
        <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="I can't believe its not PHP!"></textarea>
      </div>
      <div class='col-6'>
      <!-- URL -->
        <label for='js-form-url'>URL</label>
        <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='https://...'></li>

        <!-- Rating -->
        <label for='js-form-rating' id='rating-label'>Rating: </label>
        <select id='js-form-rating' name='rating' aria-labelledby='rating-label'>
          <option value='5' selected>5</option>
          <option value='4'>4</option>
          <option value='3'>3</option>
          <option value='2'>2</option>
          <option value='1'>1</option>
        </select>
      </div>
      <!-- Add button -->
      <div class='add-btn-container col-12'>
        <button type='submit' id='js-add-bookmark' class='add-button'>ADD BOOKMARK</button>
        <button type='button' id='js-cancel-bookmark'>CANCEL</button>
      </div>
      </fieldset>
    </form>
    `;
  }

  return {
    generateUpdateBookmarkForm,
    generateNewBookmarkFormHTML,
    generateBookmarksListHTML
  };
})();
