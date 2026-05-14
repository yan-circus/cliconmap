// ─── Version ─────────────────────────────────────────────────────────────────

const APP_VERSION = { hash: 'aae77cc', date: '2026-05-12', time: '21:02', msg: 'Dev panel : affichage hash version (APP_VERSION)' };

// ─── Constants ───────────────────────────────────────────────────────────────

const LIVES_MAX              = 3;
const FEEDBACK_DELAY_CORRECT = 700;
const FEEDBACK_DELAY_WRONG   = 2500;
const SMALL_KM2              = 2000;
const TIME_LIMIT             = 5;      // seconds per question
const SCORE_MIN              = 100;
const SCORE_MAX              = 1000;
const ZOOM_FACTOR            = 0.87;   // zoom in per tick (< 1)
const ZOOM_MIN_W             = 40;     // max zoom in (SVG units)

const LEVEL_NAMES = {
  1: 'Monde entier', 2: 'Europe', 3: 'Union Européenne',
  4: 'Afrique', 5: 'Asie', 6: 'Amérique', 7: 'Océanie',
};
const GAME_TYPE_NAMES = { 1: 'Classique', 2: 'Sans chrono' };

const SKIN_IDS   = { sombre: 1, colore: 2, tresor: 3, multi: 4 };
const SKIN_NAMES = { 1: 'sombre', 2: 'colore', 3: 'tresor', 4: 'multi' };

const VIEWBOXES = {
  monde:    '0 0 2000 857',
  Europe:   '800 60 520 240',
  UE:       '800 60 520 240',
  Afrique:  '780 195 590 510',
  Asie:     '1100 50 750 440',
  Amérique: '0 30 930 800',
  Océanie:  '1470 340 540 360',
};

const CLASS_TO_ISO = {
  "Angola":                          "AO",
  "Antigua and Barbuda":             "AG",
  "Argentina":                       "AR",
  "Australia":                       "AU",
  "Azerbaijan":                      "AZ",
  "Bahamas":                         "BS",
  "Canada":                          "CA",
  "Cape Verde":                      "CV",
  "Chile":                           "CL",
  "China":                           "CN",
  "Comoros":                         "KM",
  "Cyprus":                          "CY",
  "Denmark":                         "DK",
  "Federated States of Micronesia":  "FM",
  "Fiji":                            "FJ",
  "France":                          "FR",
  "Greece":                          "GR",
  "Indonesia":                       "ID",
  "Italy":                           "IT",
  "Japan":                           "JP",
  "Malaysia":                        "MY",
  "Malta":                           "MT",
  "Mauritius":                       "MU",
  "New Zealand":                     "NZ",
  "Norway":                          "NO",
  "Oman":                            "OM",
  "Papua New Guinea":                "PG",
  "Philippines":                     "PH",
  "Russian Federation":              "RU",
  "Saint Kitts and Nevis":           "KN",
  "Samoa":                           "WS",
  "São Tomé and Principe":           "ST",
  "Seychelles":                      "SC",
  "Solomon Islands":                 "SB",
  "Tonga":                           "TO",
  "Trinidad and Tobago":             "TT",
  "Turkey":                          "TR",
  "United Kingdom":                  "GB",
  "United States":                   "US",
  "Vanuatu":                         "VU",
  "Canary Islands (Spain)":          "ES",
  "American Samoa":                  "AS",
  "Cayman Islands":                  "KY",
  "Faeroe Islands":                  "FO",
  "Falkland Islands":                "FK",
  "French Polynesia":                "PF",
  "Guadeloupe":                      "GP",
  "New Caledonia":                   "NC",
  "Northern Mariana Islands":        "MP",
  "Puerto Rico":                     "PR",
  "Turks and Caicos Islands":        "TC",
  "United States Virgin Islands":    "VI",
};

// ─── Themes ──────────────────────────────────────────────────────────────────

const THEMES = {
  sombre: {
    '--bg':           '#1a1a2e', '--surface':      '#16213e', '--accent':       '#0f3460',
    '--text':         '#e0e0e0', '--text-dim':     '#888',    '--ocean':        '#2a4a6b',
    '--country-fill': '#c8d6c8', '--hover-fill':   '#f0c040', '--correct':      '#2ecc71',
    '--wrong':        '#e74c3c', '--selected-fill':'#3ab5e6', '--radius-btn':   '6px',
    '--h1-font':      'inherit', '--header-bg':    'rgba(22,33,62,0.55)',
  },
  colore: {
    '--bg':           '#e8f4fd', '--surface':      '#ffffff', '--accent':       '#2980b9',
    '--text':         '#1a1a2a', '--text-dim':     '#d0e8f8', '--ocean':        '#5bafd6',
    '--country-fill': '#a8d8a8', '--hover-fill':   '#f39c12', '--correct':      '#27ae60',
    '--wrong':        '#c0392b', '--selected-fill':'#2980b9', '--radius-btn':   '6px',
    '--h1-font':      'inherit', '--header-bg':    'rgba(255,255,255,0.55)',
  },
  tresor: {
    '--bg':           '#1e1006', '--surface':      '#2e1a08', '--accent':       '#7a4a15',
    '--text':         '#f0ddb0', '--text-dim':     '#d4b880', '--ocean':        '#000000',
    '--country-fill': '#cd8e29', '--hover-fill':   '#e8b030', '--correct':      '#5a9040',
    '--wrong':        '#b03020', '--selected-fill':'#d4801a', '--radius-btn':   '6px',
    '--h1-font':      "Georgia, 'Times New Roman', serif", '--header-bg': 'rgba(46,26,8,0.55)',
  },
  multi: {
    '--bg':           '#1a1a2e', '--surface':      '#16213e', '--accent':       '#0f3460',
    '--text':         '#e0e0e0', '--text-dim':     '#888',    '--ocean':        '#1a2a4a',
    '--country-fill': '#c8d6c8', '--hover-fill':   '#f0c040', '--correct':      '#2ecc71',
    '--wrong':        '#e74c3c', '--selected-fill':'#3ab5e6', '--radius-btn':   '6px',
    '--h1-font':      'inherit', '--header-bg':    'rgba(22,33,62,0.55)',
  },
};

// ─── Theme ───────────────────────────────────────────────────────────────────

// Distribute hues using the golden angle + prime scrambling to break alphabetical clustering
function countryHue(iso) {
  const n = iso.charCodeAt(0) * 677 + iso.charCodeAt(1);
  return (n * 137.508) % 360;
}

function applyMulticolorPaths(active) {
  Object.entries(countryPaths).forEach(([iso, paths]) => {
    const h = countryHue(iso);
    paths.forEach(path => {
      if (active) {
        path.style.setProperty('--c-fill',     `hsl(${h},55%,50%)`);
        path.style.setProperty('--c-hover',    `hsl(${h},65%,72%)`);
        path.style.setProperty('--c-selected', `hsl(${h},55%,80%)`);
      } else {
        path.style.removeProperty('--c-fill');
        path.style.removeProperty('--c-hover');
        path.style.removeProperty('--c-selected');
      }
    });
  });
}

function applyTheme(name) {
  const vars = THEMES[name];
  if (!vars) return;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.body.dataset.theme = name;
  localStorage.setItem('geo-theme', name);
  document.querySelectorAll('.theme-card').forEach(c =>
    c.classList.toggle('active', c.dataset.theme === name)
  );
  applyMulticolorPaths(name === 'multi');
  const bgLayer = mapContainer.querySelector('#layer3');
  if (bgLayer) bgLayer.style.display = name === 'tresor' ? 'inline' : 'none';
}

// ─── State ───────────────────────────────────────────────────────────────────

let countries      = [];
let countryPaths   = {};   // ISO → SVGPathElement[]  (paths only, no circles)
let countryCircles = {};   // ISO → SVGCircleElement  (separate, invisible by default)
let countryById    = {};   // ISO → country object
let pathTerritory  = {};   // ISO → { territory → SVGPathElement[] }

let mode  = 'game';
let level = 'monde';

