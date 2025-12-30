# My Personal Blog

Minimalist blog with live preview, categories, search, dark mode, and social sharing.

## Features

- Create and edit posts with live preview
- Category system and real-time search
- Light/dark theme toggle
- Draft and publish system
- Share on WhatsApp, Twitter/X, Reddit
- Export posts to Markdown
- Responsive design
- LocalStorage based (no database needed)

## Quick Start

### Local
1. Download files
2. Open `index.html` in browser
3. Start writing

### Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel
3. Deploy

## Project Structure

```
personal_blog/
├── css/styles.css
├── js/main.js
├── index.html
└── README.md
```

## Customization

**Change categories** - Edit `<select id="postCategory">` in `index.html`

**Change colors** - Edit CSS variables in `styles.css`:
```css
:root {
    --accent: #2563eb;
    --accent-hover: #1d4ed8;
}
```

**Change title** - Edit `<h1>` in `index.html`

## Tech Stack

HTML5, CSS3, Vanilla JavaScript, LocalStorage API

## Notes

- Posts saved in browser LocalStorage
- Clear browser data = lose posts (export for backup)
- Posts ordered by date (newest first)
- Dark mode preference saved between sessions
