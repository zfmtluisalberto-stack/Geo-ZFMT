# AGENTS.md

## Purpose
This file helps AI coding agents understand the workspace quickly. The project is a standalone `qgis2web` map export, not a traditional web app with a build system.

## Project type
- Self-contained OpenLayers-based web map exported by `qgis2web`.
- No Node, npm, or build/test commands are present.
- The map runs by opening `index.html` in a browser or serving the folder from a static web server.

## Key files and directories
- `index.html`: main entry point and map layout.
- `README.txt`: basic usage and publishing note.
- `resources/`: local JS/CSS dependencies and runtime support files.
- `layers/`: exported layer data as JS files.
- `styles/`: layer styling helpers for each layer.
- `resources/qgis2web.js` and `resources/functions.js`: map initialization and custom behavior.

## Editing guidance
- Edit `index.html` for layout, UI controls, and script ordering.
- Edit `layers/*.js` to change layer data or properties.
- Edit `styles/*_style.js` to adjust layer symbology.
- Edit `resources/qgis2web.js` and `resources/functions.js` for custom map interaction logic.
- Keep all referenced files in place; the export depends on relative paths.

## What agents should avoid
- Do not assume there is a JavaScript framework, package manifest, or backend service.
- Do not add a build/tooling layer unless the user explicitly requests one.
- Do not remove local libraries from `resources/`; the export is designed to work offline.

## Useful note
- If asked to make the map publishable, the full folder must be uploaded intact, because `index.html` loads local JS/CSS and layer files by relative path.