let infoPanelMode      = 'country';  // 'country' | 'territory'
let infoPanelTerritory = null;

// Profil joueur actif
let currentProfileId   = localStorage.getItem('geo-profile-id') || null;
let currentProfileData = null;

function showUserAvatar(avatarId) {
  const avatarImg = document.getElementById('auth-avatar');
  const authIcon  = document.getElementById('auth-icon');
  if (avatarId) {
    avatarImg.src = avatarPath(avatarId);
    avatarImg.classList.remove('hidden');
    authIcon.classList.add('hidden');
  } else {
    avatarImg.classList.add('hidden');
    authIcon.classList.remove('hidden');
  }
}

function selectProfile(profileId, profileData) {
  currentProfileId   = profileId;
  currentProfileData = profileData;
  if (profileId) {
    localStorage.setItem('geo-profile-id', profileId);
  } else {
    localStorage.removeItem('geo-profile-id');
  }
  const display = document.getElementById('user-display');
  if (display) display.textContent = profileData?.prenom || 'Joueur';
  if (profileData?.skin_id) applyTheme(SKIN_NAMES[profileData.skin_id] || 'sombre');
  showUserAvatar(profileData?.avatar_id || null);
}

// ViewBox state (current)
let vb = { x: 0, y: 0, w: 2000, h: 857 };

// Game state
let gameState     = 'idle';
let score         = 0;
let lives         = 0;
let currentCountry = null;
let queue         = [];
let activePaths   = new Set();
let gameStartTime = null;
let gamePoolSize  = 0;
let correctCount  = 0;

// Learning state
let selectedId    = null;
let shownCircleId = null;
let sortCol       = 'nom';
let sortDir       = 'asc';

// Drag / touch state
let isDragging      = false;
let lastDragScreen  = null;
let mouseDownPos    = null;
let lastTouchDist   = null;
let touchMoved      = false;
let lastTapTime     = 0;

// Timer state
let timerRaf     = null;
let timerStart   = null;
let timerEnabled = true;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const mapContainer   = document.getElementById('map-container');
const questionEl     = document.getElementById('question');
const messageEl      = document.getElementById('message');
const scoreEl        = document.getElementById('score');
const livesEl        = document.getElementById('lives');
const startBtn       = document.getElementById('start-btn');
const stopBtn        = document.getElementById('stop-btn');
const levelSelect    = document.getElementById('level-select');
const listBody       = document.getElementById('list-body');
const modeGameBtn    = document.getElementById('mode-game-btn');
const modeLearnBtn   = document.getElementById('mode-learn-btn');
const timerFill      = document.getElementById('timer-fill');
const timerBtn       = document.getElementById('timer-btn');
const gameoverOverlay  = document.getElementById('gameover-overlay');
const infoPanelEl      = document.getElementById('country-info-panel');
const infoLineEl       = document.getElementById('info-line');
const infoDotEl        = document.getElementById('info-dot');

