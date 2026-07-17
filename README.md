# 645 Dwarka Chapter Running Club - MERN Stack

Full MERN implementation (MongoDB, Express, React, Node) of the running club website:
Home (hero, subscription, benefits, testimonials, FAQ), About, and Members pages, built
with React Router and React Hooks (`useState`, `useEffect`, `useMemo`, custom `useMembers` hook).

## Project structure

```text
645-running-club-mern/
|-- backend/          Express + MongoDB API
|   |-- config/db.js
|   |-- models/        Member.js, Subscriber.js
|   |-- controllers/    memberController.js, subscribeController.js
|   |-- routes/         members.js, subscribe.js
|   |-- seed.js         seeds sample members
|   `-- server.js
|
`-- frontend/         React + Vite + Tailwind + React Router
    `-- src/
        |-- components/ Navbar, Footer, Hero, SubscriptionCard, MemberCard, FAQ
        |-- pages/       Home, About, Members, NotFound
        |-- hooks/       useMembers.js
        |-- data/        members.js (fallback data)
        |-- api/         api.js (axios client)
        `-- App.jsx, main.jsx, index.css
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI (local or MongoDB Atlas)
npm run seed   # optional: populate sample members
npm run dev    # starts on http://localhost:5000
```

Requires MongoDB running locally (`mongod`) or a MongoDB Atlas connection string in `.env`.
If `MONGO_URI` is missing, the server still starts and database-backed routes return `503`.

### API endpoints

| Method | Route                         | Description               |
| ------ | ----------------------------- | ------------------------- |
| GET    | `/api/members`                | List members (`?search=`) |
| GET    | `/api/members/:id`            | Get single member         |
| POST   | `/api/members`                | Create member             |
| PUT    | `/api/members/:id`            | Update member             |
| DELETE | `/api/members/:id`            | Delete member             |
| GET    | `/api/members/leaderboard/top`| Top 10 runners by distance|
| POST   | `/api/subscribe`              | Subscribe                 |
| GET    | `/api/subscribe`              | List subscribers          |

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL should point to your backend, e.g. http://localhost:5000/api
npm run dev    # starts on http://localhost:5173
```

If the backend is not running, the Members page automatically falls back to sample
data in `src/data/members.js` so the UI still works.

## 3. Add your own images

Drop `hero.jpg`, `logo.png`, `tshirt.png`, `cap.png`, `medal.png` into `frontend/public/`.
The Hero component already references `/hero.jpg`.

## 4. Deploying

- Backend: Railway, Render, or Fly.io. Set `MONGO_URI` (MongoDB Atlas) and `CLIENT_URL` env vars.
- Frontend: Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL.

## Color palette

| Name       | Hex       |
| ---------- | --------- |
| Primary    | `#0F9D58` |
| Dark       | `#1A1A1A` |
| White      | `#FFFFFF` |
| Light Gray | `#F5F5F5` |
| Accent     | `#FFD54F` |

Fonts: Poppins (display) + Inter (body), loaded via Google Fonts in `index.html`.

## Next steps / extra features to build on

- Dark/light mode toggle
- Animated stats counter, countdown timer to next Sunday run
- Gallery of previous runs, contact form
- Toast notifications, loading skeletons
- BMI calculator, Google Maps embed for the meetup location
