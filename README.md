# 🧠 Memory Match Pro

A fully responsive, interactive Memory Card Game built with **Vanilla JavaScript**.  
The game features dynamic grid generation, custom asset management, sound effects, and a theme toggle.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Live Demo
**Play the game here:** [INSERT YOUR GITHUB PAGES LINK HERE]

---

## 🛠️ Technologies Used
- **HTML5:** Semantic structure and layout.
- **CSS3:** Flexbox/Grid for responsiveness, CSS Variables for theming (Dark/Light mode), and 3D transforms for card flips.
- **JavaScript (ES6+):** - DOM manipulation for dynamic grid rendering.
  - Logic for game state (matching pairs, move counter, timer).
  - Audio API integration for sound effects.
  - Local Storage (optional implementation) for high scores.

---

## ✨ Key Features

### 1. Dynamic Difficulty Engine
The game logic automatically calculates grid dimensions and slices the asset array based on user selection:
- **Very Easy:** 3x4 Grid (6 Pairs)
- **Easy:** 4x4 Grid (8 Pairs)
- **Medium:** 4x5 Grid (10 Pairs)
- **Hard:** 6x6 Grid (18 Pairs)

### 2. Custom Asset Categories
Users can switch between four distinct image sets. The app handles different file formats (`.jpg` vs `.png`) seamlessly.
- 🐱 **Cats**
- 🐶 **Dogs**
- 🛡️ **Marvels**
- 🌌 **Space**

### 3. Professional Asset Structure
Assets are organized locally to ensure zero latency and offline capability.
- **Audio:** Custom sound effects for Flip, Match, and Win events.
- **Images:** High-resolution 1:1 aspect ratio images optimization.

### 4. UI/UX Enhancements
- **Dark Mode:** System-wide variable switch for comfortable night gaming.
- **Responsive Design:** Works perfectly on Mobile, Tablet, and Desktop.
- **Error Handling:** Fallback images implemented (`onerror`) to prevent broken UI if an asset is missing.

---

## 📂 Project Structure

```bash
/vanilla-js-memory-game
│
├── index.html          # Main application structure
├── style.css           # Styling, Animations, and Theming
├── script.js           # Game Logic and State Management
│
└── assets/             # Local Resources
    ├── Cats/           # [1.jpg ... 18.jpg]
    ├── Dogs/           # [1.jpg ... 18.jpg]
    ├── Marvels/        # Mixed formats
    ├── Space/          # [1.png ... 18.png]
    └── Sound/          # [flip.mp3, match.mp3, win.mp3]
