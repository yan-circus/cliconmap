// ═══════════════════════════════════════════════════════════════════════════
// CLASSIFICATION TOOL — outil temporaire de développement
// Pour supprimer après utilisation :
//   1. Supprimer ce fichier (classification-tool.js)
//   2. Supprimer les blocs <!-- CLASSIF TOOL --> dans index.html (x3)
//   3. Supprimer le bloc CLASSIF TOOL BRIDGE dans game.js
// ═══════════════════════════════════════════════════════════════════════════
(function () {

  // ── CSS ───────────────────────────────────────────────────────────────────
  document.head.insertAdjacentHTML('beforeend', `<style>
    #classif-btn {
      font-size: 0.72rem; padding: 3px 8px; cursor: pointer;
      background: var(--accent); color: var(--text);
      border: 1px solid var(--text-dim); border-radius: 4px; white-space: nowrap;
    }
    #classif-btn:hover { opacity: 0.8; }

    #classif-panel {
      width: 330px; min-width: 220px; height: 100%; overflow-y: auto;
      background: var(--surface); border-right: 1px solid var(--accent);
      pointer-events: auto; display: flex; flex-direction: column;
      padding: 10px 12px; box-sizing: border-box; gap: 8px;
    }
    #classif-panel.hidden { display: none; }

    #classif-head {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    #classif-counter {
      background: var(--accent); color: var(--text); padding: 1px 8px;
      border-radius: 10px; font-size: 0.75rem; white-space: nowrap; flex-shrink: 0;
    }
    #classif-country-name {
      font-weight: bold; font-size: 1rem; flex: 1;
      color: var(--text);
    }
    #classif-close {
      background: none; border: none; color: var(--text-dim);
      cursor: pointer; font-size: 1rem; padding: 2px 4px; flex-shrink: 0;
    }
    #classif-close:hover { color: var(--text); }

    #classif-type {
      width: 100%; padding: 5px; background: var(--bg); color: var(--text);
      border: 1px solid var(--accent); border-radius: 4px; font-size: 0.83rem;
    }

    #classif-table {
      width: 100%; border-collapse: collapse; font-size: 0.8rem;
    }
    #classif-table th {
      text-align: left; padding: 4px 5px;
      background: var(--accent); color: var(--text); font-size: 0.76rem;
    }
    #classif-table th:nth-child(2) { text-align: center; }
    #classif-table td {
      padding: 4px 5px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      vertical-align: middle;
    }
    #classif-table td:nth-child(2) { text-align: center; }

    .ct-path-btn {
      background: var(--accent); color: var(--text); border: none;
      border-radius: 3px; padding: 2px 6px; cursor: pointer;
      font-size: 0.74rem; white-space: nowrap; max-width: 120px;
      overflow: hidden; text-overflow: ellipsis;
    }
    .ct-path-btn:hover { opacity: 0.8; }
    .ct-path-btn.focused { background: #cc7700; color: #fff; }

    .ct-name-input {
      width: 100%; padding: 2px 5px; background: var(--bg); color: var(--text);
      border: 1px solid var(--accent); border-radius: 3px;
      font-size: 0.8rem; box-sizing: border-box;
    }
    .ct-name-input:disabled { opacity: 0.3; cursor: not-allowed; }

    #classif-validate {
      align-self: flex-end; padding: 6px 14px; background: var(--accent);
      color: var(--text); border: none; border-radius: 4px;
      cursor: pointer; font-size: 0.88rem; font-weight: bold; margin-top: 4px;
    }
    #classif-validate:hover { opacity: 0.85; }

    #classif-done-view {
      display: flex; flex-direction: column; align-items: center;
      gap: 10px; padding: 20px 10px; color: var(--text); text-align: center;
    }
    #classif-done-view p { margin: 0; }
    #classif-done-view p:first-child { font-size: 1.1rem; font-weight: bold; }
    #classif-done-count { font-size: 0.85rem; opacity: 0.7; }
    #classif-download {
      padding: 8px 14px; cursor: pointer; background: var(--accent);
      color: var(--text); border: none; border-radius: 4px; font-size: 0.85rem;
    }
    #classif-download:hover { opacity: 0.85; }

    .ct-focused-path { fill: #ff9900 !important; fill-opacity: 0.85 !important; }

    #ct-ring {
      fill: none; stroke: #ff9900; stroke-width: 2.5; pointer-events: none;
      animation: ct-pulse 1.2s ease-in-out infinite;
    }
    @keyframes ct-pulse {
      0%, 100% { stroke-opacity: 1; }
      50%       { stroke-opacity: 0.2; }
    }
  </style>`);

  // ── State ─────────────────────────────────────────────────────────────────
  const LS_KEY    = 'cliconmap_classif_v1';
  let multiList   = [];
  let currentIdx  = 0;
  let decisions   = {};
  let focusedPath = null;
  let ringEl      = null;
  let initialized = false;

  // ── Helpers ───────────────────────────────────────────────────────────────
  function pathLabel(pathEl, i) {
    const id  = pathEl.getAttribute('id');
    const cls = pathEl.getAttribute('class');
    if (id && /^[A-Z]{2}$/.test(id)) return `Chemin ${i + 1} (id: ${id})`;
    if (cls) return `Chemin ${i + 1} (${cls.length > 22 ? cls.slice(0, 20) + '…' : cls})`;
    return `Chemin ${i + 1}`;
  }

  function saveProgress() {
    localStorage.setItem(LS_KEY, JSON.stringify({ currentIdx, decisions }));
  }

  function loadProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (d.currentIdx !== undefined) currentIdx = d.currentIdx;
      if (d.decisions)                decisions   = d.decisions;
    } catch (_) {}
  }

  // ── Focus / ring ──────────────────────────────────────────────────────────
  function clearFocus() {
    if (focusedPath) {
      focusedPath.classList.remove('ct-focused-path');
      focusedPath = null;
    }
    document.querySelectorAll('.ct-path-btn.focused')
      .forEach(b => b.classList.remove('focused'));
    if (ringEl) ringEl.setAttribute('visibility', 'hidden');
  }

  function focusPath(pathEl, btn) {
    clearFocus();
    pathEl.classList.add('ct-focused-path');
    btn.classList.add('focused');
    focusedPath = pathEl;

    try {
      const bb = pathEl.getBBox();
      if (bb.width > 0 || bb.height > 0) {
        window._classifBridge.centerOn(bb.x + bb.width / 2, bb.y + bb.height / 2);
      }
    } catch (_) {}

    // Double rAF : laisse le navigateur repeindre après le changement de viewBox
    requestAnimationFrame(() => requestAnimationFrame(drawRing));
  }

  function drawRing() {
    if (!focusedPath || !ringEl) return;
    const rect    = focusedPath.getBoundingClientRect();
    const overlay = document.getElementById('map-overlay');
    if (!overlay || (rect.width === 0 && rect.height === 0)) {
      ringEl.setAttribute('visibility', 'hidden');
      return;
    }
    const or = overlay.getBoundingClientRect();
    const cx = rect.left - or.left + rect.width  / 2;
    const cy = rect.top  - or.top  + rect.height / 2;
    const r  = Math.max(Math.hypot(rect.width, rect.height) / 2 + 18, 20);
    ringEl.setAttribute('cx', cx);
    ringEl.setAttribute('cy', cy);
    ringEl.setAttribute('r',  r);
    ringEl.setAttribute('visibility', 'visible');
  }

  // ── Sync UI ───────────────────────────────────────────────────────────────
  function syncUI() {
    const isArchipel = document.getElementById('classif-type').value === 'archipel';
    document.querySelectorAll('#classif-tbody tr').forEach(tr => {
      const radio = tr.querySelector('input[type=radio]');
      const input = tr.querySelector('.ct-name-input');
      if (!radio || !input) return;
      radio.disabled = isArchipel;
      if (isArchipel) {
        input.disabled     = true;
        input.placeholder  = '';
      } else {
        input.disabled     = radio.checked;
        input.placeholder  = radio.checked ? '— territoire principal —' : 'Nom du territoire';
      }
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function renderCurrent() {
    clearFocus();
    const mainView = document.getElementById('classif-main-view');
    const doneView = document.getElementById('classif-done-view');

    if (currentIdx >= multiList.length) {
      mainView.style.display = 'none';
      doneView.style.display = '';
      document.getElementById('classif-done-count').textContent =
        `${Object.keys(decisions).length} pays classifiés`;
      return;
    }

    mainView.style.display = '';
    doneView.style.display = 'none';

    const { id, paths, country } = multiList[currentIdx];
    const saved = decisions[id];

    document.getElementById('classif-counter').textContent =
      `${currentIdx + 1} / ${multiList.length}`;
    document.getElementById('classif-country-name').textContent = country.nom;
    document.getElementById('classif-type').value = saved?.type_territoire || 'continental';

    const tbody = document.getElementById('classif-tbody');
    tbody.innerHTML = '';

    paths.forEach((pathEl, i) => {
      const savedPath = saved?.paths?.find(p => p.index === i);
      const isMain    = saved ? (savedPath?.main === true) : (i === 0);

      const tr      = document.createElement('tr');
      const tdBtn   = document.createElement('td');
      const btn     = document.createElement('button');
      btn.className   = 'ct-path-btn';
      btn.textContent = pathLabel(pathEl, i);
      btn.title       = pathEl.getAttribute('class') || pathEl.getAttribute('id') || '';
      btn.addEventListener('click', () => focusPath(pathEl, btn));
      tdBtn.appendChild(btn);

      const tdRadio   = document.createElement('td');
      const radio     = document.createElement('input');
      radio.type      = 'radio';
      radio.name      = `ct-main-${id}`;
      radio.value     = i;
      radio.checked   = isMain;
      radio.addEventListener('change', syncUI);
      tdRadio.appendChild(radio);

      const tdInput   = document.createElement('td');
      const input     = document.createElement('input');
      input.type      = 'text';
      input.className = 'ct-name-input';
      input.value     = savedPath?.label || '';
      tdInput.appendChild(input);

      tr.append(tdBtn, tdRadio, tdInput);
      tbody.appendChild(tr);
    });

    syncUI();
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  function validate() {
    const { id } = multiList[currentIdx];
    const type   = document.getElementById('classif-type').value;
    const decision = { type_territoire: type };

    if (type === 'continental') {
      decision.paths = [...document.querySelectorAll('#classif-tbody tr')].map((tr, i) => {
        const radio  = tr.querySelector('input[type=radio]');
        const input  = tr.querySelector('.ct-name-input');
        const isMain = radio?.checked || false;
        return {
          index: i,
          main:  isMain,
          label: isMain ? null : (input?.value.trim() || null),
        };
      });
    }

    decisions[id] = decision;
    currentIdx++;
    saveProgress();
    renderCurrent();
  }

  // ── Export ────────────────────────────────────────────────────────────────
  function downloadJSON() {
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(
      new Blob([JSON.stringify(decisions, null, 2)], { type: 'application/json' })
    );
    a.download = 'data4classification.json';
    a.click();
  }

  // ── Open / close ──────────────────────────────────────────────────────────
  function open() {
    if (!initialized) {
      const bridge = window._classifBridge;
      if (!bridge) { alert('Bridge non disponible — page non chargée ?'); return; }

      const cp = bridge.getCountryPaths();
      const cb = bridge.getCountryById();

      multiList = Object.entries(cp)
        .filter(([, ps]) => ps.length > 1)
        .map(([id, paths]) => ({ id, paths, country: cb[id] }))
        .filter(x => x.country)
        .sort((a, b) => a.country.nom.localeCompare(b.country.nom, 'fr'));

      loadProgress();
      currentIdx = Math.min(currentIdx, multiList.length);

      // Anneau SVG sur l'overlay
      const overlay = document.getElementById('map-overlay');
      if (overlay) {
        ringEl = document.getElementById('ct-ring');
        if (!ringEl) {
          ringEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          ringEl.id = 'ct-ring';
          ringEl.setAttribute('visibility', 'hidden');
          overlay.appendChild(ringEl);
        }
      }

      document.getElementById('classif-type')
        .addEventListener('change', syncUI);
      document.getElementById('classif-validate')
        .addEventListener('click', validate);
      document.getElementById('classif-close')
        .addEventListener('click', close);
      document.getElementById('classif-download')
        .addEventListener('click', downloadJSON);

      initialized = true;
    }

    document.getElementById('list-panel').style.display = 'none';
    document.getElementById('classif-panel').classList.remove('hidden');
    renderCurrent();
  }

  function close() {
    clearFocus();
    document.getElementById('classif-panel').classList.add('hidden');
    document.getElementById('list-panel').style.display = '';
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  document.getElementById('classif-btn').addEventListener('click', open);

})();
