(() => {
  const container = document.querySelector('#publication-list');
  if (!container) return;

  const search = document.querySelector('#publication-search');
  const count = document.querySelector('#publication-count');

  function parseBibTeX(text) {
    return text
      .split(/\n(?=@)/g)
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => {
        const heading = block.match(/^@(\w+)\s*\{\s*([^,]+),/);
        if (!heading) return null;
        const entry = { type: heading[1].toLowerCase(), key: heading[2].trim() };
        const fields = /(\w+)\s*=\s*\{([^}]*)\}\s*,?/g;
        let match;
        while ((match = fields.exec(block)) !== null) {
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

  function render(entries) {
    container.replaceChildren();
    if (!entries.length) {
      addText(container, 'p', '', 'No publications match your search.');
      return;
    }

    let currentYear = '';
    entries.forEach(entry => {
      if (entry.year !== currentYear) {
        currentYear = entry.year;
        addText(container, 'h2', 'publication-year', currentYear);
      }

      const article = document.createElement('article');
      article.className = 'publication-item';
      addText(article, 'h3', '', entry.title);
      addText(article, 'p', '', (entry.author || '').split(/\s+and\s+/).join(', '));
      const venue = entry.journal || entry.note || 'Manuscript';
      addText(article, 'p', 'publication-meta', `${venue}${entry.month ? ` · ${entry.month}` : ''} · ${entry.year}`);

      const links = document.createElement('p');
      links.className = 'publication-links';
      if (entry.doi) {
        const doi = document.createElement('a');
        doi.href = `https://doi.org/${entry.doi}`;
        doi.target = '_blank';
        doi.rel = 'noopener';
        doi.textContent = 'DOI';
        links.append(doi, ' · ');
      }
      const scholar = document.createElement('a');
      scholar.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(entry.title)}`;
      scholar.target = '_blank';
      scholar.rel = 'noopener';
      scholar.textContent = 'Google Scholar';
      links.append(scholar);
      article.append(links);
      container.append(article);
    });
  }

  fetch(container.dataset.bib)
    .then(response => {
      if (!response.ok) throw new Error('Could not load publication data.');
      return response.text();
    })
    .then(text => {
      const entries = parseBibTeX(text);
      render(entries);
      if (count) count.textContent = `${entries.length} works`;
      if (search) {
        search.addEventListener('input', () => {
          const query = search.value.trim().toLowerCase();
          const filtered = entries.filter(entry =>
            [entry.title, entry.author, entry.journal, entry.note, entry.year]
              .join(' ')
              .toLowerCase()
              .includes(query)
          );
          render(filtered);
          if (count) count.textContent = `${filtered.length} of ${entries.length}`;
        });
      }
    })
    .catch(() => {
      container.textContent = 'Publication data could not be displayed. Please use the BibTeX download above.';
    });
})();

