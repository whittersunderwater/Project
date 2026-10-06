# AI Request Log

This log records substantive requests made in the current session. Conversational acknowledgements such as "thank you" are intentionally excluded.

## 2026-09-27
- "Create a file titled AI_LOG.md and document every request we make, ignoring conversational responses such as 'thank you' etc."
- "Please keep both updated throughout this session"
- "We are working on a project to build an interactive web-based application, that is also available offline for users to use on tablets in the field. It’s purpose is to provide users with information on what species of bush medicine, bush food, and wildflower plant species can be found in each of the 6 Noongar Indigenous Land Use Agreement (ILUA) Areas, for each of the 6 Noongar seasons. The application needs functionality to allow users to check off each species they find. We’ve created a basic storyboard of the required levels/views and filtering of the application. First view: The app opens to a wheel design of the 6 Noongar seasons, similar to file named six_season.png. Information fields to be included is in the file named season_data_master.csv, and a diagram showing placement of fields is in the file named storyboard_part1.jpg. The user reaches the next view of the app by clicking on or tapping on one of the season sections of the wheel. Second view: The app generates a map of the 6 Noongar ILUA areas, mapping information is in file named CITS1501_ILUA.qgz and is also shown in file named ilua_boundary_map.jpg. Each ILUA area is to display the Noongar ILUA name. The map is to be placed centrally as shown in the file named storyboard_part2.jpg. Information for each of the 6 ILUA areas will be placed surrounding the map, information is found in the file named ilua_data_master.csv. The user reaches the next view of the app by clicking on or tapping on one of the ILUA areas of the map. Third view: The app generates a view of the three plant categories: bush medicine, bush food, and wildflowers as shown in storyboard_part3.jpg. Users reach the next view by clicking on or tapping on one of the categories. Fourth view: The app generates a view listing each species filtered by the Noongar season, Noongar ILUA area, and the category the user has previously selected. The list is to show a picture of the species, species information, and a checkmark box. Example layout shown in storyboard_part3.jpg. Species information, which Noongar seasons and ILUA areas they are found in, and a hyperlink to each species' photo are found in the files named bush_food_data_master.csv, bush_med_data_master.csv, and wildflower_data_master.csv. The app requires logical navigation to allow users to return to previous views to allow selection changes. We need assistance creating suitable html, CSS, and JavaScript coding to make a demonstratable application."
- "Keep both the AI_LOG.md file and AI_CHAT.md files continuously updated automatically as we continue this session."
- "Please amend the design of the seasons wheel to more closely align with the layout in storyboard_part1.jpg"
- "please continue refining"
- "Revert back to the previous version"
- "Each section of the wheel needs to include the below information found in the file titled season_data_master.csv. And the layout needs to be the same as the file named six_seasons.png."
- "Keep refining the wheel to match the .png file. The information in the file season_data_master.csv should be displayed as following:"
- "The fields in the file titled season_data_master.csv are to be displayed as follows: First, most outer ring of wheel: season_name; Second ring of wheel: season_months; Third ring of wheel: season_weather; Fourth ring of wheel: season_info"
- "Beneath the season_info1 field for each season, add the field season_info2"
- "Rotate the text in the BUNURU wedge 90 degrees to the left"
- "Rotate the text in the DJERAN wedge 90 degrees to the right"
- "Rotate the text in the MAKURU wedge 90 degrees to the right"
- "Rotate the text in the DJILBA wedge 90 degrees to the left"
- "Rotate the text in the KAMBARANG wedge 90 degrees to the left"
- "Make each wedge selectable to move to the second view of the app"
- "Please amend the coding so that this additional summary card is not created."
- "Please add comments to the HTML, CSS, and JavaScript files to explain the key sections and logic."
- "The chat regarding adding comments to the files is still missing from the chat history"
- "The updated chat is out of order. Please amend so that all user and assistant responses are in chronological order"
- "This is still incorrect. Remove everything in the AI_CHAT.md file from line 193 onwards and replace with the complete chat history from 3:09 PM onwards."

