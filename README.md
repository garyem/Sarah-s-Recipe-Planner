# 🥗 Sarah's Recipe Planner

A clean, modern, zero-dependency interactive meal and recipe planner web application. Designed for seamless weekly planning on **Desktop**, **Apple iPad**, and **Android** mobile devices.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-059669?style=flat-square)
![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen?style=flat-square)

---

## ✨ Features

### 1. 📅 7-Day Weekly Grid (Monday – Sunday)
- **21 Dedicated Slots**: Plan Breakfast, Lunch, and Dinner for every day of the week.
- **Meal Counter**: Real-time counter tracks progress (e.g. `14 / 21 meals scheduled`).
- **Clear Week Button**: Quickly reset the entire weekly calendar with a safe confirmation prompt.

### 2. 🍲 Recipe Library & Custom Recipe Creator
- **6 Diverse Built-In Recipes**: Covers breakfast, lunch, and dinner (Porridge, Poached Eggs, Quinoa Salad, Salmon Wrap, Cottage Pie, Chicken Tikka Masala).
- **UK Metric Units**: Uses standard UK metric units (`g`, `kg`, `ml`, `l`, `tbsp`, `tsp`, `whole`, `slices`, `cloves`, `pinch`).
- **Dynamic Recipe Builder**: Add your own recipes with custom prep time, tags, cooking notes, and an unlimited number of structured ingredients.
- **Recipe Management**: Search recipes by name or ingredient, filter by meal category, view ingredients, or delete custom recipes.

### 3. 👆 Drag-and-Drop & Touch Scheduling
- **Desktop HTML5 Drag & Drop**: Drag recipes from the sidebar directly into any calendar slot, or drag between slots to move or swap meals.
- **Native Touch Drag Engine (iPad & Android)**: Built-in touch drag-and-drop with a floating card ghost and haptic feedback (`navigator.vibrate`) on touch screens.
- **Tap-to-Assign**: Tap any empty slot on mobile or tablet to open a fast slot-picker modal and assign meals with a single tap.
- **Quick Schedule Buttons**: Recipe cards include a quick `Schedule +` button to assign meals without dragging.

### 4. 🛒 Automatic Combined Shopping List
- **Smart Ingredient Consolidation**: Automatically scans all meals on the week's schedule and sums identical ingredients with matching units (e.g. 10 g butter + 25 g butter = **35 g butter**).
- **Multiplied Repeated Meals**: Scheduling a recipe twice automatically doubles the required ingredients.
- **Interactive Checklist**: Check off items as you walk through the supermarket, with visual strike-throughs and a live percentage progress bar.
- **Copy to Clipboard**: One-click button formats a clean text shopping list ready to paste into Notes, WhatsApp, or email.

### 5. 📱 Android & iPad / Tablet Optimized
- **Native Bottom Sheets**: Modals transform into rounded mobile bottom sheets on mobile devices.
- **Sticky Day Switcher Chips**: Easily toggle between `All Days` or focus on individual days (`Mon`, `Tue`, `Wed`, etc.) with smooth scroll navigation.
- **Mobile Bottom Navigation**: Quick access bar on phones and tablet portrait views (`Plan`, `Recipes`, `+ Add`, `Shopping`).
- **PWA & Standalone Support**: Add to Home Screen on iOS or Android with notch/home-indicator safe-area padding and anti-zoom inputs (16px).

### 6. 💾 Local Storage & Cross-Device Backup
- **Auto-Sync**: Automatically saves all custom recipes, scheduled calendar meals, and checked shopping items in browser `localStorage`.
- **Export Backup (JSON)**: Download a timestamped `.json` file of your complete plan.
- **Import Backup**: Restore your meal plan and custom recipes on any other device with full schema validation.

---

## 🚀 Live Demo on GitHub Pages

You can host this project on **GitHub Pages** in under 60 seconds for free:

1. Create a new repository on [GitHub](https://github.com/) (e.g. `sarahs-recipe-planner`).
2. Push or upload `index.html`, `style.css`, and `script.js` to the `main` branch.
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
4. In about 1–2 minutes, GitHub will generate your live URL:
   ```text
   https://<your-username>.github.io/sarahs-recipe-planner/
   ```

---

## 💻 Local Setup & Running Locally

Because this project uses a zero-dependency static stack, no package manager (`npm`/`pnpm`) or build tool (`vite`/`webpack`) is required.

### Option A: Double-Click
Simply double-click `index.html` in your file explorer to open it in any web browser.

### Option B: Local Python Server
Run the following in the project root:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option C: VS Code Live Server
Open the project folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.

---

## 📂 Project Structure

```text
meal-planner/
├── index.html       # Semantic HTML5 layout, accessible dialog modals, and header
├── style.css        # CSS3 styling, responsive grid, mobile bottom sheets, animations
├── script.js        # Vanilla JavaScript: state, drag/touch engine, shopping aggregator
└── README.md        # Documentation and deployment instructions
```

---

## 📲 Adding to Mobile Home Screen (PWA Feel)

### On Apple iPad / iPhone (Safari):
1. Open your hosted GitHub Pages site in **Safari**.
2. Tap the **Share** button (box with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. The app will now open in fullscreen without browser bars.

### On Android (Chrome):
1. Open your hosted GitHub Pages site in **Chrome**.
2. Tap the three dots menu (**⋮**) in the top right.
3. Tap **Add to Home screen** or **Install app**.
4. Confirm by tapping **Install**.

---

## 🛠️ Built With

- **HTML5** & semantic dialogs
- **CSS3** (CSS Variables, CSS Grid, Flexbox, Safe-Area insets, Backdrop filters)
- **Vanilla JavaScript** (ES6+, Drag and Drop API, Touch Events, LocalStorage, Clipboard API)
- **Zero External Runtime Dependencies**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and share.
