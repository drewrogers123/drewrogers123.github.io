# Math & Physics Practice (Adaptive)

A client-side web app that lets you choose math and physics topics and practice problems that adapt in difficulty based on your performance. Problems are rendered in LaTeX via KaTeX. Built to showcase JavaScript skills and support easy authoring of new problems/topics.

Live site target: https://drewrogers123.github.io/

## Project Structure

- `index.html` — main page, loads scripts and KaTeX
- `css/styles.css` — styles
- `js/subjects.js` — subject/topic definitions and buttons
- `js/problems.js` — problem bank and adaptive engine
- `js/app.js` — UI logic tying it all together
- `.nojekyll` — ensures GitHub Pages serves assets without Jekyll processing

## Local Usage

Open `index.html` directly in a browser, or serve the folder with any static server.

## Adding Subjects and Problems

- Add/rename topics in `js/subjects.js` (each has an `id` and `name`).
- Add problems in `js/problems.js` under the matching `subject` and `topic` arrays.
  - Each problem has: `id`, `difficulty` (1–10), `question` (LaTeX allowed), `answer`, `solution` (LaTeX allowed), and `tags`.
  - Example:
    ```js
    {
      id: 'alg3',
      difficulty: 4,
      question: "Solve $x^2 = 9$",
      answer: "±3",
      solution: "Take square roots of both sides: $x = ±3$.",
      tags: ["quadratics", "square roots"]
    }
    ```

## Deployment to GitHub Pages (User Site)

Your user site must be hosted at a repository named `drewrogers123.github.io`. Place this project's files at the root of that repo and push to the `main` branch.

Steps:
1. Create the repository on GitHub (if it does not exist): `drewrogers123/drewrogers123.github.io`.
2. In this project directory, initialize git, commit, and push to that repo:
   ```bash
   git init
   git checkout -b main
   git add .
   git commit -m "Initial commit: adaptive math & physics practice"
   git remote add origin https://github.com/drewrogers123/drewrogers123.github.io.git
   git push -u origin main
   ```
3. GitHub Pages for user sites is automatic. Visit https://drewrogers123.github.io after the push (allow a minute).

If you already have `drewrogers123.github.io` with other content, you can place this app in a subdirectory and link to it, or host this project in a separate repo and use a project page (Pages from `gh-pages` or `docs/`).

## Roadmap

- Time-weighted difficulty adjustments
- Better answer checking (tolerance, symbolic checks)
- Problem editor/admin UI
- Progress persistence (localStorage or backend)
- More topics and problem variety
