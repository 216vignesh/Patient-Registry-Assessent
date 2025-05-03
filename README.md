# Patient Registration App
A fully frontend-only patient registration and query interface built using:

- **React** for UI and app logic
- **MUI (Material UI)** for UI components and theming
- **PGlite (via ElectricSQL)** for persistent SQL-based storage (in-browser)
- **BroadcastChannel API** for multi-tab sync
- **Vite** for fast local development
- **Deployed on**: Vercel

## Features
- Register new patients with text field validations (example: validate proper email format, phone number, etc.)
- View all patients in a searchable table
- SQL tab to run any custom queries using SQL
- Filter user tab for searching and filtering users based on various fields (users returned using SQL queries)
- Local persistent storage using `IndexedDB`
- Multi-tab sync using `BroadcastChannel`
- No backend — all data lives securely in the browser

## How to run
### 1. Clone the repository

    git clone https://github.com/216vignesh/Patient-Registry-Assessent.git
    cd Patient-Registry-Assessent


###  2. Install dependencies

    npm install

###  3. Start development server

    npm run dev

###  4. Start development server

    Visit http://localhost:5173

## Challenges faced
    Key hurdles included getting PGlite to run reliably in a Vite build (we had to exclude the WASM bundle from Vite’s optimizer), sharing a single Postgres instance across multiple tabs (solved with a SharedWorker plus BroadcastChannel refreshes). I also fixed an off‑by‑one Date Of Birth bug caused by UTC parsing, trimmed bundle size impact with preload hints, and switched to case‑insensitive searches using ILIKE/LOWER(). Together these tweaks made the app stable and multi‑tab aware.



