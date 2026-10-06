# Application architecture

The diagram below describes the current application. It is written in Mermaid so
the diagram can be edited as text in this file and rendered by Mermaid-compatible
editors and viewers.

```mermaid
flowchart TB
    User([User])

    subgraph Host["Local static web server"]
        HTML["index.html<br/>Application shell"]
        JS["app.js<br/>Startup, state, data processing,<br/>navigation, rendering, event handlers"]
        CSS["styles.css<br/>Layout and visual styling"]
        CSV["Five CSV data files<br/>Seasons, ILUA areas,<br/>bush food, bush medicine, wildflowers"]
        Images["Static image assets<br/>Season artwork, map,<br/>category and species photos"]
    end

    subgraph Browser["User's web browser"]
        DOM["Application DOM"]
        State["In-memory application state<br/>Navigation stack, selected season/ILUA/category,<br/>Found filter and checkbox state"]
        LocalStorage[("localStorage<br/>Saved Found checkboxes")]
        Views["Rendered views<br/>Season wheel · ILUA map · Category selection<br/>Species list · Found-to-date list · Comparisons dashboard"]
    end

    User -->|"Opens app URL and interacts"| HTML
    HTML -->|"Loads structure"| DOM
    HTML -->|"Loads script"| JS
    HTML -->|"Loads stylesheet"| CSS
    JS -->|"Renders and updates"| DOM
    CSS -->|"Styles"| DOM

    JS -->|"Fetches five CSV files over HTTP"| CSV
    CSV -->|"CSV response text"| JS
    JS -->|"Parse CSV; validate rows and required columns"| JS
    JS -->|"Build season/ILUA lookups and normalized species catalog"| State
    LocalStorage -->|"Restore saved checkbox values at startup"| State
    State -->|"Current data and selections"| Views
    Views -->|"Rendered content"| DOM
    DOM -->|"Clicks, filter changes, Found toggles"| JS
    JS -->|"Update selections, navigation stack, and filters"| State
    JS -->|"Save Found checkbox changes"| LocalStorage
    JS -->|"Image requests from rendered views"| Images
    Images -->|"Photos and artwork"| DOM

    subgraph Processing["Data used by application views"]
        Lookups["Season and ILUA lookup tables"]
        Catalog["Combined species catalog<br/>Each record includes category,<br/>season-presence flags, and ILUA-presence flags"]
        Filter["Species filtering and alphabetical sorting<br/>Selected season + ILUA + category"]
        Counts["Dashboard counts<br/>By season, ILUA area, category,<br/>and season-ILUA pair"]
    end

    JS -->|"Builds"| Lookups
    JS -->|"Combines and normalizes species CSV rows"| Catalog
    Lookups -->|"Names and labels"| Views
    Catalog -->|"Selection inputs"| Filter
    State -->|"Selected season, area, category"| Filter
    Filter -->|"Matching species"| Views
    Catalog -->|"Availability flags and categories"| Counts
    Counts -->|"Counts and comparison matrix"| Views

    JS -.->|"Load/parse/validation failure renders a data-load error"| DOM
```

## Data and behavior notes

- `app.js` requests the five CSV files when the page starts. It parses and
  validates them, then prepares lookup tables and a combined species catalog.
- The season wheel, ILUA selection, category selection, species views, and
  comparison dashboard are rendered in the browser from that data.
- A species may be recorded in multiple seasons and ILUA areas. Therefore,
  dashboard counts for those groups overlap and should not be summed as a
  distinct-species total.
- Found checkbox values are saved in browser `localStorage` on the current
  device. CSV data and image assets are served as static files; there is no
  application backend or remote database.
