# Bookmarks app

**Bookmarks** is a simple bookmark management app built as part of [Thinkful's Engineering Immersion](https://www.thinkful.com/bootcamp/web-development/full-time/) program. It uses jQuery AJAX functionality to communicate with a database and maintain a persistent list of user submitted bookmarks. Note that bookmarks are currently deleted every 24 hours by the database.

## User stories

-I can add bookmarks to my bookmark list. Bookmarks contain:
--title
--url link
--description
---rating (1-5)

-I can see a list of my bookmarks when I first open the app
--All bookmarks in the list default to a "condensed" view showing only title and rating

-I can click on a bookmark to display the "detailed" view
--Detailed view expands to additionally display description and a "Visit Site" link

-I can remove bookmarks from my bookmark list

-I receive appropriate feedback when I cannot submit a bookmark
--Check all validations in the API documentation (e.g. title and url field required)

-I can select from a dropdown a "minimum rating" to filter the list by all bookmarks rated above the chosen selection

-(Extension) I can edit the rating and description of a bookmark in my list