let infoPanelId = null;

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  const [countriesData, svgText] = await Promise.all([
    fetch('countries.json').then(r => r.json()),
    fetch('world.svg').then(r => r.text()),
  ]);

  countries   = countriesData;
  countryById = Object.fromEntries(countries.map(c => [c.id, c]));

  mapContainer.innerHTML = svgText;

  fetch('assets/cartes/world_background/fond_carte_tresor.jpg', { method: 'HEAD' })
    .then(r => {
      const el = document.getElementById('dev-bg-img');
      if (el) el.textContent = r.ok ? `✅ ${r.status}` : `❌ ${r.status}`;
    })
    .catch(() => {
      const el = document.getElementById('dev-bg-img');
      if (el) el.textContent = '❌ fetch error';
    });

  const counterEl = document.createElement('div');
  counterEl.id = 'country-counter';
  counterEl.className = 'hidden';
  mapContainer.appendChild(counterEl);
  const svg = mapContainer.querySelector('svg');
  svg.removeAttribute('width');
  svg.removeAttribute('height');

  function registerPath(path, id) {
    if (!countryPaths[id]) countryPaths[id] = [];
    countryPaths[id].push(path);
    path.classList.add('country');
    path.dataset.countryId = id;
    path.style.removeProperty('fill');
    path.style.removeProperty('fill-opacity');
    path.addEventListener('click', onPathClick);
  }

  svg.querySelectorAll('path[id]').forEach(path => {
    const id = path.getAttribute('id');
    if (/^[A-Z]{2}$/.test(id)) registerPath(path, id);
  });

  svg.querySelectorAll('path[class]').forEach(path => {
    const cls = path.getAttribute('class');
    const id  = CLASS_TO_ISO[cls];
    if (id) registerPath(path, id);
  });

  // Construire la carte des territoires nommés pour les pays continentaux
  Object.entries(countryPaths).forEach(([iso, paths]) => {
    const country = countryById[iso];
    if (country?.type_territoire !== 'continental') return;
    pathTerritory[iso] = {};
    paths.forEach(path => {
      const terr = path.getAttribute('data-territory');
      if (!terr) return;
      if (!pathTerritory[iso][terr]) pathTerritory[iso][terr] = [];
      pathTerritory[iso][terr].push(path);
    });
  });

  drawSmallCountryMarkers(svg);
  setupMapInteraction(svg);

  modeGameBtn.addEventListener('click',  () => setMode('game'));
  modeLearnBtn.addEventListener('click', () => setMode('learning'));
  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click',  resetGameIdle);
  document.getElementById('gameover-close').addEventListener('click', () => {
    gameoverOverlay.classList.add('hidden');
    startGame();
  });
  gameoverOverlay.addEventListener('click', e => {
    if (e.target === gameoverOverlay) {
      gameoverOverlay.classList.add('hidden');
      resetGameIdle();
    }
  });

  levelSelect.addEventListener('change', e => {
    level = e.target.value;
    resetZoom();
    if (mode === 'learning') { applyLevelInactive(); renderList(); }
    if (gameState !== 'idle') resetGameIdle();
    if (mode === 'game' && gameState === 'idle') applyLevelInactive();
  });

  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sortCol = btn.dataset.col;
      sortDir = btn.dataset.dir;
      updateSortIndicators();
      renderList();
    });
  });

  // Panneau info pays — bouton "+" et bouton retour pays
  document.getElementById('cip-expand-btn').addEventListener('click', () => {
    const terrDiv  = document.getElementById('cip-territories');
    const btn      = document.getElementById('cip-expand-btn');
    const expanded = terrDiv.style.display !== 'none';
    terrDiv.style.display = expanded ? 'none' : 'flex';
    btn.textContent       = expanded ? '+' : '−';
    requestAnimationFrame(updateInfoPanel);
  });

  document.getElementById('cip-parent-btn').addEventListener('click', () => {
    if (!infoPanelId) return;
    const iso     = infoPanelId;
    const country = countryById[iso];
    if (selectedId) unhighlight(selectedId, 'learning-selected');
    selectedId = iso;
    highlight(iso, 'learning-selected');
    showInfoPanel(country);
    centerOnCountry(iso);
    selectListRow(iso);
  });

  // Help modal
  const helpOverlay = document.getElementById('help-overlay');
  const helpBtn     = document.getElementById('help-btn');
  const helpClose   = document.getElementById('help-close');
  document.getElementById('help-version').textContent =
    `${APP_VERSION.hash} · ${APP_VERSION.date} ${APP_VERSION.time}`;

  helpBtn.addEventListener('click',  () => helpOverlay.classList.remove('hidden'));
  helpClose.addEventListener('click', () => helpOverlay.classList.add('hidden'));
  helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

  // Triple-clic sur la version → mode développeur
  let devClickCount = 0, devClickTimer = null;
  document.getElementById('help-version').addEventListener('click', () => {
    devClickCount++;
    clearTimeout(devClickTimer);
    devClickTimer = setTimeout(() => { devClickCount = 0; }, 600);
    if (devClickCount >= 3) {
      devClickCount = 0;
      document.body.classList.toggle('dev-mode');
      updateDevPanel();
    }
  });

  // Scores modal
  document.getElementById('scores-btn').addEventListener('click', openScoresModal);
  document.getElementById('scores-close').addEventListener('click', () =>
    document.getElementById('scores-overlay').classList.add('hidden')
  );
  document.getElementById('scores-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('scores-overlay'))
      document.getElementById('scores-overlay').classList.add('hidden');
  });
  document.querySelectorAll('.scores-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scores-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('scores-mine').classList.toggle('hidden',   tab.dataset.tab !== 'mine');
      document.getElementById('scores-global').classList.toggle('hidden', tab.dataset.tab !== 'global');
      if (tab.dataset.tab === 'global') loadLeaderboard();
    });
  });
  document.getElementById('scores-level-select').addEventListener('change', loadLeaderboard);

  // Settings modal
  const overlay      = document.getElementById('settings-overlay');
  const settingsBtn  = document.getElementById('settings-btn');
  const settingsClose = document.getElementById('settings-close');

  settingsBtn.addEventListener('click',  () => overlay.classList.remove('hidden'));
  settingsClose.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });

  document.querySelectorAll('.theme-card').forEach(card =>
    card.addEventListener('click', () => {
      applyTheme(card.dataset.theme);
      const skinId = SKIN_IDS[card.dataset.theme];
      if (skinId && currentProfileId) window.firebaseService?.updateProfileSkin(currentProfileId, skinId).catch(console.error);
    })
  );

  applyTheme(localStorage.getItem('geo-theme') || 'sombre');
  // La pref Firestore écrasera le localStorage une fois le user connecté (voir onFirebaseAuthChanged)

  // Fullscreen
  document.getElementById('fs-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('is-fullscreen', !!document.fullscreenElement);
    updateDevPanel();
  });

  // Avatar state
  let regAvatarId     = 1;
  let profileAvatarId = 1;

  buildAvatarGrid(
    document.getElementById('reg-avatar-picker'),
    regAvatarId,
    id => { regAvatarId = id; }
  );

  // Profile settings modal (avatar)
  const profileOverlay = document.getElementById('profile-overlay');

  function openProfileSettings(profile) {
    profileAvatarId = profile.avatar_id || 1;
    document.querySelector('#profile-panel h2').textContent =
      `Avatar de ${profile.prenom}`;
    buildAvatarGrid(
      document.getElementById('profile-avatar-picker'),
      profileAvatarId,
      id => { profileAvatarId = id; }
    );
    profileOverlay.classList.remove('hidden');
  }

  document.getElementById('profile-close').addEventListener('click', () =>
    profileOverlay.classList.add('hidden')
  );
  profileOverlay.addEventListener('click', e => {
    if (e.target === profileOverlay) profileOverlay.classList.add('hidden');
  });
  document.getElementById('profile-save').addEventListener('click', async () => {
    const btn = document.getElementById('profile-save');
    btn.disabled = true;
    try {
      await window.firebaseService.updateProfileAvatar(currentProfileId, profileAvatarId);
      cachedProfiles = null;
      if (currentProfileData) currentProfileData.avatar_id = profileAvatarId;
      showUserAvatar(profileAvatarId);
      profileOverlay.classList.add('hidden');
    } catch (err) {
      console.error('Avatar save error:', err);
    } finally {
      btn.disabled = false;
    }
  });

  // Add player modal
  const addProfileOverlay = document.getElementById('add-profile-overlay');
  let addProfileAvatarId  = 1;

  document.getElementById('add-profile-btn').addEventListener('click', () => {
    supervisorOverlay.classList.add('hidden');
    addProfileAvatarId = 1;
    document.getElementById('add-profile-prenom').value = '';
    document.getElementById('add-profile-nom').value    = '';
    document.getElementById('add-profile-error').textContent = '';
    buildAvatarGrid(
      document.getElementById('add-profile-avatar-picker'),
      addProfileAvatarId,
      id => { addProfileAvatarId = id; }
    );
    addProfileOverlay.classList.remove('hidden');
  });
  document.getElementById('add-profile-close').addEventListener('click', () =>
    addProfileOverlay.classList.add('hidden')
  );
  addProfileOverlay.addEventListener('click', e => {
    if (e.target === addProfileOverlay) addProfileOverlay.classList.add('hidden');
  });
  document.getElementById('add-profile-form').addEventListener('submit', async e => {
    e.preventDefault();
    const prenom  = document.getElementById('add-profile-prenom').value.trim();
    const nom     = document.getElementById('add-profile-nom').value.trim();
    const errorEl = document.getElementById('add-profile-error');
    errorEl.textContent = '';
    if (!prenom) { errorEl.textContent = 'Le prénom est requis.'; return; }
    const btn = document.getElementById('add-profile-submit');
    btn.disabled = true;
    try {
      await window.firebaseService.createChildProfile(prenom, nom, addProfileAvatarId);
      cachedProfiles = null;
      addProfileOverlay.classList.add('hidden');
    } catch (err) {
      errorEl.textContent = 'Erreur lors de la création.';
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });


  // Auth modal
  const authOverlay  = document.getElementById('auth-overlay');
  const authBtn      = document.getElementById('auth-btn');
  const userDropdown = document.getElementById('user-dropdown');

  let cachedProfiles = null;

  async function refreshProfilesCache() {
    cachedProfiles = await window.firebaseService.getProfiles();
    return cachedProfiles;
  }

  async function renderProfilesDropdown() {
    const list = document.getElementById('profiles-list');
    list.innerHTML = '';
    const profiles = cachedProfiles ?? await refreshProfilesCache();
    const others   = [...profiles]
      .filter(p => p.id !== currentProfileId)
      .sort((a, b) => (b.is_supervisor ? 1 : 0) - (a.is_supervisor ? 1 : 0));

    // Autres joueurs (pas le joueur actif)
    others.forEach(profile => {
      const row = document.createElement('div');
      row.className = 'profile-row';
      row.innerHTML = `
        <div class="profile-avatar-wrap">
          <img src="${avatarPath(profile.avatar_id || 1)}" alt="${profile.prenom}">
          ${profile.is_supervisor ? '<span class="crown-badge">👑</span>' : ''}
        </div>
        <span class="profile-row-name">${profile.prenom}</span>
      `;
      row.addEventListener('click', () => {
        selectProfile(profile.id, profile);
        profileAvatarId = profile.avatar_id || 1;
        userDropdown.classList.add('hidden');
      });
      list.appendChild(row);
    });

    // Séparateur + modifier joueur actif
    if (others.length) {
      const sep = document.createElement('div');
      sep.className = 'dropdown-separator';
      list.appendChild(sep);
    }

    const editRow = document.createElement('div');
    editRow.className = 'profile-row';
    editRow.innerHTML = `<span class="dropdown-action-label">✏ Modifier ${currentProfileData?.prenom || 'le joueur'}</span>`;
    editRow.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      openProfileSettings(currentProfileData || {});
    });
    list.appendChild(editRow);

    // Séparateur + options superviseur (toujours visible, mdp requis)
    const sep2 = document.createElement('div');
    sep2.className = 'dropdown-separator';
    list.appendChild(sep2);

    const lockRow = document.createElement('div');
    lockRow.className = 'profile-row profile-row-lock';
    lockRow.innerHTML = `<span class="dropdown-action-label">🔒 Options superviseur</span>`;
    lockRow.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      openSupervisorOptions();
    });
    list.appendChild(lockRow);
  }

  authBtn.addEventListener('click', async () => {
    if (window.firebaseService?.getUser()) {
      if (userDropdown.classList.contains('hidden')) {
        renderProfilesDropdown();
        userDropdown.classList.remove('hidden');
        refreshProfilesCache();
      } else {
        userDropdown.classList.add('hidden');
      }
    } else {
      authOverlay.classList.remove('hidden');
    }
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('user-area').contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
  });

  // ── Modal options superviseur ───────────────────────────────
  const supervisorOverlay = document.getElementById('supervisor-overlay');

  function openSupervisorOptions() {
    document.getElementById('supervisor-auth').style.display    = '';
    document.getElementById('supervisor-options').style.display  = 'none';
    document.getElementById('supervisor-password').value = '';
    document.getElementById('supervisor-auth-error').textContent = '';
    // Masquer le bouton Google si compte email/password
    const provider = window.firebaseService.getSupervisorProvider();
    document.getElementById('supervisor-google-btn').style.display =
      provider === 'google.com' ? '' : 'none';
    supervisorOverlay.classList.remove('hidden');
  }

  document.getElementById('supervisor-close').addEventListener('click', () =>
    supervisorOverlay.classList.add('hidden')
  );
  supervisorOverlay.addEventListener('click', e => {
    if (e.target === supervisorOverlay) supervisorOverlay.classList.add('hidden');
  });

  function unlockSupervisor() {
    document.getElementById('supervisor-auth').style.display   = 'none';
    document.getElementById('supervisor-options').style.display = 'flex';
  }

  document.getElementById('supervisor-reauth-form').addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.getElementById('supervisor-password').value.trim();
    const errorEl  = document.getElementById('supervisor-auth-error');
    errorEl.textContent = '';
    if (!password) {
      errorEl.textContent = 'Entrez votre mot de passe.';
      return;
    }
    const btn = document.getElementById('supervisor-reauth-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.reauthWithPassword(password);
      unlockSupervisor();
    } catch(err) {
      errorEl.textContent =
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Mot de passe incorrect.'
          : 'Erreur d\'authentification.';
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('supervisor-google-btn').addEventListener('click', async () => {
    const btn = document.getElementById('supervisor-google-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.reauthWithGoogle();
      unlockSupervisor();
    } catch(err) {
      document.getElementById('supervisor-auth-error').textContent = 'Erreur Google.';
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    supervisorOverlay.classList.add('hidden');
    window.firebaseService.signOut().catch(console.error);
  });

  document.getElementById('auth-close').addEventListener('click', () =>
    authOverlay.classList.add('hidden')
  );
  authOverlay.addEventListener('click', e => {
    if (e.target === authOverlay) authOverlay.classList.add('hidden');
  });
  document.getElementById('play-anon').addEventListener('click', () =>
    authOverlay.classList.add('hidden')
  );

  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('auth-login').classList.toggle('hidden',    tab.dataset.tab !== 'login');
      document.getElementById('auth-register').classList.toggle('hidden', tab.dataset.tab !== 'register');
    });
  });

  document.getElementById('forgot-btn').addEventListener('click', async () => {
    const email   = document.getElementById('login-email').value.trim();
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    if (!email) {
      errorEl.textContent = 'Entrez votre email d\'abord.';
      document.getElementById('login-email').focus();
      return;
    }
    const btn = document.getElementById('forgot-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.resetPassword(email);
      errorEl.style.color = 'var(--correct)';
      errorEl.textContent = 'Email envoyé ! Vérifiez votre boîte mail.';
    } catch (err) {
      errorEl.style.color = '';
      errorEl.textContent = authErrorMsg(err);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('auth-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl  = document.getElementById('login-error');
    errorEl.textContent = '';
    errorEl.style.color = '';
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.signIn(email, password);
      authOverlay.classList.add('hidden');
    } catch (err) {
      errorEl.textContent = authErrorMsg(err);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('auth-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName  = document.getElementById('reg-lastname').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const password  = document.getElementById('reg-password').value;
    const errorEl   = document.getElementById('register-error');
    errorEl.textContent = '';
    const btn = document.getElementById('register-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.signUp(email, password, firstName, lastName, regAvatarId);
      authOverlay.classList.add('hidden');
    } catch (err) {
      errorEl.textContent = authErrorMsg(err);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('google-btn').addEventListener('click', async () => {
    const btn = document.getElementById('google-btn');
    btn.disabled = true;
    try {
      await window.firebaseService.signInWithGoogle();
      authOverlay.classList.add('hidden');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error('Google sign-in error:', err);
      }
    } finally {
      btn.disabled = false;
    }
  });

  window.onFirebaseAuthChanged = user => {
    if (user) {
      authBtn.classList.add('logged-in');
      refreshProfilesCache().then(profiles => {
        if (!profiles.length) return;
        // Retrouve le dernier profil utilisé, sinon prend le profil superviseur
        const saved    = profiles.find(p => p.id === currentProfileId);
        const supervisor = profiles.find(p => p.is_supervisor);
        const profile  = saved || supervisor || profiles[0];
        selectProfile(profile.id, profile);
        profileAvatarId = profile.avatar_id || 1;
        if (!profile.avatar_id && user.photoURL) {
          const avatarImg = document.getElementById('auth-avatar');
          const authIcon  = document.getElementById('auth-icon');
          avatarImg.src = user.photoURL;
          avatarImg.classList.remove('hidden');
          authIcon.classList.add('hidden');
        }
      }).catch(() => {});
    } else {
      authBtn.classList.remove('logged-in');
      userDropdown.classList.add('hidden');
      cachedProfiles     = null;
      currentProfileId   = null;
      currentProfileData = null;
      localStorage.removeItem('geo-profile-id');
      showUserAvatar(null);
      const display = document.getElementById('user-display');
      if (display) display.textContent = 'Me connecter';
    }
  };

  // Service worker (PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  timerBtn.addEventListener('click', () => {
    timerEnabled = !timerEnabled;
    timerBtn.classList.toggle('active', timerEnabled);
    timerBtn.title = timerEnabled ? 'Désactiver le chrono' : 'Activer le chrono';
    document.body.dataset.timer = timerEnabled ? 'on' : 'off';
    if (!timerEnabled) resetTimerGauge();
  });
  document.body.dataset.timer = 'on';

  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);
  new ResizeObserver(updateHeaderHeight).observe(document.querySelector('header'));
  resetZoom();

  // Bouton fermer (mobile)
  document.getElementById('close-btn').addEventListener('click', () => {
    window.close();
    setTimeout(() => {
      if (document.fullscreenElement) document.exitFullscreen();
    }, 300);
  });
}

// ─── ViewBox / Zoom / Pan ─────────────────────────────────────────────────────

function parseViewBox(str) {
  const [x, y, w, h] = str.split(' ').map(Number);
  return { x, y, w, h };
}

function applyViewBox() {
  const svg = mapContainer.querySelector('svg');
  if (svg) svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  updateDevPanel();
  if (infoPanelId) requestAnimationFrame(updateInfoPanel);
}

function updateHeaderHeight() {
  const h = document.querySelector('header').getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-h', Math.ceil(h) + 'px');
}

function updateDevPanel() {
  if (!document.body.classList.contains('dev-mode')) return;
  const baseW  = parseViewBox(VIEWBOXES[level] ?? VIEWBOXES.monde).w;
  const zoomPct = Math.round((baseW / vb.w) * 100);
  const w = window.innerWidth;
  const device = w <= 750 ? 'mobile' : w <= 900 ? 'tablette' : 'desktop';
  document.getElementById('dev-version').textContent = APP_VERSION.hash;
  document.getElementById('dev-zoom').textContent   = zoomPct + ' %';
  document.getElementById('dev-screen').textContent = `${w} × ${window.innerHeight}`;
  document.getElementById('dev-device').textContent = device;
  document.getElementById('dev-fs').textContent     = document.fullscreenElement ? 'true' : 'false';
  const el = document.documentElement;
  document.getElementById('dev-fs-api').textContent =
    el.requestFullscreen ? 'std' : el.webkitRequestFullscreen ? 'webkit' : 'none';
}

// ─── Learning mode info panel ─────────────────────────────────────────────────

function getNamedTerritories(iso) {
  const t = pathTerritory[iso];
  if (!t) return [];
  return Object.keys(t).filter(k => k !== 'main');
}

function showInfoPanel(country) {
  infoPanelMode      = 'country';
  infoPanelTerritory = null;
  infoPanelId        = country.id;

  document.getElementById('cip-name').textContent    = country.nom;
  document.getElementById('cip-capital').textContent = 'Capitale : ' + country.capitale;
  document.getElementById('cip-pop').textContent     = 'Population : ' + formatPop(country.population);

  // Territoires nommés → bouton "+" (liste fermée par défaut)
  const named     = getNamedTerritories(country.id);
  const expandBtn = document.getElementById('cip-expand-btn');
  const terrDiv   = document.getElementById('cip-territories');
  expandBtn.textContent  = '+';
  terrDiv.style.display  = 'none';
  terrDiv.innerHTML      = '';
  if (named.length > 0) {
    expandBtn.classList.remove('hidden');
    named.forEach(terr => {
      const btn = document.createElement('button');
      btn.className   = 'cip-territory-item';
      btn.textContent = terr;
      btn.addEventListener('click', () => selectTerritory(country.id, terr));
      terrDiv.appendChild(btn);
    });
  } else {
    expandBtn.classList.add('hidden');
  }

  document.getElementById('cip-country-view').style.display   = '';
  document.getElementById('cip-territory-view').style.display = 'none';
  infoPanelEl.classList.remove('hidden');
  requestAnimationFrame(updateInfoPanel);
}

function showTerritoryPanel(iso, territory) {
  infoPanelMode      = 'territory';
  infoPanelTerritory = territory;
  infoPanelId        = iso;

  const country = countryById[iso];
  document.getElementById('cip-territory-name').textContent = territory;
  document.getElementById('cip-parent-btn').textContent     = country.nom;

  document.getElementById('cip-country-view').style.display   = 'none';
  document.getElementById('cip-territory-view').style.display = 'flex';
  infoPanelEl.classList.remove('hidden');
  requestAnimationFrame(updateInfoPanel);
}

function hideInfoPanel() {
  infoPanelId        = null;
  infoPanelMode      = 'country';
  infoPanelTerritory = null;
  document.getElementById('cip-country-view').style.display   = '';
  document.getElementById('cip-territory-view').style.display = 'none';
  document.getElementById('cip-territories').style.display    = 'none';
  const expandBtn = document.getElementById('cip-expand-btn');
  expandBtn.textContent = '+';
  expandBtn.classList.add('hidden');
  infoPanelEl.classList.add('hidden');
  infoLineEl.setAttribute('visibility', 'hidden');
  infoDotEl.setAttribute('visibility', 'hidden');
}

function screenCenterOfPaths(paths) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  paths.forEach(p => {
    const r = p.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    minX = Math.min(minX, r.left);
    minY = Math.min(minY, r.top);
    maxX = Math.max(maxX, r.right);
    maxY = Math.max(maxY, r.bottom);
  });
  return isFinite(minX) ? { x: (minX + maxX) / 2, y: (minY + maxY) / 2 } : null;
}

