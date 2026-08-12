# Quan M. Tran — personal research website

This repository contains the Jekyll source for Quan M. Tran’s academic website. The site presents research themes, experience, methods, publications, and contact links.

## Editing content

- `index.md` contains homepage copy, research case studies, experience, and skills.
- `assets/data/publications.bib` is the single source of truth for the interactive publication list.
- `_config.yml` contains site metadata and academic profile links.
- `assets/css/style.scss` contains the visual system and responsive styles.

Add or update a BibTeX record in `assets/data/publications.bib`; the publications page automatically makes it searchable and provides citation actions. Use `featured = {true}` to preserve editorial metadata for future featured-work components.

## Local preview

Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000/tranminhquan.io/`. The GitHub Actions workflow also runs a production Jekyll build for pushes and pull requests.

## Deployment

The production URL and repository path are configured in `_config.yml`. GitHub Pages builds the site with the `github-pages` gem and the plugins declared there.
