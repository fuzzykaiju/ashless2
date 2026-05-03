# Ashless v2.8 – Quit Smoking Tracker

A **progressive web app** (PWA) to help you track cravings, cigarettes, and progress on your journey to becoming smoke‑free.  
Everything is **fully client‑side** — your data stays in your browser, never sent anywhere.

## ✨ Features

- 📅 **Daily log** – cravings count, cigarettes smoked, money spent
- ⏱️ **Precise tracking** – log each craving or cigarette with exact time
- 🔴🟡🟢 **Intensity levels** – low, medium, high for every craving
- 🧠 **Smart time presets** – “just now”, “5 min ago”, “1 hour ago” for today’s entries
- 📋 **Timeline view** – all events of a day in chronological order
- 📝 **Notes** – add personal notes to each day
- ✏️ **Full edit mode** – modify or delete any entry in a day
- 📊 **Interactive charts** – smoked, cravings, and intensity breakdown (Chart.js)
- 📤📥 **CSV export/import** – backup, port, or analyze your data elsewhere
- 🛡️ **Auto‑detected skipped days** – with option to mark as a clean day
- 🌍 **Multi‑currency & timezone support** – set once, applies everywhere
- 📲 **Installable** – works offline, add to your home screen on mobile or desktop

## 🚀 Getting Started

### Prerequisites

A modern web browser (Chrome, Firefox, Safari, Edge). No build tools required.

### Run locally

Clone the repository and serve the folder with a local static server (needed for the service worker and PWA features):

```bash

git clone https://github.com/fuzzykaiju/ashless2.git
cd ashless
npx serve .
```


Then open `http://localhost:3000` (or the port shown).

> Alternatively, you can just open `index.html` directly, but the offline cache and install prompt won’t work.

## 📝 How to Use

1. **First launch** – you’ll be asked to choose your currency, cigarette price, and timezone. These are saved and can be changed later in Settings (price only after initial setup).
2. **Main table** – each row is a day.
    - Tap the number under 😩 to add a craving.
    - Tap the number under 🚬 to log a cigarette.
    - Tap **𝒊** to view the day’s timeline, intensity details, and to add notes.
    - Tap **⋮** to edit the day’s entries (add, modify, delete).
3. **Skipped days** – if you didn’t log anything, the row will show a ⚠️. Tap it to either add entries or mark it as a clean (smoke‑free) day.
4. **Charts** – open the side menu (☰) > **Show Chart** to see your progress. Use the tabs and time range selector.
5. **Export / Import** – side menu > Export CSV to download all data, or Import CSV to restore from a previous export.

## 🛠 Tech Stack

|Layer|Technology|
|---|---|
|Structure|Plain HTML|
|Styling|CSS with custom properties (no pre‑processor)|
|Functionality|Vanilla JavaScript (ES6+)|
|Charts|[Chart.js](https://www.chartjs.org/) (loaded from CDN)|
|Icons|[Font Awesome](https://fontawesome.com/) (CDN)|
|Data storage|Browser `localStorage`|
|Offline|Service Worker + Web App Manifest|

No frameworks, no database, no back‑end — just static files that run anywhere.

## 📖 About Version 2.8

Ashless v2.8 refines the tracking experience with detailed per‑event logging, improved UI, and automatic skipped‑day handling. All previous v2.x entries are compatible.

## 🤝 Contributing

Contributions are very welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please keep the code lightweight and dependency‑free (except Chart.js & Font Awesome from CDN).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ for a smoke‑free life.  
_Every craving you resist brings you closer to freedom._