function getCountryScreenCenter(id) {
  const country = countryById[id];
  // Pays continental : utiliser uniquement le path principal pour le centre
  if (country?.type_territoire === 'continental' && pathTerritory[id]?.main) {
    const c = screenCenterOfPaths(pathTerritory[id].main);
    if (c) return c;
  }
  const paths = countryPaths[id];
  if (paths && paths.length > 0) {
    const c = screenCenterOfPaths(paths);
    if (c) return c;
  }
  const circle = countryCircles[id];
  if (circle) {
    const r = circle.getBoundingClientRect();
    return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 };
  }
  return null;
}

function getTerritoryScreenCenter(iso, territory) {
  const paths = pathTerritory[iso]?.[territory];
  if (!paths || paths.length === 0) return null;
  return screenCenterOfPaths(paths);
}

function updateInfoPanel() {
  if (!infoPanelId) return;
  const cc = infoPanelMode === 'territory' && infoPanelTerritory
    ? getTerritoryScreenCenter(infoPanelId, infoPanelTerritory)
    : getCountryScreenCenter(infoPanelId);
  if (!cc) return;

  const panelW  = infoPanelEl.offsetWidth  || 180;
  const panelH  = infoPanelEl.offsetHeight || 80;
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 62;
  const M = 12;

  // Bornes utilisables : exclure le header et la liste pays
  const bounds = { left: M, right: window.innerWidth - M, top: headerH + M, bottom: window.innerHeight - M };
  const listPanel = document.getElementById('list-panel');
  if (listPanel && listPanel.offsetWidth > 0) {
    const lr = listPanel.getBoundingClientRect();
    if (lr.width > window.innerWidth * 0.7) {
      bounds.top = Math.max(bounds.top, lr.bottom + M);   // mobile : liste en haut
    } else {
      bounds.left = Math.max(bounds.left, lr.right + M);  // desktop : liste à gauche
    }
  }

  // 4 diagonales — priorité NE (haut-droite), puis NW, SE, SW
  const INV = 1 / Math.SQRT2;
  const DIST = 150;
  const dirs = [
    { dx:  INV, dy: -INV },
    { dx: -INV, dy: -INV },
    { dx:  INV, dy:  INV },
    { dx: -INV, dy:  INV },
  ];

  let best = dirs[0], bestOverflow = Infinity;
  for (const d of dirs) {
    const px = cc.x + d.dx * DIST - panelW / 2;
    const py = cc.y + d.dy * DIST - panelH / 2;
    const ov = Math.max(0, bounds.left - px)
             + Math.max(0, px + panelW - bounds.right)
             + Math.max(0, bounds.top  - py)
             + Math.max(0, py + panelH - bounds.bottom);
    if (ov < bestOverflow) { bestOverflow = ov; best = d; }
  }

  let px = cc.x + best.dx * DIST - panelW / 2;
  let py = cc.y + best.dy * DIST - panelH / 2;
  px = Math.max(bounds.left, Math.min(px, bounds.right  - panelW));
  py = Math.max(bounds.top,  Math.min(py, bounds.bottom - panelH));

  infoPanelEl.style.left = px + 'px';
  infoPanelEl.style.top  = py + 'px';

  const lx = px + panelW / 2;
  const ly = py + panelH / 2;
  infoLineEl.setAttribute('x1', cc.x); infoLineEl.setAttribute('y1', cc.y);
  infoLineEl.setAttribute('x2', lx);   infoLineEl.setAttribute('y2', ly);
  infoLineEl.setAttribute('visibility', 'visible');
  infoDotEl.setAttribute('cx', cc.x);
  infoDotEl.setAttribute('cy', cc.y);
  infoDotEl.setAttribute('visibility', 'visible');
}

