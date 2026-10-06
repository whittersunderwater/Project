## Noongar Seasons and Country Explorer

This app helps you explore plant species by Noongar season, ILUA area, and category. Species lists include plant photos and information, and you can mark species you find.

## System requirements

- A modern browser with JavaScript enabled. The app has not been tested against a formal browser support matrix.
- A local web server to load the CSV files; opening `index.html` directly is not supported. Python is one option for starting the server.
- The project files kept together, including the CSV files and image folders.

The automated tests have been run on Windows using Playwright's Chromium browser. Other operating systems (macOS, Linux, iOS, Android) and browsers, including Safari and Microsoft Edge, have not yet been confirmed by the project tests. The app is built with standard web technologies, but compatibility on other platforms should be tested before relying on it.

## Start the app

1. Download all files from GitHub (https://github.com/whittersunderwater/Project.git) and save them to your device.
2. Open a terminal and navigate to the "Project" folder.
3. Start a local server. On Windows, use:

   ```powershell
   py -m http.server 8000
   ```

   On macOS or Linux, use:

   ```sh
   python3 -m http.server 8000
   ```

   If Python is not installed, install it or use another local web server.
4. In your browser, navigate to <http://localhost:8000>.
5. Leave the terminal window open while using the app. Press Ctrl+C in that window when you are finished.

If port 8000 is already in use, start the server on another port, such as 8001, and open the matching address, for example <http://localhost:8001>.

## Explore plants

1. Select one of the six season sections in the wheel.
2. Select an ILUA area using its label on the map. The area information boxes appear above the map.
3. Select Bush Food, Bush Medicine, or Wildflowers.
4. Browse the species that match your selected season, area, and category. The list is alphabetized by species name.
5. Select a species photo to view it enlarged. Close the image with the Close button, by pressing Escape, or by selecting the dimmed area outside it.
6. Use the Found checkbox to mark a species you have found. The checkbox states are saved in your browser on that device, and remain after reloading the app.

Use **Back** to return one step and change the previous selection. Use **Home** to return to the season wheel and clear the current season, area, and category selections. Your saved Found checkboxes are not cleared by Home.

On the season wheel home page, select **View all species found to date** to see every species you have marked Found across all seasons, ILUA areas, and categories. You can uncheck species from this list as well.

Select **Season comparisons** on the home page to view species counts by season, ILUA area, and category, including a season-by-ILUA comparison table.

Use **Back to top of list** at the bottom of the species view to return to the start of a long list.

## Add species to the app

To add a species, edit the appropriate `bush_food_data_master.csv`, `bush_med_data_master.csv`, or `wildflower_data_master.csv` file, add a row using the existing columns and a unique `species_id`, then save the CSV and refresh the app.

To add its photo, copy the image into the `species_photos/` folder and enter its relative path in that row's `photo_hlink` column, for example `species_photos/Acacia cyclops.jpg`. Ensure the filename of the photo exactly matches the name entered into the species_name column of the .csv file. Keep the image in `species_photos/` when moving or copying the project files.

## Troubleshooting

If the app is not loading correctly and missing items like species photographs, press Ctrl + F5 while in the browser for a hard refresh.
Contact app developers via GitHub if issues persist.

## Offline use

Keep the project files together, including the CSV files, `category_photos/`, and `species_photos/`. When those files are available on the device, the app and its photos do not require an internet connection. A local web server is still required to load the CSV data in the browser. Found checkbox states are stored separately in that browser's local storage.

## References for artwork, information, and photographs in the app:

Atlas of Living Australia. (n.d.). Home.  http://www.ala.org.au.
Australian Bureau of Meteorology. (2026). Nyoongar calendar. Indigenous Weather Knowledge. https://www.bom.gov.au/resources/indigenous-weather-knowledge/indigenous-seasonal-calendars/nyoongar-calendar
Hansen, V., & Horsfall, J. (2019). Noongar bush tucker : bush food plants and fungi of the south-west of Western Australia. UWA Publishing.
Hansen, V., & Horsfall, J. (2016). Noongar bush medicine plants : medicinal plants of the south-west of Western Australia. UWA Publishing.
Hansen, Y. S., & Slater, B. (n.d.). Six seasons [Painting]. Japingka Aboriginal Art Gallery. https://japingkaaboriginalart.com
Microsoft. (2026). Bing satellite imagery layer [Map]. https://ecn.t3.tiles.virtualearth.net/tiles/
South West Aboriginal Land and Sea Council. (n.d.). About the settlement agreement. https://www.noongar.org.au/about-settlement-agreement
WA Wildflower Nursery. (n.d.). Current plant lists. https://wawildflowernursery.org.au/plant-list
Western Australian Herbarium. (n.d.). Home. Florabase. Department of Biodiversity, Conservation and Attractions. https://florabase.dbca.wa.gov.au/
Western Australian Land Information Authority. (2026). Native_Title_ILUA_LGATE_067 GDA2020 [Data set]. Data WA. https://data-downloads.slip.wa.gov.au/LGATE-067/Shapefile
Western Australian Land Information Authority. (2026). Townsites (LGATE-248) [Data set]. Data WA. https://data-downloads.slip.wa.gov.au/LGATE-248/Shapefile