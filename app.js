(() => {
  'use strict';

  const data = window.PLAY_DATA;
  const notes = window.DEVICE_NOTES || [];
  const glossary = window.DEVICE_GLOSSARY || [];
  const sceneSummaries = window.SCENE_SUMMARIES || {};
  const lineQuestions = window.LINE_QUESTIONS || [];
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
  const overviewTab = document.getElementById('overviewTab');
  const notesTab = document.getElementById('notesTab');
  const glossaryTab = document.getElementById('glossaryTab');
  const mobileNotesButton = document.getElementById('mobileNotesButton');

  const state = {
    scene: 'Prologue',
    mode: 'compare',
    search: '',
    activeTab: 'overview',
    selected: null,
    fontScale: 1,
    selectedWord: null,
    selectedQuestion: null
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

  function appendLineText(button, passage, line, lineIndex) {
    const attached = lineQuestions
      .filter((question) => question.passageId === passage.id && question.lineIndex === lineIndex)
      .map((question) => ({ question, start: line.indexOf(question.anchor) }))
      .filter((item) => item.start >= 0)
      .sort((a, b) => a.start - b.start);
    let cursor = 0;
    attached.forEach(({ question, start }) => {
      if (start < cursor) return;
      appendClickableWords(button, line.slice(cursor, start));
      const fragment = make('mark', 'question-highlight');
      fragment.title = 'A scene question is attached to this phrase';
      appendClickableWords(fragment, question.anchor);
      button.appendChild(fragment);
      const trigger = make('button', 'question-trigger', '?');
      trigger.type = 'button';
      trigger.dataset.questionId = question.id;
      trigger.setAttribute('aria-label', `Open question about “${question.anchor}”`);
      button.appendChild(trigger);
      cursor = start + question.anchor.length;
    });
    appendClickableWords(button, line.slice(cursor));
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
      const saved = annotationFor(passage.id, 'original', index);
      const button = make('div', `verse-line${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(line) ? ' is-annotated' : ''}${saved.color ? ` teacher-highlight highlight-${saved.color}` : ''}${saved.note ? ' has-teacher-note' : ''}`);
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      button.dataset.passage = passage.id;
      button.dataset.line = String(index);
      button.dataset.version = 'original';
      appendLineText(button, passage, line, index);
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
      const saved = annotationFor(passage.id, 'modern', -1);
      const button = make('button', `modern-text${passage.kind === 'stage' ? ' stage-line' : ''}${isTagged(passage.modern) ? ' is-annotated' : ''}${saved.color ? ` teacher-highlight highlight-${saved.color}` : ''}${saved.note ? ' has-teacher-note' : ''}`);
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

  function renderQuestionCard(question) {
    const card = make('section', 'scene-question-card');
    card.appendChild(make('p', 'question-type', question.type));
    card.appendChild(make('h3', '', question.question));
    card.appendChild(make('p', 'possible-answer-label', 'Possible answer'));
    card.appendChild(make('p', 'possible-answer-copy', question.answer));
    return card;
  }

  function showSceneOverview(openOnMobile = false) {
    state.activeTab = 'overview';
    updateTabs();
    inspectorTitle.textContent = `${state.scene} overview`;
    inspectorContent.textContent = '';
    const card = make('article', 'scene-overview-card');
    card.appendChild(make('p', 'device-type', 'Scene overview'));
    card.appendChild(make('h3', '', state.scene));
    card.appendChild(make('p', 'scene-summary-copy', sceneSummaries[state.scene] || 'A summary for this section is not available yet.'));
    inspectorContent.appendChild(card);
    inspectorContent.appendChild(make('p', 'overview-tip', 'Use this overview to introduce the scene, then select a line to explore its language.'));
    mobileNotesButton.childNodes[0].textContent = 'Open scene overview ';
    if (openOnMobile && window.matchMedia('(max-width: 820px)').matches) inspector.classList.add('is-open');
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
    inspectorTitle.textContent = state.selectedQuestion ? 'Scene question' : (selection.version === 'modern' ? 'Modern-text note' : 'Line note');
    mobileNotesButton.childNodes[0].textContent = state.selectedQuestion ? 'Open scene question ' : 'Open line notes ';
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

    if (state.selectedQuestion) inspectorContent.appendChild(renderQuestionCard(state.selectedQuestion));

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
    const overviewActive = state.activeTab === 'overview';
    const glossaryActive = state.activeTab === 'glossary';
    overviewTab.classList.toggle('is-active', overviewActive);
    notesTab.classList.toggle('is-active', !overviewActive && !glossaryActive);
    glossaryTab.classList.toggle('is-active', glossaryActive);
    overviewTab.setAttribute('aria-selected', String(overviewActive));
    notesTab.setAttribute('aria-selected', String(!overviewActive && !glossaryActive));
    glossaryTab.setAttribute('aria-selected', String(glossaryActive));
  }

  function showGlossary() {
    state.activeTab = 'glossary';
    updateTabs();
    renderGlossary();
    mobileNotesButton.childNodes[0].textContent = 'Open device guide ';
    if (window.matchMedia('(max-width: 820px)').matches) inspector.classList.add('is-open');
  }

  function changeScene(scene) {
    state.scene = scene;
    sceneSelect.value = scene;
    state.search = '';
    searchInput.value = '';
    state.selected = null;
    state.selectedWord = null;
    state.selectedQuestion = null;
    renderReader();
    showSceneOverview(true);
  }

  function selectPassage(passage, version = 'original') {
    const text = [...(passage.original || []), passage.modern || ''].filter(Boolean).join(' ').trim();
    state.selected = { passageId: passage.id, lineIndex: -1, version, text };
    state.selectedWord = null;
    state.selectedQuestion = null;
    renderReader();
    renderSelection(state.selected);
  }

  function handleTextClick(event) {
    const questionTrigger = event.target.closest('[data-question-id]');
    if (questionTrigger) {
      const question = lineQuestions.find((item) => item.id === questionTrigger.dataset.questionId);
      const passage = question && data.passages.find((item) => item.id === question.passageId);
      if (question && passage) {
        state.selectedQuestion = question;
        state.selectedWord = null;
        state.selected = { passageId: passage.id, lineIndex: question.lineIndex, version: 'original', text: passage.original[question.lineIndex] };
        renderReader();
        renderSelection(state.selected);
      }
      return;
    }
    const word = event.target.closest('.word-token');
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
    state.selectedWord = word ? word.dataset.word : null;
    state.selectedQuestion = null;
    renderReader();
    renderSelection(state.selected);
    if (word) showWordMeaning(word.dataset.word, state.selected);
  }

  passageRoot.addEventListener('keydown', (event) => {
    if (event.target.closest('.question-trigger')) return;
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
  showSceneOverview();

  passageRoot.addEventListener('click', handleTextClick);
  sceneSelect.addEventListener('change', () => {
    changeScene(sceneSelect.value);
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
    if (index > 0) changeScene(data.scenes[index - 1]);
  });
  document.getElementById('nextScene').addEventListener('click', () => {
    const index = data.scenes.indexOf(state.scene);
    if (index >= 0 && index < data.scenes.length - 1) changeScene(data.scenes[index + 1]);
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
  overviewTab.addEventListener('click', () => showSceneOverview());
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