function defaultZoomFactor() {
  if (window.innerWidth <= 500)  return 0.25;  // 400% mobile
  if (window.innerWidth <= 1400) return 0.5;   // 200% tablette
  return level === 'monde' ? 0.5 : 1;          // desktop : 200% monde, 100% autres
}

function resetZoom() {
  const base   = parseViewBox(VIEWBOXES[level] ?? VIEWBOXES.monde);
  const factor = defaultZoomFactor();
  const cx = base.x + base.w / 2;
  const cy = base.y + base.h / 2;
  vb = {
    x: cx - (base.w * factor) / 2,
    y: cy - (base.h * factor) / 2,
    w: base.w * factor,
    h: base.h * factor,
  };
  applyViewBox();
}

function svgPoint(clientX, clientY) {
  const svg = mapContainer.querySelector('svg');
  const pt  = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: svgP.x, y: svgP.y };
}

function setupMapInteraction(svg) {
  // Zoom with mouse wheel
  mapContainer.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    const m = svgPoint(e.clientX, e.clientY);
    const newW = vb.w * factor;
    const newH = vb.h * factor;
    if (newW < ZOOM_MIN_W) return; // max zoom in
    vb.x = m.x - (m.x - vb.x) * factor;
    vb.y = m.y - (m.y - vb.y) * factor;
    vb.w = newW;
    vb.h = newH;
    applyViewBox();
  }, { passive: false });

  // Pan with drag
  mapContainer.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    mouseDownPos   = { x: e.clientX, y: e.clientY };
    lastDragScreen = { x: e.clientX, y: e.clientY };
    document.body.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const svg = mapContainer.querySelector('svg');
    const ctm = svg.getScreenCTM();
    vb.x -= (e.clientX - lastDragScreen.x) / ctm.a;
    vb.y -= (e.clientY - lastDragScreen.y) / ctm.d;
    lastDragScreen = { x: e.clientX, y: e.clientY };
    applyViewBox();
  });

  window.addEventListener('mouseup', e => {
    if (mouseDownPos && document.body.classList.contains('dev-mode')) {
      const dx = Math.round(e.clientX - mouseDownPos.x);
      const dy = Math.round(e.clientY - mouseDownPos.y);
      const dist = Math.round(Math.hypot(dx, dy));
      const dragged = Math.abs(dx) > 5 || Math.abs(dy) > 5;
      document.getElementById('dev-drag').textContent =
        `dx=${dx} dy=${dy} dist=${dist}px ${dragged ? '→ DRAG' : '→ CLIC'}`;
    }
    isDragging = false;
    lastDragScreen = null;
    document.body.classList.remove('dragging');
  });

  // Double-click to reset zoom
  mapContainer.addEventListener('dblclick', resetZoom);

  // ── Touch: pan (1 doigt) + pinch-zoom (2 doigts) + double-tap reset ──
  mapContainer.addEventListener('touchstart', e => {
    touchMoved = false;
    if (e.touches.length === 1) {
      lastDragScreen = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const now = Date.now();
      if (now - lastTapTime < 300) resetZoom();
      lastTapTime = now;
    } else if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  mapContainer.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && lastDragScreen) {
      const dx = e.touches[0].clientX - lastDragScreen.x;
      const dy = e.touches[0].clientY - lastDragScreen.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        touchMoved = true;
        document.body.classList.add('touch-dragging');
      }
      const ctm = mapContainer.querySelector('svg').getScreenCTM();
      vb.x -= dx / ctm.a;
      vb.y -= dy / ctm.d;
      lastDragScreen = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      applyViewBox();
    } else if (e.touches.length === 2 && lastTouchDist !== null) {
      touchMoved = true;
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = lastTouchDist / newDist;
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const m  = svgPoint(cx, cy);
      const newW = vb.w * factor;
      const newH = vb.h * factor;
      if (newW >= ZOOM_MIN_W) {
        vb.x = m.x - (m.x - vb.x) * factor;
        vb.y = m.y - (m.y - vb.y) * factor;
        vb.w = newW;
        vb.h = newH;
        applyViewBox();
      }
      lastTouchDist = newDist;
    }
  }, { passive: false });

  mapContainer.addEventListener('touchend', e => {
    lastTouchDist = null;
    if (e.touches.length === 0) {
      lastDragScreen = null;
    } else if (e.touches.length === 1) {
      lastDragScreen = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    setTimeout(() => {
      touchMoved = false;
      document.body.classList.remove('touch-dragging');
    }, 50);
  });
}

