# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This project is a **single-file SPA** — everything lives in `medici-ro.html`: HTML structure, embedded CSS (`<style>`), and all JavaScript (`<script>`). There is no build step, no package manager, no framework, and no backend.

The app is a Romanian-language doctor recommendation platform ("Moms4Moms — Recomandări Medici"). Users can browse/filter doctors, submit reviews, recommend new doctors, and suggest edits. An admin panel (password-protected) handles moderation.

## State Management

All data is stored in `localStorage` under the key `moms4moms_medici_v4`. The global `state` object has these arrays:
- `doctors` — approved doctors (seeded from `SEED_DOCTORS` on first load)
- `pendingDoctors` — submitted but not yet approved
- `reviews` — approved reviews
- `pendingReviews` — submitted but not yet approved
- `suggestions` — change suggestions from users
- `siteFeedback` — star ratings + comments about the site itself

`loadState()` / `saveState()` handle serialization. On first load, `SEED_DOCTORS` is written to `state.doctors`.

## Page Routing

`showPage(pg)` switches between four pages (`home`, `listing`, `detail`, `admin`) by toggling a `.active` CSS class. Each page is a `<div class="page" id="page-{name}">`. Navigation is entirely client-side with no URL changes.

## Admin Panel

- Password is hardcoded as `ADMIN_PASSWORD` in the JS (currently `_3HWog!x6jLqcJP`)
- Login state is kept in the `isAdminLoggedIn` variable (not persisted across refreshes)
- Admin tabs: pending doctors, pending reviews, suggestions, site feedback, all doctors

## Development

Open `medici-ro.html` directly in a browser — no server required. All changes are made in this one file.

To test localStorage behavior: open DevTools → Application → Local Storage → clear the `moms4moms_medici_v4` key to reset to seed data.

## Language

All UI text is in Romanian. Keep new strings in Romanian when modifying the interface.
