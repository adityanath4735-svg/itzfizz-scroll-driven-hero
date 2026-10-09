# 🏎️ ITZFIZZ PROTO-01 // Scroll-Driven Supercar Hero

A futuristic, high-performance scroll-driven hero section crafted with **Next.js 15 (App Router)**, **GSAP ScrollTrigger**, and **Tailwind CSS v4**.

Experience precision cinematic animation where user scroll progress drives an electric hypercar across the viewport with real-time telemetry HUD feedback, illuminated kinetic typography, and interactive Web Audio sound synthesis.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://itzfizz-scroll-driven-hero-ten.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green?style=for-the-badge&logo=greensock)](https://greensock.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## 🌐 Live Preview

- **Production Deployment:** [https://itzfizz-scroll-driven-hero-ten.vercel.app](https://itzfizz-scroll-driven-hero-ten.vercel.app)
- **Repository:** [https://github.com/adityanath4735-svg/itzfizz-scroll-driven-hero](https://github.com/adityanath4735-svg/itzfizz-scroll-driven-hero)

---

## ✨ Features

- **🎯 Pin-Locked Scroll Scrubbing**: Uses GSAP `ScrollTrigger` with `scrub: 0.6` and `anticipatePin: 1` to create silky, responsive physical travel synced with the user's scroll speed.
- **🏎️ Custom Cyber-Supercar Vector Graphics**: Scalable SVG hypercar featuring:
  - Dynamically rotating front and rear turbine wheels synchronized to distance.
  - Aerodynamic light trail that stretches from 0% to 100% along the track.
  - Cyan LED ground glow, brake calipers, and cockpit reflection highlights.
- **⚡ Dynamic Telemetry HUD**:
  - **Live Digital Speedometer**: Progressively accelerates from 0 to 384 KM/H in real time.
  - **Sequential Gear Selector**: Shifts dynamically through gears (`N` → `1` through `7`).
  - **Lap Completion Tracker**: Real-time percentage indicator (`00%` – `100%`).
- **🔊 Procedural Web Audio Engine**:
  - Interactive audio toggle delivering an authentic futuristic electric hypercar motor hum.
  - Dynamically scales oscillator pitch based on scroll progress and scroll velocity.
  - Built with zero external audio assets using native browser Web Audio API (`OscillatorNode` + `BiquadFilterNode`).
- **💡 Kinetic Illuminated Typography**: Staggered character illumination revealing `"ITZFIZZ PROTO-01"` and secondary vector designations as the vehicle accelerates.
- **📊 Aerodynamic Milestone Telemetry Cards**: 4 glassmorphism stat cards (Acceleration, Velocity, Downforce, Powertrain) appearing at precise scroll milestones.
- **📱 Fully Responsive**: Fluid typography, responsive SVGs, and adaptive layouts tested across mobile, tablet, and ultra-wide displays.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 15** | App Router framework with React Server Components and optimized font loading |
| **React 19** | Component architecture and state management |
| **GSAP (GreenSock)** | `gsap.timeline` & `ScrollTrigger` for timeline animation sequencing |
| **Tailwind CSS v4** | Next-generation CSS utility framework with custom design tokens |
| **Web Audio API** | Procedural electric engine sound synthesis without bulky audio files |
| **Vercel** | Edge deployment and global CDN delivery |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (version 18.17+ or 20+) and npm installed:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adityanath4735-svg/itzfizz-scroll-driven-hero.git
   cd itzfizz-scroll-driven-hero
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
itzfizz-scroll-driven-hero/
├── app/
│   ├── globals.css          # Design tokens, color system, and global reset
│   ├── layout.js            # Root layout with Inter font and SEO metadata
│   └── page.js              # Entry page mounting Hero and transition sections
├── components/
│   └── Hero.jsx             # Master hero component (GSAP timeline, SVG car, HUD, Web Audio)
├── next.config.mjs          # Next.js build configuration
├── postcss.config.mjs       # Tailwind CSS v4 PostCSS plugin
├── package.json             # Project dependencies and npm scripts
└── README.md                # Project documentation
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles an optimized static/production build |
| `npm run start` | Starts the production server |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Designed & developed by [Aditya Nath](https://github.com/adityanath4735-svg).