// ─── Timer ───────────────────────────────────────────────────────────────────

function startTimer() {
  stopTimer();
  if (!timerEnabled) return;
  timerStart = performance.now();
  tickTimer();
}

function tickTimer() {
  const elapsed = (performance.now() - timerStart) / 1000;
  const ratio   = Math.max(0, 1 - elapsed / TIME_LIMIT);
  timerFill.style.clipPath = `inset(${(1 - ratio) * 100}% 0 0 0)`;
  if (elapsed >= TIME_LIMIT) { handleTimeout(); return; }
  timerRaf = requestAnimationFrame(tickTimer);
}

function stopTimer() {
  if (timerRaf !== null) { cancelAnimationFrame(timerRaf); timerRaf = null; }
  timerStart = null;
}

function resetTimerGauge() {
  stopTimer();
  timerFill.style.clipPath = 'inset(100% 0 0 0)';
}

function scoreForTime() {
  if (!timerEnabled || timerStart === null) return SCORE_MIN;
  const elapsed  = (performance.now() - timerStart) / 1000;
  const timeLeft = Math.max(0, TIME_LIMIT - elapsed);
  return Math.round(SCORE_MIN + (SCORE_MAX - SCORE_MIN) * (timeLeft / TIME_LIMIT) ** 2);
}

function requeueCurrent() {
  const pos = Math.max(0, queue.length - 2);
  queue.splice(pos, 0, currentCountry);
}

function handleTimeout() {
  if (gameState !== 'playing') return;
  lives--;
  requeueCurrent();
  highlight(currentCountry.id, 'correct');
  document.body.classList.add('wrong-reveal');
  setMessage('', '');
  gameState = 'feedback';
  updateUI();
  setTimeout(() => {
    document.body.classList.remove('wrong-reveal');
    unhighlight(currentCountry.id, 'correct');
    resetTimerGauge();
    if (lives <= 0) endGame(false);
    else nextQuestion();
  }, FEEDBACK_DELAY_WRONG);
}

// ─── Mode switching ───────────────────────────────────────────────────────────

function setMode(newMode) {
  mode = newMode;
  document.body.dataset.mode = mode;

  clearAllHighlights();
  hideInfoPanel();
  selectedId = null;

  if (mode === 'learning') {
    resetGameIdle();
    applyLevelInactive();
    renderList();
    setQuestionText('');
    setMessage('', '');
  } else {
    listBody.innerHTML = '';
    applyLevelInactive();
    setQuestionText('');
    setMessage('', '');
  }
}

// ─── Game mode ────────────────────────────────────────────────────────────────

function getCountriesForLevel() {
  return countries.filter(c => {
    if (!countryPaths[c.id]) return false;
    if (level === 'monde')   return true;
    if (level === 'UE')      return c.is_EU;
    return c.continents.includes(level);
  });
}

function applyLevelInactive() {
  const pool = new Set(getCountriesForLevel().map(c => c.id));
  Object.entries(countryPaths).forEach(([id, paths]) => {
    paths.forEach(p => {
      p.classList.remove('inactive');
      if (!pool.has(id)) p.classList.add('inactive');
    });
  });
}

function startGame() {
  score = 0;
  lives = LIVES_MAX;
  correctCount = 0;
  gameState = 'playing';
  document.body.classList.remove('game-over');
  gameoverOverlay.classList.add('hidden');
  selectedId = null;
  hideInfoPanel();
  hideAllCircles();

  const pool = getCountriesForLevel();
  gameStartTime = Date.now();
  gamePoolSize  = pool.length;
  updateCounter();
  queue = shuffle([...pool]);
  activePaths = new Set(pool.map(c => c.id));

  Object.entries(countryPaths).forEach(([id, paths]) => {
    const active = activePaths.has(id);
    paths.forEach(p => {
      p.classList.remove('correct', 'wrong', 'selected', 'inactive');
      if (!active) p.classList.add('inactive');
    });
  });

  document.body.classList.add('game-running');
  updateUI();
  nextQuestion();
}

function nextQuestion() {
  if (queue.length === 0) { endGame(true); return; }
  currentCountry = queue.pop();
  resetZoom();
  setQuestion(currentCountry.nom, null, 'Cliquer →');
  setMessage('', '');
  gameState = 'playing';
  startTimer();
}

function handleGameClick(clickedId) {
  if (gameState !== 'playing') return;
  if (!activePaths.has(clickedId)) return;

  if (clickedId === currentCountry.id) {
    const pts = scoreForTime();
    stopTimer();
    score += pts;
    correctCount++;
    highlight(currentCountry.id, 'correct');
    setMessage('', '');
    gameState = 'feedback';
    updateUI();
    updateCounter();
    setTimeout(() => {
      unhighlight(currentCountry.id, 'correct');
      resetTimerGauge();
      nextQuestion();
    }, FEEDBACK_DELAY_CORRECT);
  } else {
    stopTimer();
    lives--;
    requeueCurrent();
    highlight(clickedId, 'wrong');
    highlight(currentCountry.id, 'correct');
    document.body.classList.add('wrong-reveal');
    setMessage('', '');
    gameState = 'feedback';
    updateUI();
    setTimeout(() => {
      document.body.classList.remove('wrong-reveal');
      unhighlight(clickedId, 'wrong');
      unhighlight(currentCountry.id, 'correct');
      resetTimerGauge();
      if (lives <= 0) endGame(false);
      else nextQuestion();
    }, FEEDBACK_DELAY_WRONG);
  }
}

