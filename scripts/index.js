/* User stories
-I can add bookmarks to the list containing a title (string, required), url (string, required),
description (string, optional), rating (number 1-5, optional)

- I can see a list of my bookmarks when I first load the app in a condensed view

- I can click on a bookmark to display the detailed view

- I can remove bookmarks from my bookmark list

- I can receive appropriate feedback when I cannot submit a bookmark (see api validations)

- I can filter by rating
*/

/* global Store, cuid */

$(function() {
  console.log('dom ready');

  Store.addBookmark({
    title: 'test',
    id: cuid(),
    url: 'https://www.google.com',
    rating: 3,
    description: 'description string',
    expanded: false
  });

  Store.addBookmark({
    title: 'bab',
    id: cuid(),
    url: 'https://www.google.com',
    rating: 1,
    description: 'description string',
    expanded: false
  });
});
