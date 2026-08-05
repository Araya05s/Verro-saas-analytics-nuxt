# Verro Saas Analytics Front-End Focused Project

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-State_Management-FFE56D?logo=vuedotjs&logoColor=black)](https://pinia.vuejs.org/)
[![Vercel Status](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://your-app-name.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A high-performance, responsive SaaS analytics platform featuring real-time data visualization filtering with state persistence and modular composable architecture. Built with Nuxt 4, Tailwind CSS, and Pinia.


**[View Live Front-End Demo](https://your-app-name.vercel.app)** |

---

## Overview & Key Features
![Verro Saas Dashboard Screenshot](https://raw.githubusercontent.com/Araya05s/Verro-saas-analytics-nuxt/main/public/screenshots/dashboard-preview.png)

### Core Features
* **Interactive Analytics Data Visualization:** Dynamic user metrics and charts using Chart.JS with custom date-range controls.
* **Optimized Nuxt 4 Architecture:** Leveraging Nuxt 4's updated directory structure, and server engine for quick navigation.
* **Hybrid Data Flow (Mock API & Composable Strategy):**
  * **Composable-driven Mocks:** Custom composables to simulate real API data with network latencies and pagination.
  * **Pinia Centralized Store:** Manages active filters, user auth state, and metric views across route switches.
* 🎨 **Tailwind CSS Design System:** Fully custom UI design system with dark/light mode and unique accent colors.
* 🛡️ **Type-Safe Component Architecture:** Built end-to-end with TypeScript for prop validation and composable return types.

---

## Tech Stack & Key Libraries

| Layer | Technology | Key Usage |
| :--- | :--- | :--- |
| **Framework** | Nuxt 4 | Quickk navigation, file-based routing |
| **State Management** | Pinia | Global filter states, user preference persistence |
| **Styling** | Tailwind CSS | Custom utility components with dynamic themes |
| **Data Visualization** | Chart.js | Responsive chart primitives wrapped in Vue components |
| **Data Layer** | Vue Composables + TypeScript | Mock API with async state management (`pending`, `error`, `data`) |
| **Hosting** | Vercel | Edge deployment, automatic previews |

---

## 📌 Current Limitations & Known Issues

Since this is a living project under active development, please note:
* **Interactive Filters:** Date range pickers currently use fallback mock states while the main Pinia store is being finalized.
* **Mobile View:** Mobile drawer navigation is functional, but chart layout optimizations for screens `< 640px` are still in progress.
* **Mock Datas:** Mocks data are currently working at tsome pages, but some of them are still ongoing process.

---

## Local Setup & Development

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation] (https://nuxt.com/docs/getting-started/deployment) from Nuxt 4.x for more information.

---

# License
Distributed under the MIT License. See LICENSE for details.