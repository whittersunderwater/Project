// Core configuration for the seasonal wheel and the rest of the app.
// These arrays define the order of seasons and ILUA areas used across the UI.
const SEASON_ORDER = ['s1', 's2', 's3', 's4', 's5', 's6'];
const ILUA_ORDER = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'];
const SEASON_COLORS = {
  s1: 'rgb(216, 109, 79)',
  s2: 'rgb(240, 178, 60)',
  s3: 'rgb(217, 161, 91)',
  s4: 'rgb(155, 185, 138)',
  s5: 'rgb(182, 207, 226)',
  s6: 'rgb(217, 166, 177)'
};
const CATEGORY_INFO = {
  bush_food: {
    label: 'Bush Food',
    photo: 'category_photos/Santalum%20acuminatum.jpg',
    photoAlt: 'Santalum acuminatum (Quandong)'
  },
  bush_medicine: {
    label: 'Bush Medicine',
    photo: 'category_photos/Solanum%20lasiophyllum.jpg',
    photoAlt: 'Solanum lasiophyllum'
  },
  wildflower: {
    label: 'Wildflowers',
    photo: 'category_photos/Caladenia%20macrostylis.jpg',
    photoAlt: 'Caladenia macrostylis'
  }
};

const STATE = {
  navStack: ['season'],
  selectedSeason: '',
  selectedILUA: '',
  selectedCategory: '',
  foundFilter: 'all',
  storageWarning: false,
  checked: loadCheckedState()
};

let seasonLookup = {};
let iluaLookup = {};
let speciesCatalog = [];

// App startup: load all CSV datasets, build lookup tables, then render the first screen.
async function initApp() {
  try {
    const [seasonRows, iluaRows, foodRows, medRows, wildRows] = await Promise.all([
      fetchCSV('season_data_master.csv'),
      fetchCSV('ilua_data_master.csv'),
      fetchCSV('bush_food_data_master.csv'),
      fetchCSV('bush_med_data_master.csv'),
      fetchCSV('wildflower_data_master.csv')
    ]);

    seasonLookup = buildSeasonLookup(seasonRows);
    iluaLookup = buildIluaLookup(iluaRows);
    speciesCatalog = buildSpeciesCatalog(foodRows, medRows, wildRows);

    render();
    document.getElementById('homeButton').addEventListener('click', goHome);
    document.getElementById('backButton').addEventListener('click', goBack);
  } catch (error) {
    console.error(error);
    document.getElementById('appView').innerHTML = `
      <div class="view">
        <div class="empty-state">
          <h2>Data could not be loaded.</h2>
          <p>Please ensure the CSV files are present in the project folder and run this app from a local web server.</p>
        </div>
      </div>
    `;
  }
}

// Central page switcher. It decides which screen to show based on the current navigation state.
function render() {
  const view = STATE.navStack[STATE.navStack.length - 1];
  const appView = document.getElementById('appView');
  const homeButton = document.getElementById('homeButton');
  const backButton = document.getElementById('backButton');

  homeButton.classList.toggle('hidden', STATE.navStack.length <= 1);
  backButton.classList.toggle('hidden', STATE.navStack.length <= 1);

  if (view === 'season') {
    appView.innerHTML = renderSeasonView();
    bindSeasonEvents();
    return;
  }

  if (view === 'ilua') {
    appView.innerHTML = renderIluaView();
    bindIluaEvents();
    return;
  }

  if (view === 'category') {
    appView.innerHTML = renderCategoryView();
    bindCategoryEvents();
    return;
  }

  if (view === 'species') {
    appView.innerHTML = renderSpeciesView();
    bindSpeciesEvents();
    return;
  }

  if (view === 'foundSpecies') {
    appView.innerHTML = renderFoundSpeciesView();
    bindSpeciesEvents(true);
    return;
  }

  if (view === 'comparisons') {
    appView.innerHTML = renderSeasonComparisonsView();
  }
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}

