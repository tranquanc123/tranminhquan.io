(() => {
  const container = document.querySelector('#publication-list');
  if (!container) return;

  const search = document.querySelector('#publication-search');
  const yearFilter = document.querySelector('#publication-year');
  const topicFilter = document.querySelector('#publication-topic');
  const statusFilter = document.querySelector('#publication-status');
  const reset = document.querySelector('#publication-reset');
  const count = document.querySelector('#publication-count');
  const controls = [search, yearFilter, topicFilter, statusFilter].filter(Boolean);

  function parseBibTeX(text) {
    return text
      .split(/\n\s*(?=@)/g)
      .map(raw => raw.trim())
      .filter(Boolean)
      .map(raw => {
        const heading = raw.match(/^@(\w+)\s*\{\s*([^,]+),/);
        if (!heading) return null;

        const entry = { type: heading[1].toLowerCase(), key: heading[2].trim(), raw };
        const fields = /(\w+)\s*=\s*\{([^}]*)\}\s*,?/g;
        let match;
        while ((match = fields.exec(raw)) !== null) {
          entry[match[1].toLowerCase()] = match[2].trim();
        }
        return entry;
      })
      .filter(entry => entry && entry.title && entry.year)
      .sort((a, b) => Number(b.year) - Number(a.year) || a.title.localeCompare(b.title));
  }

  function addText(parent, tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
  }

  function authorsFor(entry) {
    return (entry.author || '').split(/\s+and\s+/).filter(Boolean);
  }

  function addAuthors(parent, entry) {
    const paragraph = document.createElement('p');
    paragraph.className = 'publication-authors';
    authorsFor(entry).forEach((author, index, authors) => {
      if (/^QM Tran$/i.test(author)) {
        addText(paragraph, 'strong', 'author-self', author);
      } else {
        paragraph.append(document.createTextNode(author));
      }
      if (index < authors.length - 1) paragraph.append(document.createTextNode(', '));
    });
    parent.append(paragraph);
  }

  function topicsFor(entry) {
    const text = [entry.title, entry.journal, entry.note].join(' ').toLowerCase();
    const topics = [];
    if (/dengue|yellow fever|chikungunya|japanese encephalitis|arbovir|mosquito|rift valley/.test(text)) topics.push('arboviruses');
    if (/vaccin|intervention|trial/.test(text)) topics.push('vaccination');
    if (/model|nowcast|forecast|transmission|burden|seroprev|risk map|projection|reproductive|impact/.test(text)) topics.push('methods');
    if (/influenza|covid|pertussis|hpv|sexually transmitted|oral health/.test(text)) topics.push('other');
    return topics;
  }

  function statusFor(entry) {
    return entry.type === 'unpublished' ? 'manuscript' : 'published';
  }

  function venueFor(entry) {
    return entry.journal || entry.note || 'Manuscript';
  }

  function citationFor(entry) {
    const authors = authorsFor(entry).join(', ');
    return `${authors}. (${entry.year}). ${entry.title}. ${venueFor(entry)}.${entry.doi ? ` https://doi.org/${entry.doi}` : ''}`;
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function addCopyButton(parent, label, value) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'publication-action';
    button.textContent = label;
    button.addEventListener('click', async () => {
      try {
        await copyText(value);
        button.textContent = 'Copied';
      } catch (error) {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => { button.textContent = label; }, 1600);
    });
    parent.append(button);
  }

  function addExternalLink(parent, label, href) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    const note = document.createElement('span');
    note.className = 'visually-hidden';
    note.textContent = ' (opens in a new tab)';
    link.append(note);
    parent.append(link);
  }

  function render(entries) {
    container.replaceChildren();
    if (!entries.length) {
      addText(container, 'p', 'publication-notice', 'No publications match these filters.');
      return;
    }

    entries.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'publication-item';

      const header = document.createElement('div');
      header.className = 'publication-item-meta';
      addText(header, 'span', `status-tag status-${statusFor(entry)}`, statusFor(entry) === 'published' ? 'Published' : 'Manuscript');
      addText(header, 'span', 'publication-item-year', entry.year);
      article.append(header);

      addText(article, 'h3', '', entry.title);
      addAuthors(article, entry);
      addText(article, 'p', 'publication-venue', `${venueFor(entry)}${entry.month ? ` · ${entry.month}` : ''}`);

      const actions = document.createElement('div');
      actions.className = 'publication-item-actions';
      if (entry.doi) addExternalLink(actions, 'DOI ↗', `https://doi.org/${entry.doi}`);
      addExternalLink(actions, 'Scholar ↗', `https://scholar.google.com/scholar?q=${encodeURIComponent(entry.title)}`);
      addCopyButton(actions, 'Copy citation', citationFor(entry));
      addCopyButton(actions, 'Copy BibTeX', entry.raw);
      article.append(actions);

      container.append(article);
    });
  }

  function populateYears(entries) {
    [...new Set(entries.map(entry => entry.year))].forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.append(option);
    });
  }

  function applyFilters(entries) {
    const query = search.value.trim().toLowerCase();
    const year = yearFilter.value;
    const topic = topicFilter.value;
    const status = statusFilter.value;
    const filtered = entries.filter(entry => {
      const searchable = [entry.title, entry.author, entry.journal, entry.note, entry.year].join(' ').toLowerCase();
      return (!query || searchable.includes(query))
        && (year === 'all' || entry.year === year)
        && (topic === 'all' || topicsFor(entry).includes(topic))
        && (status === 'all' || statusFor(entry) === status);
    });

    render(filtered);
    count.textContent = filtered.length === entries.length ? `${entries.length} works` : `${filtered.length} of ${entries.length} works`;
    reset.hidden = !query && year === 'all' && topic === 'all' && status === 'all';
  }

  fetch(container.dataset.bib)
    .then(response => {
      if (!response.ok) throw new Error('Could not load publication data.');
      return response.text();
    })
    .then(text => {
      const entries = parseBibTeX(text);
      populateYears(entries);
      controls.forEach(control => { control.disabled = false; });
      controls.forEach(control => control.addEventListener('input', () => applyFilters(entries)));
      reset.addEventListener('click', () => {
        search.value = '';
        yearFilter.value = 'all';
        topicFilter.value = 'all';
        statusFilter.value = 'all';
        applyFilters(entries);
        search.focus();
      });
      container.setAttribute('aria-busy', 'false');
      applyFilters(entries);
    })
    .catch(() => {
      container.setAttribute('aria-busy', 'false');
      container.textContent = 'Publication data could not be displayed. Please use the BibTeX download or Google Scholar link above.';
      count.textContent = 'Publications unavailable';
    });
})();