function endGame(won) {
  const timeMs = gameStartTime ? Date.now() - gameStartTime : 0;
  gameStartTime = null;

  resetTimerGauge();
  document.body.classList.remove('game-running');
  document.body.classList.add('game-over');
  gameState = 'idle';
  setQuestionText('');
  setMessage('', '');
  clearAllHighlights();
  applyLevelInactive();

  document.getElementById('gameover-title').textContent = won ? 'Félicitations !' : 'Game over';
  document.getElementById('gameover-score').textContent = score.toLocaleString('fr-FR') + ' pts';
  gameoverOverlay.classList.remove('hidden');

  window.firebaseService?.saveGame(currentProfileId, {
    levelKey: level, timerEnabled, score, timeMs, won, poolSize: gamePoolSize,
    displayName: currentProfileData?.prenom || '',
  }).catch(console.error);
}

function resetGameIdle() {
  resetTimerGauge();
  document.body.classList.remove('game-running');
  document.body.classList.remove('game-over');
  gameoverOverlay.classList.add('hidden');
  gameState = 'idle';
  setQuestionText('');
  setMessage('', '');
  clearAllHighlights();
  hideInfoPanel();
  applyLevelInactive();
  document.getElementById('country-counter').classList.add('hidden');
  updateUI();
}

// ─── Learning mode ────────────────────────────────────────────────────────────

function selectTerritory(iso, territory) {
  if (selectedId) unhighlight(selectedId, 'learning-selected');
  selectedId = iso;
  hideAllCircles();
  highlight(iso, 'learning-selected');
  showTerritoryPanel(iso, territory);
  selectListRow(iso);
  centerOnTerritory(iso, territory);
}

function centerOnTerritory(iso, territory) {
  const paths = pathTerritory[iso]?.[territory];
  if (!paths || paths.length === 0) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  paths.forEach(p => {
    try {
      const bb = p.getBBox();
      if (bb.width === 0 && bb.height === 0) return;
      minX = Math.min(minX, bb.x); minY = Math.min(minY, bb.y);
      maxX = Math.max(maxX, bb.x + bb.width); maxY = Math.max(maxY, bb.y + bb.height);
    } catch (_) {}
  });
  if (!isFinite(minX)) return;
  vb.x = (minX + maxX) / 2 - vb.w / 2;
  vb.y = (minY + maxY) / 2 - vb.h / 2;
  applyViewBox();
}

function handleLearningClick(clickedId, pathEl) {
  const country = countryById[clickedId];
  if (!country) return;

  const territory = pathEl?.getAttribute?.('data-territory');
  const isNamed   = territory && territory !== 'main'
    && country.type_territoire === 'continental';

  hideAllCircles();

  // Déterminer si c'est le même état qu'actuellement (toggle off)
  const sameState = selectedId === clickedId && (
    isNamed
      ? infoPanelMode === 'territory' && infoPanelTerritory === territory
      : infoPanelMode === 'country'
  );

  if (sameState) {
    unhighlight(selectedId, 'learning-selected');
    selectedId = null;
    hideInfoPanel();
    deselectListRow();
    return;
  }

  if (selectedId) unhighlight(selectedId, 'learning-selected');
  selectedId = clickedId;
  highlight(clickedId, 'learning-selected');

  if (isNamed) {
    showTerritoryPanel(clickedId, territory);
  } else {
    showInfoPanel(country);
  }
  selectListRow(clickedId);
}

function centerOnCountry(id) {
  const country = countryById[id];
  // Pays continental : centrer sur le path principal
  const paths = (country?.type_territoire === 'continental' && pathTerritory[id]?.main)
    ? pathTerritory[id].main
    : countryPaths[id];
  let cx, cy;

  if (paths && paths.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    paths.forEach(p => {
      try {
        const bb = p.getBBox();
        if (bb.width === 0 && bb.height === 0) return;
        minX = Math.min(minX, bb.x);
        minY = Math.min(minY, bb.y);
        maxX = Math.max(maxX, bb.x + bb.width);
        maxY = Math.max(maxY, bb.y + bb.height);
      } catch (_) {}
    });
    if (isFinite(minX)) {
      cx = (minX + maxX) / 2;
      cy = (minY + maxY) / 2;
    }
  }

  if (cx === undefined) {
    const circle = countryCircles[id];
    if (circle) {
      cx = parseFloat(circle.getAttribute('cx'));
      cy = parseFloat(circle.getAttribute('cy'));
    }
  }

  if (cx === undefined) return;
  vb.x = cx - vb.w / 2;
  vb.y = cy - vb.h / 2;
  applyViewBox();
}

function selectFromList(id) {
  hideAllCircles();
  if (selectedId) unhighlight(selectedId, 'learning-selected');

  if (selectedId === id && infoPanelMode === 'country') {
    selectedId = null;
    hideInfoPanel();
    deselectListRow();
  } else {
    selectedId = id;
    highlight(id, 'learning-selected');
    showCircle(id);
    const country = countryById[id];
    showInfoPanel(country);
    centerOnCountry(id);
    selectListRow(id);
  }
}

// ─── Unified click handler ────────────────────────────────────────────────────

function onPathClick(e) {
  if (isDragging || touchMoved) return;
  if (mouseDownPos) {
    const dx = e.clientX - mouseDownPos.x;
    const dy = e.clientY - mouseDownPos.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) return;
  }
  const pathEl = e.currentTarget;
  const id     = pathEl.dataset.countryId;
  if (mode === 'game') handleGameClick(id);
  else                 handleLearningClick(id, pathEl);
}

// ─── Small-country markers ────────────────────────────────────────────────────

function drawSmallCountryMarkers(svg) {
  countries.forEach(country => {
    if (country.superficie >= SMALL_KM2) return;
    const paths = countryPaths[country.id];
    if (!paths || paths.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    paths.forEach(p => {
      try {
        const bb = p.getBBox();
        if (bb.width === 0 && bb.height === 0) return;
        minX = Math.min(minX, bb.x);
        minY = Math.min(minY, bb.y);
        maxX = Math.max(maxX, bb.x + bb.width);
        maxY = Math.max(maxY, bb.y + bb.height);
      } catch (_) {}
    });
    if (!isFinite(minX)) return;

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const r  = Math.max(10, Math.max(maxX - minX, maxY - minY) * 2.5);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r',  String(r));
    circle.classList.add('country', 'small-marker');
    circle.dataset.countryId = country.id;
    circle.addEventListener('click', onPathClick);

    svg.appendChild(circle);
    countryCircles[country.id] = circle;
  });
}

function showCircle(id) {
  const c = countryCircles[id];
  if (c) { c.classList.add('visible'); shownCircleId = id; }
}

function hideCircle(id) {
  const c = countryCircles[id];
  if (c) c.classList.remove('visible');
  if (shownCircleId === id) shownCircleId = null;
}

function hideAllCircles() {
  if (shownCircleId) hideCircle(shownCircleId);
}

// ─── Country list (learning mode) ────────────────────────────────────────────

function renderList() {
  const pool   = getCountriesForLevel();
  const sorted = [...pool].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 :  1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  listBody.innerHTML = '';
  sorted.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = c.id;
    if (c.id === selectedId) tr.classList.add('selected');

    const tdNum = document.createElement('td');
    tdNum.textContent = i + 1;
    tdNum.className = 'col-num';

    const tdNom = document.createElement('td');
    tdNom.textContent = c.nom;

    const tdPop = document.createElement('td');
    tdPop.textContent = formatPop(c.population);
    tdPop.style.textAlign = 'right';

    const tdSup = document.createElement('td');
    tdSup.textContent = formatSup(c.superficie);
    tdSup.style.textAlign = 'right';

    tr.append(tdNum, tdNom, tdPop, tdSup);
    tr.addEventListener('click', () => selectFromList(c.id));
    listBody.appendChild(tr);
  });
}