function describeAnnularSector(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}`,
    'Z'
  ].join(' ');
}

// Builds the seasonal wheel screen. It creates six SVG wedges, places the seasonal data on them,
// and applies per-season rotation adjustments so the labels align with the wheel.
function renderSeasonView() {
  const cx = 340;
  const cy = 340;
  const innerRadius = 165;
  const outerRadius = 305;

  const seasonCards = SEASON_ORDER.map((id, index) => {
    const season = seasonLookup[id];
    const isSelected = STATE.selectedSeason === id;
    const startAngle = index * 60;
    const endAngle = startAngle + 60;
    const path = describeAnnularSector(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
    const midAngle = startAngle + 30;
    const labelRadius = 245;
    const labelPoint = polarToCartesian(cx, cy, labelRadius, midAngle);
    const isBirak = id === 's1';
    const isBunuru = id === 's2';
    const isDjeran = id === 's3';
    const isMakuru = id === 's4';
    const isDjilba = id === 's5';
    const isKambarang = id === 's6';
    const extraRotation = isBirak || isBunuru || isDjilba || isKambarang ? -90 : isDjeran || isMakuru ? 90 : 0;
    const seasonName = season.season_name || '';
    const seasonInfo1 = season.season_info1 || '';
    const seasonInfo2 = season.season_info2 || '';

    return `
      <g class="season-wedge ${isSelected ? 'selected' : ''}" data-season="${id}" data-angle="${midAngle}">
        <path d="${path}" fill="${SEASON_COLORS[id]}" stroke="${SEASON_COLORS[id]}" stroke-width="4" />
        <g transform="translate(${labelPoint.x} ${labelPoint.y}) rotate(${midAngle + 90 + extraRotation})">
          <text class="season-text season-name" x="0" y="-22" text-anchor="middle" transform="rotate(${midAngle > 90 && midAngle < 270 ? 180 : 0})">${seasonName}</text>
          <text class="season-text season-month" x="0" y="0" text-anchor="middle" transform="rotate(${midAngle > 90 && midAngle < 270 ? 180 : 0})">${season.season_months}</text>
          <text class="season-text season-weather" x="0" y="24" text-anchor="middle" transform="rotate(${midAngle > 90 && midAngle < 270 ? 180 : 0})">${season.season_weather}</text>
          <text class="season-text season-info1" x="0" y="48" text-anchor="middle" transform="rotate(${midAngle > 90 && midAngle < 270 ? 180 : 0})">${seasonInfo1}</text>
          <text class="season-text season-info2" x="0" y="72" text-anchor="middle" transform="rotate(${midAngle > 90 && midAngle < 270 ? 180 : 0})">${seasonInfo2}</text>
        </g>
      </g>
    `;
  }).join('');

  return `
    <div class="view">
      <div class="view-header">
        <h2>The Noongar calendar comprises six seasons based on a yearly cycle of changes in nature. The seasons vary in length depending on environmental cues and reflect connection to land for Noongar people.
        Each seasonal transition brings changes in temperature, wind, rain and availability of plant and animal foods, which historically indicated time to move to a different geographical area. Traditionally, this would often involve mosaic burning to clear the land and activate seed germination with the next rains, thus maintaining sustainable use of the land.</h2>
        <p>Select a season to begin exploring the seasons, regions, and plants of Noongar Country.</p>
      </div>

      <div class="season-wheel" aria-label="Season selection wheel">
        <svg class="season-svg" viewBox="0 0 680 680" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <circle cx="340" cy="340" r="165" fill="rgba(157,124,180,0.90)" stroke="rgba(39,64,53,0.12)" stroke-width="2" />
          <circle cx="340" cy="340" r="72" fill="rgba(157,124,180,0.90)" stroke="rgba(39,64,53,0.12)" stroke-width="2" />
          ${seasonCards}
        </svg>
        <div class="season-wheel-center">
          <div>
            <div class="main-label">NOONGAR</div>
            <div class="mini-title">SIX</div>
            <div class="mini-title">SEASONS</div>
          </div>
        </div>
      </div>
      <div class="home-actions">
        <button class="found-species-button" type="button">View all species found to date</button>
        <button class="comparison-button" type="button">Season, ILUA, and Category comparisons</button>
      </div>
    </div>
    `;
}

function renderSeasonComparisonsView() {
  const seasonCounts = SEASON_ORDER.map((id) => ({
    id,
    label: seasonLookup[id].season_name.toUpperCase(),
    count: speciesCatalog.filter((species) => species.seasonPresence[id] === 'y').length
  }));
  const iluaCounts = ILUA_ORDER.map((id) => ({
    id,
    label: iluaLookup[id].ilua_name,
    count: speciesCatalog.filter((species) => species.iluaPresence[id] === 'y').length
  }));
  const categoryCounts = Object.entries(CATEGORY_INFO).map(([id, category]) => ({
    id,
    label: category.label.toUpperCase(),
    count: speciesCatalog.filter((species) => species.category === id).length
  }));
  const maxCount = Math.max(
    1,
    ...seasonCounts.map((item) => item.count),
    ...iluaCounts.map((item) => item.count),
    ...categoryCounts.map((item) => item.count)
  );

  const renderBars = (items, group) => items.map((item) => `
    <div class="comparison-bar-row" data-comparison-group="${group}" data-comparison-id="${item.id}">
      <span class="comparison-label">${item.label}</span>
      <span class="comparison-track" aria-hidden="true">
        <span class="comparison-bar ${group}-bar" style="width: ${(item.count / maxCount) * 100}%;${group === 'season' ? ` background-color: ${SEASON_COLORS[item.id]};` : ''}"></span>
      </span>
      <span class="comparison-count">${item.count} species</span>
    </div>
  `).join('');

  const seasonIluaMatrix = SEASON_ORDER.map((seasonId) => `
    <tr>
      <th scope="row">${seasonLookup[seasonId].season_name.toUpperCase()}</th>
      ${ILUA_ORDER.map((iluaId) => {
        const count = speciesCatalog.filter((species) =>
          species.seasonPresence[seasonId] === 'y' &&
          species.iluaPresence[iluaId] === 'y'
        ).length;
        return `<td data-season="${seasonId}" data-ilua="${iluaId}">${count}</td>`;
      }).join('')}
    </tr>
  `).join('');

  return `
    <div class="view comparisons-view">
      <div class="view-header">
        <h2>Season, ILUA, and Category comparisons</h2>
        <p>Compare how many catalogued species are recorded across seasons, ILUA areas, and plant categories.</p>
      </div>

      <section class="comparison-section" aria-labelledby="season-counts-title">
        <h3 id="season-counts-title">Species by season</h3>
        <div class="comparison-bars">${renderBars(seasonCounts, 'season')}</div>
      </section>

      <section class="comparison-section" aria-labelledby="ilua-counts-title">
        <h3 id="ilua-counts-title">Species by ILUA area</h3>
        <div class="comparison-bars">${renderBars(iluaCounts, 'ilua')}</div>
      </section>

      <section class="comparison-section" aria-labelledby="category-counts-title">
        <h3 id="category-counts-title">Species by category</h3>
        <div class="comparison-bars">${renderBars(categoryCounts, 'category')}</div>
      </section>

      <section class="comparison-section matrix-section" aria-labelledby="season-ilua-title">
        <h3 id="season-ilua-title">Species by season and ILUA area</h3>
        <p>Each cell counts species recorded in both the season and the ILUA area.</p>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th scope="col">SEASON</th>
                ${ILUA_ORDER.map((id) => `<th scope="col">${iluaLookup[id].ilua_name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>${seasonIluaMatrix}</tbody>
          </table>
        </div>
      </section>

      <p class="comparison-note">Counts are based on the species records and season/ILUA availability flags in the project data.</p>
    </div>
  `;
}

// Creates the ILUA selection screen. It presents each ILUA area as a selectable map node.
function renderIluaView() {
  const labelPositions = {
    i1: { x: 60, y: 40 },
    i2: { x: 35, y: 58 },
    i3: { x: 19, y: 76 },
    i4: { x: 58, y: 79 },
    i5: { x: 26, y: 35 },
    i6: { x: 24, y: 18 }
  };

  const iluaCards = ILUA_ORDER.map((id) => {
    const { x, y } = labelPositions[id];
    const widthMap = {
      i1: 'width: 95px;',
      i4: 'width: 85px;',
      i5: 'width: 72px;',
      i6: 'width: 72px;'
    };
    const widthStyle = widthMap[id] || '';
    return `
      <button class="ilua-node ${STATE.selectedILUA === id ? 'selected' : ''}" type="button" data-ilua="${id}" style="left:${x}%; top:${y}%; ${widthStyle}">
        ${iluaLookup[id].ilua_name}
      </button>
    `;
  }).join('');

  return `
    <div class="view">
      <div class="view-header">
        <h2>The Noongar Indigenous Land Use Agreement (ILUA) regions cover around 200,000 square kilometres of the southwest of Western Australia. They are separate geographic regions under the South West Native Title Settlement and represent distinct traditional dialect and family groups.</h2>
        <p>Select a Noongar ILUA region on the map to continue exploring.</p>
      </div>

      <div class="selection-summary">
        <span class="summary-pill">Season: ${STATE.selectedSeason ? seasonLookup[STATE.selectedSeason].season_name : 'Not selected'}</span>
      </div>

      <div class="map-panel">
        <div class="ilua-info-grid">
          ${ILUA_ORDER.map((id) => `
            <article class="info-card">
              <h3>${iluaLookup[id].ilua_name}</h3>
              <p>${iluaLookup[id].ilua_info}</p>
            </article>
          `).join('')}
        </div>

        <div class="ilua-map" aria-label="ILUA map selection">
          ${iluaCards}
        </div>
      </div>
    </div>
  `;
}

// Shows the category selection screen for bush food, bush medicine, and wildflowers.
function renderCategoryView() {
  return `
    <div class="view">
      <div class="view-header">
        <h2>Select a plant category</h2>
        <p>See which species are available in ${seasonLookup[STATE.selectedSeason].season_name} within ${iluaLookup[STATE.selectedILUA].ilua_name}.</p>
      </div>

      <div class="selection-summary">
        <span class="summary-pill">Season: ${seasonLookup[STATE.selectedSeason].season_name}</span>
        <span class="summary-pill">Area: ${iluaLookup[STATE.selectedILUA].ilua_name}</span>
      </div>

      <div class="category-grid">
        ${Object.entries(CATEGORY_INFO).map(([key, item]) => {
          const representative = speciesCatalog.find((species) => species.category === key && species.photo_hlink);
          const photoSrc = item.photo || representative?.photo_hlink || placeholderImage(item.label);
          const photoAlt = item.photoAlt || (representative
            ? `${item.label}: ${representative.species_name}`
            : `${item.label} plant photo`);

          return `
            <button class="category-card" type="button" data-category="${key}">
              <img class="category-photo" src="${photoSrc}" alt="${photoAlt}" loading="lazy" onerror="this.onerror=null;this.src='${placeholderImage(item.label)}'" />
              <div>${item.label}</div>
              ${key === 'bush_food' ? '<div class="category-subtitle">Santalum acuminatum - Quandong</div>' : ''}
              ${key === 'bush_medicine' ? '<div class="category-subtitle">Solanum lasiophyllum - Flannel Bush</div>' : ''}
              ${key === 'wildflower' ? '<div class="category-subtitle">Caladenia macrostylis - Leaping Spider Orchid</div>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Displays the filtered species list for the selected season, ILUA area, and category.
function renderSpeciesView() {
  const allSpecies = getFilteredSpecies();
  const foundCount = allSpecies.filter((item) => Boolean(STATE.checked[item.id])).length;
  const species = allSpecies.filter((item) => {
    if (STATE.foundFilter === 'all') return true;
    return Boolean(STATE.checked[item.id]) === (STATE.foundFilter === 'found');
  });

  return `
    <div class="view">
      <div class="selection-summary">
        <span class="summary-pill">Season: ${seasonLookup[STATE.selectedSeason].season_name}</span>
        <span class="summary-pill">Area: ${iluaLookup[STATE.selectedILUA].ilua_name}</span>
        <span class="summary-pill">Category: ${CATEGORY_INFO[STATE.selectedCategory].label}</span>
      </div>

      <div class="species-filters">
        <div class="species-filter-control">
          <label for="found-filter">Show species:</label>
          <select id="found-filter">
            <option value="all" ${STATE.foundFilter === 'all' ? 'selected' : ''}>All species</option>
            <option value="found" ${STATE.foundFilter === 'found' ? 'selected' : ''}>Found</option>
            <option value="not-found" ${STATE.foundFilter === 'not-found' ? 'selected' : ''}>Not found</option>
          </select>
        </div>
        <p class="species-found-count" id="species-found-count" aria-live="polite">
          Species found: ${foundCount} of ${allSpecies.length}
        </p>
      </div>
      ${STATE.storageWarning ? `
        <p class="storage-warning" role="status">
          Found selections could not be saved on this device. Changes will last only until this page is closed.
        </p>
      ` : ''}

      ${renderSpeciesList(species, allSpecies.length
        ? `No species marked ${STATE.foundFilter === 'found' ? 'Found' : 'Not found'} in this selection.`
        : 'No species match this combination of season, ILUA area, and category.')}
      ${species.length ? '<button class="list-top-button" type="button">Back to top of list</button>' : ''}
      ${renderPhotoDialog(species.length > 0)}
    </div>
  `;
}

// Shows every species marked Found, without applying season, ILUA, or category filters.
function renderFoundSpeciesView() {
  const species = speciesCatalog
    .filter((item) => Boolean(STATE.checked[item.id]))
    .sort((first, second) => first.species_name.localeCompare(
      second.species_name,
      undefined,
      { sensitivity: 'base' }
    ));
  const foundCount = species.length;

  return `
    <div class="view found-species-view">
      <div class="view-header">
        <h2>Species Found to Date</h2>
        <p>All species you have marked Found, across every season, ILUA area, and category.</p>
        <p class="found-to-date-count" id="found-to-date-count" aria-live="polite">
          Species found to date: ${foundCount} of ${speciesCatalog.length}
        </p>
      </div>
      ${STATE.storageWarning ? `
        <p class="storage-warning" role="status">
          Found selections could not be saved on this device. Changes will last only until this page is closed.
        </p>
      ` : ''}
      ${renderSpeciesList(species, 'No species have been marked Found yet.', true)}
      ${species.length ? '<button class="list-top-button" type="button">Back to top of list</button>' : ''}
      ${renderPhotoDialog(species.length > 0)}
    </div>
  `;
}

function renderSpeciesList(species, emptyMessage, showCategory = false) {
  return `
    <div class="species-list">
      ${species.length ? species.map((item) => {
        const checked = Boolean(STATE.checked[item.id]);
        const photoSrc = item.photo_hlink || placeholderImage(item.common_name || item.species_name);
        const categoryName = CATEGORY_INFO[item.category]?.label || 'Other';

        return `
          <article class="species-card">
            <button class="species-photo-button" type="button" aria-label="Enlarge photo: ${item.species_name}" data-photo-alt="${item.species_name}">
              <img class="species-photo" src="${photoSrc}" alt="${item.species_name}" onerror="this.onerror=null;this.src='${placeholderImage(item.common_name || item.species_name)}'" />
            </button>
            <div class="species-body">
              <h3>${item.species_name}</h3>
              ${showCategory ? `<p class="subtitle species-category">${categoryName}</p>` : ''}
              <p class="subtitle common-name">${item.common_name || 'No common name recorded'}</p>
              ${['wildflower', 'wildflowers'].includes(item.category) ? '' : `<p class="subtitle">Noongar name: ${item.noongar_name || 'Not recorded'}</p>`}
              <p>${item.species_info || 'No additional species information available.'}</p>
            </div>
            <label class="found-toggle">
              <input type="checkbox" data-species-id="${item.id}" ${checked ? 'checked' : ''} />
              <span>Found</span>
            </label>
          </article>
        `;
      }).join('') : `<div class="empty-state">${emptyMessage}</div>`}
    </div>
  `;
}

function renderPhotoDialog(hasSpecies) {
  return hasSpecies ? `
    <dialog class="photo-dialog" aria-label="Enlarged species photo">
      <button class="photo-dialog-close" type="button" aria-label="Close enlarged photo">Close</button>
      <img class="photo-dialog-image" alt="" />
      <p class="photo-dialog-caption"></p>
    </dialog>
  ` : '';
}

// Attaches click handlers to each interactive element in the current view.
function bindSeasonEvents() {
  document.querySelector('.found-species-button')?.addEventListener('click', () => {
    STATE.navStack.push('foundSpecies');
    render();
  });

  document.querySelector('.comparison-button')?.addEventListener('click', () => {
    STATE.navStack.push('comparisons');
    render();
  });

  document.querySelectorAll('.season-wedge').forEach((wedge) => {
    wedge.style.cursor = 'pointer';
    wedge.addEventListener('click', () => {
      STATE.selectedSeason = wedge.dataset.season;
      STATE.navStack.push('ilua');
      render();
    });
  });
}

function bindIluaEvents() {
  document.querySelectorAll('.ilua-node').forEach((button) => {
    button.addEventListener('click', () => {
      STATE.selectedILUA = button.dataset.ilua;
      STATE.navStack.push('category');
      render();
    });
  });
}

function bindCategoryEvents() {
  document.querySelectorAll('.category-card').forEach((button) => {
    button.addEventListener('click', () => {
      STATE.selectedCategory = button.dataset.category;
      STATE.navStack.push('species');
      render();
    });
  });
}

function bindSpeciesEvents(foundOnly = false) {
  document.querySelector('#found-filter')?.addEventListener('change', (event) => {
    STATE.foundFilter = event.target.value;
    render();
  });

  document.querySelector('.list-top-button')?.addEventListener('click', () => {
    document.querySelector('.species-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const photoDialog = document.querySelector('.photo-dialog');
  const enlargedPhoto = photoDialog?.querySelector('.photo-dialog-image');
  const photoCaption = photoDialog?.querySelector('.photo-dialog-caption');

  document.querySelectorAll('.species-photo-button').forEach((button) => {
    button.addEventListener('click', () => {
      const thumbnail = button.querySelector('.species-photo');
      enlargedPhoto.src = thumbnail.currentSrc || thumbnail.src;
      enlargedPhoto.alt = button.dataset.photoAlt;
      photoCaption.textContent = button.dataset.photoAlt;
      photoDialog.showModal();
    });
  });

  document.querySelector('.photo-dialog-close')?.addEventListener('click', () => photoDialog.close());
  photoDialog?.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const speciesId = event.target.dataset.speciesId;
      STATE.checked[speciesId] = event.target.checked;
      const hadStorageWarning = STATE.storageWarning;
      try {
        localStorage.setItem('noongarPlantFinderChecked', JSON.stringify(STATE.checked));
        STATE.storageWarning = false;
      } catch (error) {
        console.error('Could not save Found selections to browser storage.', error);
        STATE.storageWarning = true;
      }

      const matchingSpecies = getFilteredSpecies();
      const foundCount = matchingSpecies
        .filter((species) => Boolean(STATE.checked[species.id])).length;
      const foundCountElement = document.querySelector('#species-found-count');
      if (foundCountElement) {
        foundCountElement.textContent = `Species found: ${foundCount} of ${matchingSpecies.length}`;
      }

      const matchesFoundFilter = STATE.foundFilter === 'all' ||
        STATE.checked[speciesId] === (STATE.foundFilter === 'found');
      if (
        (foundOnly && !STATE.checked[speciesId]) ||
        (!foundOnly && !matchesFoundFilter) ||
        STATE.storageWarning ||
        hadStorageWarning
      ) {
        render();
      }
    });
  });
}

function goBack() {
  if (STATE.navStack.length > 1) {
    STATE.navStack.pop();
    render();
  }
}

function goHome() {
  STATE.navStack = ['season'];
  STATE.selectedSeason = '';
  STATE.selectedILUA = '';
  STATE.selectedCategory = '';
  render();
}

function getFilteredSpecies() {
  if (!STATE.selectedSeason || !STATE.selectedILUA || !STATE.selectedCategory) {
    return [];
  }

  return speciesCatalog.filter((species) => {
    return (
      species.category === STATE.selectedCategory &&
      species.seasonPresence[STATE.selectedSeason] === 'y' &&
      species.iluaPresence[STATE.selectedILUA] === 'y'
    );
  }).sort((first, second) => first.species_name.localeCompare(second.species_name, undefined, { sensitivity: 'base' }));
}

function getSeasonSummary(species) {
  return SEASON_ORDER.filter((id) => species.seasonPresence[id] === 'y')
    .map((id) => seasonLookup[id].season_name)
    .slice(0, 3)
    .join(', ');
}

function getIluaSummary(species) {
  return ILUA_ORDER.filter((id) => species.iluaPresence[id] === 'y')
    .map((id) => iluaLookup[id].ilua_name)
    .slice(0, 3)
    .join(', ');
}

// Converts the CSV rows into lookup objects so data can be retrieved by ID quickly.
function buildSeasonLookup(rows) {
  return rows.reduce((acc, row) => {
    acc[row.season_id] = row;
    return acc;
  }, {});
}

function buildIluaLookup(rows) {
  return rows.reduce((acc, row) => {
    acc[row.ilua_id] = row;
    return acc;
  }, {});
}

function buildSpeciesCatalog(foodRows, medRows, wildRows) {
  const allRows = [...foodRows, ...medRows, ...wildRows];

  return allRows.map((row) => {
    const seasonPresence = {};
    const iluaPresence = {};

    SEASON_ORDER.forEach((id) => {
      seasonPresence[id] = row[id] ? row[id].toLowerCase() : 'n';
    });

    ILUA_ORDER.forEach((id) => {
      iluaPresence[id] = row[id] ? row[id].toLowerCase() : 'n';
    });

    const category = row.category || 'wildflower';
    const photoLink = row.photo_hlink || '';
    const photoFileName = photoLink.split(/[\\/]/).pop();
    const photoUrl = /^[a-z]:[\\/]/i.test(photoLink)
      ? `species_photos/${encodeURIComponent(photoFileName)}`
      : photoLink;

    return {
      id: row.species_id,
      species_name: row.species_name || 'Unknown species',
      common_name: row.common_name || '',
      noongar_name: row.noongar_name || '',
      category,
      species_info: row.species_info || 'No information supplied.',
      photo_hlink: photoUrl,
      seasonPresence,
      iluaPresence
    };
  });
}

// Fetches and parses local CSV files into JavaScript objects for the app.
function fetchCSV(filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      const rows = parseCSV(text);
      validateCSVRows(filePath, rows);
      return rows;
    });
}

