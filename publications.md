---
layout: default
title: Publications
permalink: /publications/
description: Peer-reviewed publications and manuscripts by infectious disease modeler Quan M. Tran.
---

# Publications

My work spans arboviral transmission, vaccination, disease burden, and real-time outbreak analytics. Search the full record below or filter it by year, topic, and publication status.

<section class="publication-explorer" aria-labelledby="publication-explorer-title">
  <div class="publication-heading">
    <div>
      <p class="section-eyebrow">Research record</p>
      <h2 id="publication-explorer-title">Find a publication</h2>
    </div>
    <div class="publication-downloads">
      <a class="text-link" href="{{ '/assets/data/publications.bib' | relative_url }}" download>Download BibTeX <span aria-hidden="true">↓</span></a>
      <a class="text-link" href="https://scholar.google.com/citations?user=koL60SsAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">Google Scholar <span class="visually-hidden">(opens in a new tab)</span><span aria-hidden="true">↗</span></a>
    </div>
  </div>

  <div class="publication-controls" role="search">
    <label class="publication-search-field" for="publication-search">
      <span>Search title, author, or journal</span>
      <input id="publication-search" type="search" placeholder="Try “dengue” or “vaccination”" autocomplete="off" disabled>
    </label>

    <label for="publication-year">
      <span>Year</span>
      <select id="publication-year" disabled>
        <option value="all">All years</option>
      </select>
    </label>

    <label for="publication-topic">
      <span>Topic</span>
      <select id="publication-topic" disabled>
        <option value="all">All topics</option>
        <option value="arboviruses">Arboviruses</option>
        <option value="vaccination">Vaccination</option>
        <option value="methods">Modeling &amp; methods</option>
        <option value="other">Other infections</option>
      </select>
    </label>

    <label for="publication-status">
      <span>Status</span>
      <select id="publication-status" disabled>
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="manuscript">Manuscripts</option>
      </select>
    </label>
  </div>

  <div class="publication-summary">
    <p id="publication-count" role="status" aria-live="polite">Loading publications…</p>
    <button class="filter-reset" id="publication-reset" type="button" hidden>Clear filters</button>
  </div>

  <div id="publication-list" class="publication-list" data-bib="{{ '/assets/data/publications.bib' | relative_url }}" aria-busy="true"></div>

  <noscript>
    <p class="publication-notice">The interactive publication list requires JavaScript. You can still use the BibTeX download or Google Scholar links above.</p>
  </noscript>
</section>

<script src="{{ '/assets/js/publications.js' | relative_url }}" defer></script>
