# Preset Poster Studio

[Open Preset Poster Studio](https://randyvarianda.github.io/preset-poster-studio/)

Create guitar effect preset posters with a live preview and PNG export.

- Edit preset details, effect models, and slider values.
- Upload a Pocket Master `.prst` export to load its name, models, bypass states, parameter values, and signal chain into the poster. Files are read locally in your browser.
- Add, rename, or remove parameters using the inline editor.
- Hide disabled effects from the signal chain.
- Customize poster colors and export a high-resolution PNG.

## Run locally

Open `index.html` in a browser. No installation or build step is required.

Run importer checks with `node tests/preset-import.test.js`.

## Publishing

GitHub Pages serves the root of the `main` branch. Push changes to `main` to update the site.

## Preset import

The importer reads the binary Pocket Master settings records and little-endian float parameter arrays. Unsupported models, Clone amp presets, and incomplete files report an error and keep the current poster. This app visualizes settings; it does not process guitar audio.

Effect IDs and parameter slot mappings were cross-checked against [SonicMaster](https://github.com/Skyggedans/SonicMaster), released under the MIT license. See `THIRD_PARTY_NOTICES.md`.