## 2026-09-28
- "which part of the coding controls the size of the ILUA map image"
- "automatically update both the AI_LOG and AI_CHAT files for the remainder of this session"
- "slightly increase the size of the map image"
- "Increase it again"
- "how do I align the label text so it is both vertically and horizontally centred"
- "which section of coding controls the layout and formatting of the ILUA information boxes beneath the map?"
- "How would I create more space after the field season_info2"
- "no need to update chat when I exit servers"
- "reopen the app"
- "what coding deals with the text size of the title, h1, and h2 headers?"
- "make the title 2 points larger"
- "Make h2 two points smaller"
- "I want to add a background colour for the title"
- "for easier navigation, add a \"Home\" button above the \"Back\" button to allow users to return directly to the seasons view"
- "Move the ILUA info grid from below the map to above the map. Also change the layout so they are in two rows of three"
- "Add a shadow to the ILUA map labels"
- "make the shadow even more prominent around the ILUA map labels"
- "Increase the shadowing again"
- "amend the category grid to remove category emojis and instead display a photo"
- "This is the hyperlink for the photo for the category bush food. Update the coding so the photo is displayed"
- "C:\\Users\\chell\\Desktop\\Species Photos\\Santalum acuminatum.jpg"
- "make the category grids large enough to display full photo instead of clipping the photo. Change the layout of the grid to two rows, with Bush Food and Bush Medicine in the first row and Wildflower in the second row"
- "Amend Wildflower so that it is the same size as Bush Food and Bush Medicine instead of spanning the entire second row"
- "Make Wildflower centred in the second row"
- "This is the hyperlink for the photo for Bush Medicine"
- "C:\\Users\\chell\\Desktop\\Species Photos\\Solanum lasiophyllum.jpg"
- "This is the hyperlink for the photo for the wildflower category"
- "C:\\Users\\chell\\Desktop\\Species Photos\\Caladenia macrostylis.jpg"
- "Add a navigation button at the bottom of the species view that allows users to jump back to the top of the listings"
- "Sort the species so they are listed alphabetically by the species_name field"
- "Below the line stating the common_name field, add the below in the same font style: Noongar name: noongar_name"
- "Remove the \"View species photo\" hyperlinks located beneath the species_info field"
- "Reduce the spacing between common_name and Noongar name: noongar_name"
- "Populate the photo placeholders in the species list for Bush Food with the photos found at the hyperlink location in the photo_hlink column in the file named bush_food_data_master.csv"
- "Populate the photo placeholders in the species list for Bush Medicine with the photos found at the hyperlink location in the photo_hlink column in the file named bush_med_data_master.csv"
- "Populate the photo placeholders in the species list for Wildflower with the photos found at the hyperlink location in the photo_hlink column in the file named wildflower_data_master.csv"
- "make the photos clickable in order to show an enlarged version of the photograph"
- "The photos for wildflower have not populated"
- "Remove \"Noongar name: noongar_name\" from wildflower list"
- "On the categories view, on the Bush Food category card, under \"Bush Food\" write \"Santalum acuminatum - Quandong\" in the same font style and size"
- "Make the added text two points smaller than \"Bush Food\""
- "Enlarge the gap between the photo and \"Bush Food\""
- "Do the same for Bush Medicine card, adding the text \"Solanum lasiophyllum - Flannel Bush\" below \"Bush Medicine\""
- "Finally, repeat for the Wildflower card, adding the text \"Caladenia macrostylis - Leaping Spider Orchid\" below \"Wildflower\""
- "Amend the category \"Wildflower\" to \"Wildflowers\""
- "Make the text of the summary pills on each view all uppercase"
- "create a README.md file that explains to users how to use the app"

## 2026-09-28
- "populate the main background body of the app with the picture file named background_image.JPG. This should populate for each view opened by the user"
- "increase the text in the centre of the season wheel"
- "yes increase the overall wheel size"
- "can you increase the size of the centre of the season wheel so there is less empty space between the season wheel centre and the season wheel wedges?"

## 2026-10-01
- "add filtering functionality to the species lists that enables users to filter by \"Found\""
- "move the \"Show species\" filter so that it is right-aligned on the species list page"
- "how would I create an automated test script using pytest to test this app? It needs to cover: At least 8 automated tests, edge cases, error handling, and reliable application behaviour"
- "does this code provide clear pass / fail results of each test?"
- "There was one failure. What does this mean? Here is the output from running app_tests.py"
- "Please make the necessary changes in app_tests.py"
- "what does this mean? Import \"pytest\" could not be resolved"

## 2026-10-02
- "does the coding in this project contain an algorithm?"
- "what can you tell me about the below in regards to this project? edge cases, error handling, and reliable application behaviour."
- "Can you amend the app_tests.py file to include your suggested tests or improvements?"
- "Now considering the changes made and new tests created, what can you say about this project in regards to edge cases, error handling, and reliable application behaviour?"
- "Please add a test that verifies every species is assigned to the correct combinations"
- "Clearly explain how this app handles edge cases, error handling, and reliable application behaviour"
- "Create a button on the bottom-left of the 'Home' page, beneath the season wheel, that allows users to generate a full species list of every species found to date without any season, ILUA or category filtering."

## 2026-10-06
- add a button labelled "Season comparisons" to the bottom right of the home page that takes users to a page that contains a dashboard style layout of comparisons of seasons, ilua, categories, and species counts.
- Please create a file with an editable architecture diagram showing:
• the main components of the application;
• how the components interact; and
• how data moves through the system.
• The diagram should accurately represent the application you actually built.
- how do I fix labels overlapping on the diagram
- changed it to LR, labels to/from app.js to application DOM are overlapping
