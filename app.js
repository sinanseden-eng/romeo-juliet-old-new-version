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
    fontScale: 1,
    selectedWord: null
  };

  const ANNOTATION_KEY = 'romeo-juliet-teacher-annotations-v1';
  const HIGHLIGHT_COLORS = ['yellow', 'rose', 'blue', 'green'];
  const wordMeanings = {
    art: 'are', aye: 'yes', anon: 'soon; in a moment', aught: 'anything',
    beseech: 'ask or beg urgently', betwixt: 'between', churl: 'a rude or mean person',
    dost: 'do', doth: 'does', ere: 'before', fain: 'gladly; willingly',
    forsworn: 'having broken a promise or oath', fie: 'an expression of disgust or disapproval',
    hither: 'to this place', hence: 'from here; away', hast: 'have', hath: 'has',
    hie: 'go quickly', kin: 'family or relatives', knave: 'a dishonest man',
    marry: 'indeed; certainly (an old exclamation)', methinks: 'it seems to me',
    nay: 'no', naught: 'nothing', oft: 'often', prithee: 'please; I ask you',
    shalt: 'shall', thence: 'from that place', thee: 'you (object form)',
    thine: 'yours; your before a vowel', thou: 'you (subject form)',
    thy: 'your', tis: 'it is', twas: 'it was', wherefore: 'why',
    whence: 'from where', wilt: 'will', withal: 'with it; in addition',
    wouldst: 'would', wert: 'were', artless: 'innocent or natural; without deceit',
    bawd: 'a person who arranges sexual encounters', chamber: 'a private room or bedroom',
    civil: 'relating to citizens; also courteous', counsel: 'advice, or a private plan',
    discourse: 'conversation or formal speech', enmity: 'deep hostility',
    fair: 'beautiful; also just or favourable', fortune: 'fate or luck',
    gall: 'bitterness or resentment', grace: 'virtue, favour, or divine blessing',
    humour: 'mood or temperament', issue: 'a result; also a child or descendant',
    maid: 'an unmarried young woman', maiden: 'an unmarried young woman; virginal',
    misadventure: 'an unlucky accident', Montague: 'a member of Romeo’s family',
    Capulet: 'a member of Juliet’s family', shrift: 'confession and forgiveness of sins',
    sirrah: 'a form of address to a man of lower rank, often sharply',
    soft: 'wait; be quiet (when used as an exclamation)', suit: 'a request or courtship',
    temper: 'state of mind; also to soften or moderate', villain: 'a wicked person; historically, a low-born servant',
    wanton: 'playful or uncontrolled; sometimes sexually improper',
    wench: 'a young woman; historically informal and sometimes insulting',
    whereat: 'at which', whereon: 'on which', whereupon: 'after which; as a result',
    yonder: 'over there', youth: 'a young person; young age'
  };

  function loadAnnotations() {
    try { return JSON.parse(localStorage.getItem(ANNOTATION_KEY) || '{}'); }
    catch (_) { return {}; }
  }

  let annotations = loadAnnotations();

  function annotationId(passageId, version, lineIndex) {
    return `${passageId}::${version}::${lineIndex}`;
  }

  function annotationFor(passageId, version, lineIndex) {
    return annotations[annotationId(passageId, version, lineIndex)] || {};
  }

  function saveAnnotations() {
    localStorage.setItem(ANNOTATION_KEY, JSON.stringify(annotations));
  }

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

  function appendClickableWords(button, text) {
    const parts = String(text).split(/([A-Za-z]+(?:['’][A-Za-z]+)?)/g);
    parts.forEach((part) => {
      if (!/^[A-Za-z]+(?:['’][A-Za-z]+)?$/.test(part)) {
        button.appendChild(document.createTextNode(part));
        return;
      }
      const word = make('span', 'word-token', part);
      word.dataset.word = part;
      word.setAttribute('role', 'button');
      word.setAttribute('tabindex', '0');
      word.setAttribute('aria-label', `Define ${part}`);
      button.appendChild(word);
    });
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

  function modernLines(passage) {
    const text = String(passage.modern || '').trim();
    if (!text) return [];
    const sentences = text.match(/[^.!?]+(?:[.!?]+["'’”]?|$)/g) || [text];
    return sentences.map((line) => line.trim()).filter(Boolean);
  }

  function alignmentWeight(text) {
    const words = String(text || '').match(/[A-Za-zÀ-ž'’]+/g) || [];
    return Math.max(1, words.length);
  }

  function weightedRanges(items) {
    const weights = items.map(alignmentWeight);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    return weights.map((weight) => {
      const range = { start: cursor / total, end: (cursor + weight) / total };
      cursor += weight;
      return range;
    });
  }

  function overlapIndexes(sourceItems, sourceIndex, targetItems) {
    if (sourceIndex < 0 || !sourceItems.length || !targetItems.length) return [];
    const source = weightedRanges(sourceItems)[sourceIndex];
    const scored = weightedRanges(targetItems).map((target, index) => {
      const overlap = Math.max(0, Math.min(source.end, target.end) - Math.max(source.start, target.start));
      return {
        index,
        overlap,
        targetCoverage: overlap / (target.end - target.start),
        sourceCoverage: overlap / (source.end - source.start)
      };
    }).filter((item) => item.overlap > 0.0001);
    const strong = scored.filter((item) => item.targetCoverage >= 0.58 || item.sourceCoverage >= 0.72);
    if (strong.length) return strong.map((item) => item.index);
    const best = Math.max(...scored.map((item) => item.overlap), 0);
    return scored.filter((item) => Math.abs(item.overlap - best) < 0.0001).map((item) => item.index);
  }

  function correspondingModernIndexes(passage, originalIndex) {
    return overlapIndexes(passage.original || [], originalIndex, modernLines(passage));
  }

  function correspondingOriginalIndexes(passage, modernIndex) {
    return overlapIndexes(modernLines(passage), modernIndex, passage.original || []);
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
      const saved = annotationFor(passage.id, 'original', index);
      const button = make('div', `verse-line${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(line) ? ' is-annotated' : ''}${saved.color ? ` teacher-highlight highlight-${saved.color}` : ''}${saved.note ? ' has-teacher-note' : ''}`);
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      button.dataset.passage = passage.id;
      button.dataset.line = String(index);
      button.dataset.version = 'original';
      appendClickableWords(button, line);
      button.setAttribute('aria-label', `Select original text: ${line}`);
      lines.appendChild(button);
    });
    cell.appendChild(lines);
    return cell;
  }

  function renderModernCell(passage) {
    const cell = make('div', 'passage-cell modern-cell');
    const header = make('div', 'passage-label-row');
    const label = make('div', 'speaker-label', passage.kind === 'stage' ? 'Stage direction · modern' : 'Modern English');
    header.appendChild(label);
    if (passage.modern) {
      const selectWhole = make('button', 'select-passage', passage.kind === 'stage' ? 'Select cue' : 'Select passage');
      selectWhole.type = 'button';
      selectWhole.dataset.passage = passage.id;
      selectWhole.dataset.line = '-1';
      selectWhole.dataset.version = 'modern';
      selectWhole.setAttribute('aria-label', 'Select the complete modern-English passage');
      header.appendChild(selectWhole);
    }
    cell.appendChild(header);
    const segments = modernLines(passage);
    if (segments.length) {
      const lines = make('div', 'speech-lines modern-lines');
      segments.forEach((line, index) => {
        const saved = annotationFor(passage.id, 'modern', index);
        const button = make('button', `modern-text${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(line) ? ' is-annotated' : ''}${saved.color ? ` teacher-highlight highlight-${saved.color}` : ''}${saved.note ? ' has-teacher-note' : ''}`);
        button.type = 'button';
        button.dataset.passage = passage.id;
        button.dataset.line = String(index);
        button.dataset.version = 'modern';
        button.textContent = line;
        button.setAttribute('aria-label', `Select modern English line: ${line}`);
        lines.appendChild(button);
      });
      cell.appendChild(lines);
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
      const selected = state.selected;
      const selectedClass = selected.version === 'modern' ? '.modern-text' : '.verse-line';
      const active = card.querySelector(`${selectedClass}[data-line="${selected.lineIndex}"][data-version="${selected.version}"]`);
      if (active) active.classList.add('is-active');

      if (selected.lineIndex >= 0 && selected.version === 'original') {
        correspondingModernIndexes(passage, selected.lineIndex).forEach((index) => {
          const counterpart = card.querySelector(`.modern-text[data-line="${index}"]`);
          if (counterpart) {
            counterpart.classList.add('is-corresponding');
            counterpart.title = 'Corresponding Modern English';
          }
        });
      }
      if (selected.lineIndex >= 0 && selected.version === 'modern') {
        correspondingOriginalIndexes(passage, selected.lineIndex).forEach((index) => {
          const counterpart = card.querySelector(`.verse-line[data-line="${index}"]`);
          if (counterpart) {
            counterpart.classList.add('is-corresponding');
            counterpart.title = 'Corresponding Shakespearean line';
          }
        });
      }
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

  function renderTeacherTools(selection) {
    const id = annotationId(selection.passageId, selection.version, selection.lineIndex);
    const saved = annotations[id] || {};
    const section = make('section', 'teacher-tools');
    section.appendChild(make('p', 'device-type', 'Teacher annotation'));
    section.appendChild(make('h3', '', 'Highlight & note'));

    const colors = make('div', 'highlight-options');
    const none = make('button', `highlight-chip clear-chip${!saved.color ? ' is-selected' : ''}`, 'None');
    none.type = 'button'; none.dataset.color = '';
    colors.appendChild(none);
    HIGHLIGHT_COLORS.forEach((color) => {
      const chip = make('button', `highlight-chip chip-${color}${saved.color === color ? ' is-selected' : ''}`);
      chip.type = 'button'; chip.dataset.color = color;
      chip.setAttribute('aria-label', `${color} highlight`);
      colors.appendChild(chip);
    });
    section.appendChild(colors);

    const textarea = make('textarea', 'teacher-note-input');
    textarea.rows = 4;
    textarea.placeholder = 'Write a teaching note for this line…';
    textarea.value = saved.note || '';
    textarea.setAttribute('aria-label', 'Teacher note');
    section.appendChild(textarea);
    const actions = make('div', 'teacher-note-actions');
    const status = make('span', 'save-status', saved.note ? 'Saved on this device' : '');
    const save = make('button', 'save-note-button', 'Save note'); save.type = 'button';
    actions.append(status, save); section.appendChild(actions);

    colors.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-color]');
      if (!chip) return;
      const current = annotations[id] || {};
      current.color = chip.dataset.color;
      if (!current.color && !current.note) delete annotations[id]; else annotations[id] = current;
      saveAnnotations(); renderReader(); renderSelection(selection);
    });
    save.addEventListener('click', () => {
      const current = annotations[id] || {};
      current.note = textarea.value.trim();
      if (!current.color && !current.note) delete annotations[id]; else annotations[id] = current;
      saveAnnotations();
      status.textContent = current.note ? 'Saved on this device' : 'Note removed';
      renderReader();
    });
    return section;
  }

  async function showWordMeaning(word, selection) {
    const clean = norm(word).replace(/ /g, '');
    state.selectedWord = word;
    renderSelection(selection);
    const box = inspectorContent.querySelector('.word-definition');
    if (!box || wordMeanings[clean]) return;
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`);
      if (!response.ok) throw new Error('No definition');
      const entries = await response.json();
      const meaning = entries?.[0]?.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition;
      if (!definition || state.selectedWord !== word) return;
      box.querySelector('.definition-copy').textContent = definition;
      const part = box.querySelector('.word-part');
      if (part) part.textContent = meaning.partOfSpeech || 'word';
    } catch (_) {
      if (state.selectedWord === word) box.querySelector('.definition-copy').textContent = 'No short dictionary entry was found. Use the modern-English passage below to work out its meaning in this context.';
    }
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
    let paired = '';
    let pairedLabel = '';
    if (selection.version === 'original') {
      const segments = modernLines(passage);
      const indexes = selection.lineIndex < 0
        ? segments.map((_, index) => index)
        : correspondingModernIndexes(passage, selection.lineIndex);
      paired = indexes.map((index) => segments[index]).filter(Boolean).join(' ');
      pairedLabel = selection.lineIndex < 0 ? 'Modern English passage' : 'Corresponding Modern English';
    } else {
      const originals = passage.original || [];
      const indexes = selection.lineIndex < 0
        ? originals.map((_, index) => index)
        : correspondingOriginalIndexes(passage, selection.lineIndex);
      paired = indexes.map((index) => originals[index]).filter(Boolean).join(' ');
      pairedLabel = selection.lineIndex < 0 ? 'Original passage' : 'Corresponding Shakespearean line';
    }
    if (paired) {
      const correspondence = make('section', 'correspondence-box');
      correspondence.appendChild(make('p', 'correspondence-label', pairedLabel));
      correspondence.appendChild(make('p', 'selected-modern', paired));
      inspectorContent.appendChild(correspondence);
    }

    if (state.selectedWord) {
      const clean = norm(state.selectedWord).replace(/ /g, '');
      const definition = make('section', 'word-definition');
      const heading = make('div', 'word-definition-head');
      heading.appendChild(make('span', 'word-label', state.selectedWord));
      heading.appendChild(make('span', 'word-part', wordMeanings[clean] ? 'Shakespearean usage' : 'Looking up…'));
      definition.appendChild(heading);
      definition.appendChild(make('p', 'definition-copy', wordMeanings[clean] || 'Finding a dictionary meaning…'));
      definition.appendChild(make('p', 'definition-context', 'Read it in context with the modern-English passage shown above.'));
      inspectorContent.appendChild(definition);
    }

    inspectorContent.appendChild(renderTeacherTools(selection));

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
    state.selectedWord = null;
    renderReader();
    renderSelection(state.selected);
  }

  function focusCorrespondingLine(passageId, version) {
    const card = passageRoot.querySelector(`[data-id="${passageId}"]`);
    if (!card || state.mode !== 'compare') return;
    const selector = version === 'original' ? '.modern-text.is-corresponding' : '.verse-line.is-corresponding';
    const counterpart = card.querySelector(selector);
    if (counterpart) counterpart.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  function handleTextClick(event) {
    const word = event.target.closest('.word-token');
    const button = event.target.closest('[data-passage]');
    if (!button) return;
    const passage = data.passages.find((item) => item.id === button.dataset.passage);
    if (!passage) return;
    const version = button.dataset.version || 'original';
    const lineIndex = Number(button.dataset.line);
    const text = version === 'modern'
      ? (lineIndex < 0 ? passage.modern : modernLines(passage)[lineIndex])
      : (lineIndex < 0 ? (passage.original || []).join(' ') : passage.original[lineIndex]);
    state.selected = { passageId: passage.id, lineIndex, version, text };
    state.selectedWord = word ? word.dataset.word : null;
    renderReader();
    renderSelection(state.selected);
    focusCorrespondingLine(passage.id, version);
    if (word) showWordMeaning(word.dataset.word, state.selected);
  }

  passageRoot.addEventListener('keydown', (event) => {
    const word = event.target.closest('.word-token');
    if (word && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); word.click();
      return;
    }
    const line = event.target.closest('.verse-line');
    if (line && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); line.click();
    }
  });

  setupScenes();
  renderReader();

  passageRoot.addEventListener('click', handleTextClick);
  sceneSelect.addEventListener('change', () => {
    state.scene = sceneSelect.value;
    state.search = '';
    searchInput.value = '';
    state.selected = null;
    state.selectedWord = null;
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