function validateCSVRows(filePath, rows) {
  if (!rows.length) {
    throw new Error(`${filePath} is empty or has no data rows.`);
  }

  const requiredHeaders = {
    'season_data_master.csv': [
      'season_id', 'season_name', 'season_info1', 'season_info2',
      'season_months', 'season_weather'
    ],
    'ilua_data_master.csv': ['ilua_id', 'ilua_name', 'ilua_info'],
    'bush_food_data_master.csv': [
      'species_id', 'species_name', 'category',
      ...SEASON_ORDER, ...ILUA_ORDER
    ],
    'bush_med_data_master.csv': [
      'species_id', 'species_name', 'category',
      ...SEASON_ORDER, ...ILUA_ORDER
    ],
    'wildflower_data_master.csv': [
      'species_id', 'species_name', 'category',
      ...SEASON_ORDER, ...ILUA_ORDER
    ]
  }[filePath];

  if (!requiredHeaders) return;

  const missingHeaders = requiredHeaders.filter(
    (header) => !Object.prototype.hasOwnProperty.call(rows[0], header)
  );
  if (missingHeaders.length) {
    throw new Error(`${filePath} is missing required columns: ${missingHeaders.join(', ')}`);
  }
}

// Parses the CSV format used by the project, including quoted values and multiline content.
function parseCSV(text) {
  const rows = [];
  let current = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }

      row.push(current);
      current = '';

      if (row.some((cell) => cell !== '')) {
        rows.push(row);
      }
      row = [];
    } else {
      current += char;
    }
  }

  if (inQuotes) {
    throw new Error('Malformed CSV: unmatched quote.');
  }

  if (current.length || row.length) {
    row.push(current);
    if (row.some((cell) => cell !== '')) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (values[index] || '').trim();
    });
    return record;
  });
}

// Restores the checked state for species so “Found” selections persist between page reloads.
function loadCheckedState() {
  try {
    const value = localStorage.getItem('noongarPlantFinderChecked');
    return value ? JSON.parse(value) : {};
  } catch (error) {
    return {};
  }
}

function placeholderImage(label) {
  const safeLabel = (label || 'Plant').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#e5edd8"/>
      <circle cx="300" cy="150" r="72" fill="#9ec28a"/>
      <path d="M300 220 L300 310" stroke="#4d6c3d" stroke-width="18" stroke-linecap="round"/>
      <path d="M260 245 L300 225 L340 245" fill="none" stroke="#4d6c3d" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="300" y="360" text-anchor="middle" font-size="32" font-family="Arial" fill="#2c4d38">${safeLabel}</text>
    </svg>
  `)}`;
}

initApp();
