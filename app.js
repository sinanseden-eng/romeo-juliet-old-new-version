(() => {
  'use strict';

  const data = window.PLAY_DATA;
  const notes = window.DEVICE_NOTES || [];
  const glossary = window.DEVICE_GLOSSARY || [];
  const passageRoot = document.getElementById('passages');
  const sceneSelect = document.getElementById('sceneSelect');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const sceneTitle = document.getElementById('currentSceneTitle');
  const sceneKicker = document.getElementById('sceneKicker');
  const passageCount = document.getElementById('passageCount');
  const emptyState = document.getElementById('emptyState');
  const endNote = document.getElementById('endNote');
  const inspector = document.getElementById('inspector');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorContent = document.getElementById('inspectorContent');
  const notesTab = document.getElementById('notesTab');
  const glossaryTab = document.getElementById('glossaryTab');
  const mobileNotesButton = document.getElementById('mobileNotesButton');

  const state = {
    scene: 'Prologue',
    mode: 'compare',
    search: '',
    activeTab: 'notes',
    selected: null,
    fontScale: 1
  };

  const norm = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function sceneLabel(scene) {
    return scene === 'Prologue' ? 'Prologue' : scene.replace(', ', ' · ');
  }

  function setupScenes() {
    sceneSelect.textContent = '';
    const prologue = document.createElement('option');
    prologue.value = 'Prologue';
    prologue.textContent = 'Prologue';
    sceneSelect.appendChild(prologue);
    for (let act = 1; act <= 5; act += 1) {
      const group = document.createElement('optgroup');
      group.label = `Act ${act}`;
      for (const scene of data.scenes.filter((item) => item.startsWith(`Act ${act},`))) {
        const option = document.createElement('option');
        option.value = scene;
        option.textContent = scene.replace(`Act ${act}, `, '');
        group.appendChild(option);
      }
      if (group.children.length) sceneSelect.appendChild(group);
    }
    sceneSelect.value = state.scene;
  }

  function isTagged(text) {
    const haystack = norm(text);
    if (!haystack) return false;
    return notes.some((note) => note.matches.some((match) => {
      const needle = norm(match);
      return needle && haystack.includes(needle);
    }));
  }

  function passageText(passage) {
    return [...(passage.original || []), passage.modern || ''].join(' ');
  }

  function renderOriginalCell(passage) {
    const cell = make('div', 'passage-cell original-cell');
    const header = make('div', 'passage-label-row');
    const label = make('div', 'speaker-label', passage.kind === 'stage' ? 'Stage direction' : (passage.speaker || 'Speech'));
    header.appendChild(label);
    const selectWhole = make('button', 'select-passage', passage.kind === 'stage' ? 'Select cue' : 'Select speech');
    selectWhole.type = 'button';
    selectWhole.dataset.passage = passage.id;
    selectWhole.dataset.line = '-1';
    selectWhole.dataset.version = 'original';
    selectWhole.setAttribute('aria-label', `Select the whole ${passage.kind === 'stage' ? 'stage direction' : 'speech'} by ${passage.speaker || 'the speaker'}`);
    header.appendChild(selectWhole);
    cell.appendChild(header);
    const lines = make('div', 'speech-lines');
    if (!(passage.original || []).length) {
      lines.appendChild(make('p', 'reflow-note', passage.kind === 'stage' ? 'This stage cue appears in the modern column of the supplied edition.' : 'The supplied original groups this speech with a nearby passage.'));
    }
    (passage.original || []).forEach((line, index) => {
      const button = make('button', `verse-line${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(line) ? ' is-annotated' : ''}`);
      button.type = 'button';
      button.dataset.passage = passage.id;
      button.dataset.line = String(index);
      button.dataset.version = 'original';
      button.textContent = line;
      button.setAttribute('aria-label', `Select original text: ${line}`);
      lines.appendChild(button);
    });
    cell.appendChild(lines);
    return cell;
  }

  function renderModernCell(passage) {
    const cell = make('div', 'passage-cell modern-cell');
    const label = make('div', 'speaker-label', passage.kind === 'stage' ? 'Stage direction · modern' : 'Modern English');
    cell.appendChild(label);
    if (passage.modern) {
      const button = make('button', `modern-text${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(passage.modern) ? ' is-annotated' : ''}`);
      button.type = 'button';
      button.dataset.passage = passage.id;
      button.dataset.line = '-1';
      button.dataset.version = 'modern';
      button.textContent = passage.modern;
      button.setAttribute('aria-label', `Select modern English passage: ${passage.modern}`);
      cell.appendChild(button);
    } else {
      const note = make('p', 'reflow-note', 'The supplied modern column groups this speech with a nearby passage; its wording appears in sequence elsewhere.');
      cell.appendChild(note);
    }
    return cell;
  }

  function renderPassage(passage) {
    const card = make('article', `passage-card${state.mode === 'original' ? ' mode-original' : ''}${state.mode === 'modern' ? ' mode-modern' : ''}`);
    card.dataset.id = passage.id;
    if (state.selected && state.selected.passageId === passage.id) card.classList.add('is-selected');

    if (passage.kind === 'stage') {
      const kind = make('div', 'passage-kind', 'Stage direction');
      kind.style.gridColumn = '1 / -1';
      card.appendChild(kind);
    }
    card.appendChild(renderOriginalCell(passage));
    card.appendChild(renderModernCell(passage));

    if (state.selected && state.selected.passageId === passage.id) {
      const activeSelector = `.verse-line[data-line="${state.selected.lineIndex}"][data-version="${state.selected.version}"]`;
      const active = card.querySelector(activeSelector) || card.querySelector('.modern-text');
      if (active) active.classList.add('is-active');
    }
    return card;
  }

  function getVisiblePassages() {
    const query = norm(state.search);
    const matches = !query
      ? data.passages.filter((passage) => passage.scene === state.scene)
      : data.passages.filter((passage) => norm(`${passage.scene} ${passage.speaker} ${passageText(passage)}`).includes(query));
    if (state.mode === 'original') return matches.filter((passage) => (passage.original || []).some((line) => line.trim()));
    if (state.mode === 'modern') return matches.filter((passage) => passage.modern && passage.modern.trim());
    return matches;
  }

  function renderReader() {
    const visible = getVisiblePassages();
    const query = state.search.trim();
    const limited = query ? visible.slice(0, 90) : visible;
    passageRoot.textContent = '';
    const fragment = document.createDocumentFragment();
    limited.forEach((passage) => fragment.appendChild(renderPassage(passage)));
    passageRoot.appendChild(fragment);

    const noResults = visible.length === 0;
    emptyState.hidden = !noResults;
    passageRoot.hidden = noResults;
    endNote.hidden = noResults || Boolean(query);
    clearSearch.hidden = !query;

    if (query) {
      sceneTitle.textContent = 'Search results';
      sceneKicker.textContent = 'Matches across the play';
      passageCount.textContent = `${visible.length}${visible.length > 90 ? ' · showing first 90' : ''} ${visible.length === 1 ? 'passage' : 'passages'}`;
    } else {
      sceneTitle.textContent = state.scene;
      sceneKicker.textContent = state.scene === 'Prologue' ? 'Before the first scene' : `A passage from ${sceneLabel(state.scene)}`;
      passageCount.textContent = `${visible.length} ${visible.length === 1 ? 'selection' : 'selections'}`;
    }
    const sceneIndex = data.scenes.indexOf(state.scene);
    document.getElementById('prevScene').disabled = Boolean(query) || sceneIndex <= 0;
    document.getElementById('nextScene').disabled = Boolean(query) || sceneIndex < 0 || sceneIndex >= data.scenes.length - 1;
  }

  function notesFor(text) {
    const haystack = norm(text);
    return notes.filter((note) => note.matches.some((match) => {
      const needle = norm(match);
      return needle && haystack.includes(needle);
    }));
  }

  function renderDeviceNote(note) {
    const card = make('article', 'device-note');
    card.appendChild(make('p', 'device-type', note.type));
    card.appendChild(make('h3', '', note.title));
    card.appendChild(make('p', '', note.explanation));
    const effect = make('p', 'effect');
    const strong = make('strong', '', 'Why it matters: ');
    effect.append(strong, document.createTextNode(note.effect));
    card.appendChild(effect);
    return card;
  }

  function renderSelection(selection) {
    state.activeTab = 'notes';
    updateTabs();
    const passage = data.passages.find((item) => item.id === selection.passageId);
    if (!passage) return;
    inspectorTitle.textContent = selection.version === 'modern' ? 'Modern-text note' : 'Line note';
    inspectorContent.textContent = '';

    const kicker = make('p', 'selection-kicker');
    kicker.appendChild(document.createTextNode(selection.lineIndex < 0 ? 'Passage selected' : 'Line selected'));
    const speaker = passage.speaker || (passage.kind === 'stage' ? 'Stage direction' : '');
    if (speaker) kicker.appendChild(make('span', 'selection-speaker', speaker));
    inspectorContent.appendChild(kicker);

    const quote = make('blockquote', 'selected-quote', selection.text);
    inspectorContent.appendChild(quote);
    const paired = selection.version === 'modern'
      ? (passage.original || []).join(' ')
      : passage.modern;
    if (paired) inspectorContent.appendChild(make('p', 'selected-modern', paired));

    const direct = notesFor(selection.text);
    const related = notesFor(passageText(passage));
    const chosen = direct.length ? direct : related;
    if (chosen.length) {
      if (!direct.length && selection.lineIndex >= 0) inspectorContent.appendChild(make('p', 'related-label', 'Related in this speech'));
      chosen.slice(0, 5).forEach((note) => inspectorContent.appendChild(renderDeviceNote(note)));
      if (chosen.length > 5) inspectorContent.appendChild(make('p', 'reflow-note', `${chosen.length - 5} more device notes are tagged in this passage.`));
    } else {
      const noNote = make('div', 'no-note');
      noNote.appendChild(make('strong', '', 'A line to read closely'));
      noNote.appendChild(make('p', '', 'No specific device is tagged here yet. Notice the rhythm, the picture created by the words, or any contrast between what the character says and what the audience knows. The device guide can help you name what you find.'));
      inspectorContent.appendChild(noNote);
    }
    if (window.matchMedia('(max-width: 820px)').matches) inspector.classList.add('is-open');
  }

  function renderGlossary(filter = '') {
    inspectorTitle.textContent = 'Poetic & literary devices';
    inspectorContent.textContent = '';
    const input = make('input', 'glossary-search');
    input.type = 'search';
    input.placeholder = 'Find a device…';
    input.setAttribute('aria-label', 'Search the device guide');
    input.value = filter;
    inspectorContent.appendChild(input);
    const list = make('div', 'glossary-list');
    const filtered = glossary.filter(([term, definition, example]) => norm(`${term} ${definition} ${example}`).includes(norm(filter)));
    for (const [term, definition, example] of filtered) {
      const item = make('details', 'glossary-item');
      const summary = make('summary', '', term);
      item.appendChild(summary);
      item.appendChild(make('p', '', definition));
      item.appendChild(make('p', 'example', example));
      list.appendChild(item);
    }
    if (!filtered.length) list.appendChild(make('p', 'reflow-note', 'No device found. Try a shorter search.'));
    inspectorContent.appendChild(list);
    input.addEventListener('input', () => renderGlossary(input.value));
    input.addEventListener('input', () => {
      const replacement = inspectorContent.querySelector('.glossary-search');
      if (replacement) { replacement.focus(); replacement.setSelectionRange(replacement.value.length, replacement.value.length); }
    }, { once: true });
  }

  function updateTabs() {
    const glossaryActive = state.activeTab === 'glossary';
    notesTab.classList.toggle('is-active', !glossaryActive);
    glossaryTab.classList.toggle('is-active', glossaryActive);
    notesTab.setAttribute('aria-selected', String(!glossaryActive));
    glossaryTab.setAttribute('aria-selected', String(glossaryActive));
  }

  function showGlossary() {
    state.activeTab = 'glossary';
    updateTabs();
    renderGlossary();
    if (window.matchMedia('(max-width: 820px)').matches) inspector.classList.add('is-open');
  }

  function selectPassage(passage, version = 'original') {
    const text = [...(passage.original || []), passage.modern || ''].filter(Boolean).join(' ').trim();
    state.selected = { passageId: passage.id, lineIndex: -1, version, text };
    renderReader();
    renderSelection(state.selected);
  }

  function handleTextClick(event) {
    const button = event.target.closest('[data-passage]');
    if (!button) return;
    const passage = data.passages.find((item) => item.id === button.dataset.passage);
    if (!passage) return;
    const version = button.dataset.version || 'original';
    const lineIndex = Number(button.dataset.line);
    const text = version === 'modern'
      ? passage.modern
      : (lineIndex < 0 ? (passage.original || []).join(' ') : passage.original[lineIndex]);
    state.selected = { passageId: passage.id, lineIndex, version, text };
    renderReader();
    renderSelection(state.selected);
  }

  setupScenes();
  renderReader();

  passageRoot.addEventListener('click', handleTextClick);
  sceneSelect.addEventListener('change', () => {
    state.scene = sceneSelect.value;
    state.search = '';
    searchInput.value = '';
    state.selected = null;
    renderReader();
  });
  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    renderReader();
  });
  clearSearch.addEventListener('click', () => {
    state.search = '';
    searchInput.value = '';
    searchInput.focus();
    renderReader();
  });
  document.querySelectorAll('.mode-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll('.mode-button').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderReader();
    });
  });
  document.getElementById('prevScene').addEventListener('click', () => {
    const index = data.scenes.indexOf(state.scene);
    if (index > 0) { state.scene = data.scenes[index - 1]; sceneSelect.value = state.scene; renderReader(); }
  });
  document.getElementById('nextScene').addEventListener('click', () => {
    const index = data.scenes.indexOf(state.scene);
    if (index >= 0 && index < data.scenes.length - 1) { state.scene = data.scenes[index + 1]; sceneSelect.value = state.scene; renderReader(); }
  });
  document.getElementById('smallerText').addEventListener('click', () => {
    state.fontScale = Math.max(.86, +(state.fontScale - .08).toFixed(2));
    document.documentElement.style.setProperty('--reading-size', `${state.fontScale}rem`);
  });
  document.getElementById('largerText').addEventListener('click', () => {
    state.fontScale = Math.min(1.3, +(state.fontScale + .08).toFixed(2));
    document.documentElement.style.setProperty('--reading-size', `${state.fontScale}rem`);
  });
  notesTab.addEventListener('click', () => {
    state.activeTab = 'notes'; updateTabs();
    if (state.selected) renderSelection(state.selected);
    else {
      inspectorTitle.textContent = 'Explore the language';
      inspectorContent.innerHTML = '<div class="welcome-note"><div class="note-symbol" aria-hidden="true">✦</div><h3>Pick a line to begin</h3><p>Select any original line or modern passage. Notes will connect the language to poetic rhythm, imagery, wordplay, and dramatic devices.</p><button type="button" class="text-link" id="browseDevices">Browse the device guide <span>→</span></button></div><div class="quick-tip"><span class="tip-icon" aria-hidden="true">i</span><p><strong>Reading tip</strong><br>Use <b>Compare</b> to notice how the modern version carries the idea across in clearer language.</p></div>';
      document.getElementById('browseDevices').addEventListener('click', showGlossary);
    }
  });
  glossaryTab.addEventListener('click', showGlossary);
  document.getElementById('browseDevices').addEventListener('click', showGlossary);
  document.getElementById('openGlossaryTop').addEventListener('click', () => {
    showGlossary();
    document.getElementById('reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('closeInspector').addEventListener('click', () => inspector.classList.remove('is-open'));
  mobileNotesButton.addEventListener('click', () => {
    inspector.classList.add('is-open');
    inspector.scrollTop = 0;
  });
})();