function selectListRow(id) {
  deselectListRow();
  const row = listBody.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.classList.add('selected');
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function deselectListRow() {
  listBody.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));
}

function updateSortIndicators() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active',
      btn.dataset.col === sortCol && btn.dataset.dir === sortDir
    );
  });
}

// ─── Question display helpers ────────────────────────────────────────────────

function setQuestion(name, details, label) {
  questionEl.innerHTML = '';
  if (label) {
    const s = document.createElement('span');
    s.className = 'q-label';
    s.textContent = label;
    questionEl.appendChild(s);
  }
  if (name) {
    const s = document.createElement('span');
    s.className = 'q-name';
    s.textContent = name;
    questionEl.appendChild(s);
  }
  if (details) {
    const s = document.createElement('span');
    s.className = 'q-details';
    s.textContent = details;
    questionEl.appendChild(s);
  }
}

function setQuestionText(text) {
  questionEl.innerHTML = '';
  questionEl.textContent = text;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function highlight(id, cls) {
  (countryPaths[id] || []).forEach(p => p.classList.add(cls));
  if (cls === 'correct' && countryCircles[id]) countryCircles[id].classList.add('correct-outline');
}

function unhighlight(id, cls) {
  (countryPaths[id] || []).forEach(p => p.classList.remove(cls));
  if (cls === 'correct' && countryCircles[id]) countryCircles[id].classList.remove('correct-outline');
}

function clearAllHighlights() {
  Object.values(countryPaths).flat()
    .forEach(p => p.classList.remove('correct', 'wrong', 'selected', 'inactive', 'learning-selected'));
  Object.values(countryCircles).forEach(c => c.classList.remove('correct-outline'));
  document.body.classList.remove('wrong-reveal');
  hideAllCircles();
}

function updateUI() {
  scoreEl.textContent = score.toLocaleString('fr-FR');
  livesEl.textContent = '♥'.repeat(lives) + '♡'.repeat(Math.max(0, LIVES_MAX - lives));
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className   = type;
}

function formatPop(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace('.', ',') + ' Md';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace('.', ',') + ' M';
  return n.toLocaleString('fr-FR');
}

function formatSup(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + ' M km²';
  return n.toLocaleString('fr-FR') + ' km²';
}

// ─── Scores modal ────────────────────────────────────────────────────────────

async function openScoresModal() {
  document.getElementById('scores-overlay').classList.remove('hidden');

  const user = window.firebaseService?.getUser();
  const mineEl = document.getElementById('scores-mine');
  if (user) {
    mineEl.innerHTML = '<p class="scores-msg">Chargement…</p>';
    try {
      renderMyScores(await window.firebaseService.getMyScores(currentProfileId));
    } catch(_) {
      mineEl.innerHTML = '<p class="scores-msg">Erreur de chargement.</p>';
    }
  } else {
    mineEl.innerHTML = '<p class="scores-msg">Connectez-vous pour voir vos scores.</p>';
  }

  await loadLeaderboard();
}

async function loadLeaderboard() {
  const levelId = parseInt(document.getElementById('scores-level-select').value);
  const el = document.getElementById('scores-global-content');
  el.innerHTML = '<p class="scores-msg">Chargement…</p>';
  try {
    renderLeaderboard(await window.firebaseService.getLevelLeaderboard(levelId));
  } catch(err) {
    console.error('Leaderboard error:', err);
    el.innerHTML = '<p class="scores-msg">Erreur de chargement.</p>';
  }
}

function starsStr(n) {
  const s = Math.max(0, Math.min(3, n || 0));
  return '★'.repeat(s) + '☆'.repeat(3 - s);
}

function renderMyScores(docs) {
  const el = document.getElementById('scores-mine');
  if (!docs.length) {
    el.innerHTML = '<p class="scores-msg">Aucune partie enregistrée.</p>';
    return;
  }
  docs.sort((a, b) => a.level_id - b.level_id || a.game_type_id - b.game_type_id);

  const table = document.createElement('table');
  table.className = 'scores-table';
  table.innerHTML = '<thead><tr><th>Niveau</th><th>Mode</th><th>Score</th><th>★</th><th>Date</th></tr></thead>';
  const tbody = document.createElement('tbody');

  docs.forEach(d => {
    const tr = document.createElement('tr');
    [
      LEVEL_NAMES[d.level_id]       || '–',
      GAME_TYPE_NAMES[d.game_type_id] || '–',
      (d.score || 0).toLocaleString('fr-FR'),
      starsStr(d.stars),
      new Date(d.date).toLocaleDateString('fr-FR'),
    ].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  el.innerHTML = '';
  el.appendChild(table);
}

function renderLeaderboard(docs) {
  const el = document.getElementById('scores-global-content');
  if (!docs.length) {
    el.innerHTML = '<p class="scores-msg">Aucun score pour ce niveau.</p>';
    return;
  }
  const myUid = window.firebaseService?.getUser()?.uid;

  const table = document.createElement('table');
  table.className = 'scores-table';
  table.innerHTML = '<thead><tr><th>#</th><th>Joueur</th><th>Score</th><th>★</th><th>Mode</th><th>Date</th></tr></thead>';
  const tbody = document.createElement('tbody');

  docs.forEach((d, i) => {
    const tr = document.createElement('tr');

    [String(i + 1), d.display_name || '—'].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    [
      (d.score || 0).toLocaleString('fr-FR'),
      starsStr(d.stars),
      GAME_TYPE_NAMES[d.game_type_id] || '–',
      d.date ? new Date(d.date).toLocaleDateString('fr-FR') : '–',
    ].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  el.innerHTML = '';
  el.appendChild(table);
}

function updateCounter() {
  const el = document.getElementById('country-counter');
  el.textContent = `${correctCount} / ${gamePoolSize}`;
  el.classList.remove('hidden');
}

function avatarPath(id) {
  return `assets/avatars/avatar${String(id).padStart(2, '0')}.png`;
}

function buildAvatarGrid(container, selectedId, onSelect) {
  container.innerHTML = '';
  for (let i = 1; i <= 24; i++) {
    const div = document.createElement('div');
    div.className = 'avatar-option' + (i === selectedId ? ' selected' : '');
    div.dataset.avatarId = i;
    const img = document.createElement('img');
    img.src = avatarPath(i);
    img.alt = `Avatar ${i}`;
    div.appendChild(img);
    div.addEventListener('click', () => {
      container.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      onSelect(i);
    });
    container.appendChild(div);
  }
}

function authErrorMsg(err) {
  switch (err.code) {
    case 'auth/email-already-in-use': return 'Cet email est déjà utilisé.';
    case 'auth/invalid-email':        return 'Email invalide.';
    case 'auth/weak-password':        return 'Mot de passe trop court (min. 6 caractères).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':   return 'Email ou mot de passe incorrect.';
    default:                          return err.message;
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Start ────────────────────────────────────────────────────────────────────

const splashEl  = document.getElementById('splash');
const splashBtn = document.getElementById('splash-btn');

function dismissSplash() {
  splashEl.style.transition = 'opacity 0.4s';
  splashEl.style.opacity    = '0';
  splashEl.addEventListener('transitionend', () => { splashEl.style.display = 'none'; }, { once: true });
}

if (window.innerWidth <= 900) {
  splashBtn.addEventListener('click', () => {
    const el  = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) req.call(el).catch(err => {
      document.getElementById('dev-fs-err').textContent = err.message || String(err);
    });
    dismissSplash();
  });
} else {
  splashEl.addEventListener('animationend', () => { splashEl.style.display = 'none'; });
}

// ─── CLASSIF TOOL BRIDGE — retirer avec classification-tool.js ───────────────
window._classifBridge = {
  getCountryPaths: () => countryPaths,
  getCountryById:  () => countryById,
  centerOn(svgX, svgY) { vb.x = svgX - vb.w / 2; vb.y = svgY - vb.h / 2; applyViewBox(); },
};
// ─────────────────────────────────────────────────────────────────────────────

init();
