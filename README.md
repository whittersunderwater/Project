# Noongar Seasons and Country Explorer

This app helps you explore plant species by Noongar season, ILUA area, and category. Species lists include plant photos and information, and you can mark species you find.

## Start the app

The app loads its CSV data with browser requests, so open it through a local web server rather than opening `index.html` directly.

1. Ensure your device has terminal capabilities
2. Download all files from GitHub (https://github.com/whittersunderwater/Project.git) and save to your device
3. Open PowerShell or a terminal and navigate to the "Project" folder.
4. Start the server:

   ```powershell
   py -m http.server 8000
   ```

   If `py` is unavailable but Python is installed, use `python3 -m http.server 8000` instead.
   If Python is not installed, download latest version and install.
5. In your browser, navigate to <http://localhost:8000>.
6. Leave the terminal window open while using the app. Press Ctrl+C in that window when you are finished.

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

Use **Back to top of list** at the bottom of the species view to return to the start of a long list.

## Troubleshooting

If the app is not loading correctly and missing items like species photographs, select Ctrl + F5 in the browser for a hard refresh.
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