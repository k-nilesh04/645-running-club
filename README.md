# 645 Run Club

A full-stack platform for running a community, managing members, and organising weekly runs. Built for **645 Run Club** — a Sunday running community that meets at Dwarka Sector 19B Park at 6:15 AM.

[Live website](https://645-running-club.vercel.app) · [Instagram](https://instagram.com/645_runclub)

## Highlights

- Responsive public website with run details, club information, map, FAQs, and member discovery
- Secure sign-up, email verification, sign-in, profile management, and protected routes
- Weekly run registration and personal registration history
- Membership and payment workflows
- Administrator dashboard for runs, attendance, members, and club knowledge
- Club-only chatbot backed by administrator-managed knowledge entries
- First-party, HTTP-only cookie sessions with sign-in throttling, account lockouts, OTP limits, and CSRF protection
- Production-ready Vercel-to-Render API proxy to avoid third-party-cookie session failures

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcryptjs, email verification |
| Email | Brevo, Resend, or Gmail SMTP |
| Payments | Razorpay |
| Deployment | Vercel (frontend) and Render (backend) |

## Project Structure

```text
645-running-club/
├── frontend/                 # React + Vite client
│   ├── src/
│   │   ├── api/              # Axios client and API functions
│   │   ├── components/       # Shared UI, auth, chatbot, navigation
│   │   └── pages/            # Public, member, and admin pages
│   └── vercel.json           # First-party /api proxy for production
│
├── backend/                  # Express API
│   ├── controller/           # Route handlers
│   ├── middlewares/          # Auth, rate limiting, CSRF guards
│   ├── models/               # MongoDB schemas
│   ├── route/                # API routes
│   ├── services/             # Chatbot services
│   └── utils/                # Database, email, and auth helpers
│
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB database or MongoDB Atlas connection string
- An email provider for account verification

### 1. Clone and install

```bash
git clone https://github.com/k-nilesh04/645-running-club.git
cd 645-running-club

npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Create a backend environment file:

```bash
cp backend/.env.example backend/.env
```

Create a frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

For local development, set the frontend API URL to:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the app

From the repository root:

```bash
npm start
```

Or run each service separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The Vite app runs on `http://localhost:5173` by default and the API runs on `http://localhost:5000`.

## Environment Variables

### Backend

Never commit real credentials. Configure these in `backend/.env` locally and in Render for production.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/645-run-club

# Use a long random value in every environment.
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d

# Exact allowed frontend origin(s), comma-separated when needed.
FRONTEND_ORIGIN=http://localhost:5173
TRUST_PROXY_HOPS=0
```

### Brevo email verification

Brevo is supported for verification emails. Set a verified sender address in your Brevo account.

```env
EMAIL_FROM=645 Run Club <verified-sender@yourdomain.com>
BREVO_API_KEY=your_brevo_api_key
```

Resend is preferred when `RESEND_API_KEY` is configured. Gmail SMTP can be used as a fallback with `EMAIL_USER` and an app password.

### Optional services

```env
# Chatbot
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
CHAT_MAX_MESSAGE_LENGTH=1000
CHAT_RATE_LIMIT_MAX=20
CHAT_RATE_LIMIT_WINDOW_MS=60000

# Payments
# Configure the matching Razorpay values required by your payment provider setup.
```

### Frontend

```env
# Local development
VITE_API_BASE_URL=http://localhost:5000/api

# Optional public Razorpay key
VITE_RAZORPAY_KEY=
```

## Deploying

### Backend on Render

1. Create a Render Web Service from this repository.
2. Set the service root directory to `backend`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add the backend environment variables above.
5. Set `NODE_ENV=production`.
6. Set `FRONTEND_ORIGIN` to the exact Vercel site URL, without a trailing slash.
7. Set `TRUST_PROXY_HOPS=1` when the service is behind Render's proxy.

### Frontend on Vercel

1. Import the repository and use `frontend` as the root directory.
2. Set this production environment variable:

   ```env
   VITE_API_BASE_URL=/api
   ```

3. Redeploy.

The included `frontend/vercel.json` forwards `/api/*` to the Render API. The browser therefore communicates with the Vercel domain, allowing secure session cookies to remain first-party. Do not set the production frontend URL directly to the Render API.

## Security Model

- Passwords are hashed with bcrypt before storage.
- Authentication uses signed JWTs held in HTTP-only, secure cookies.
- The frontend does not store JWTs in browser storage.
- Sign-in and verification routes are rate limited.
- Repeated incorrect password attempts temporarily lock the account.
- Verification codes expire, have resend cooldowns, and have limited attempts.
- Protected routes validate the token signature, issuer, audience, and current user record.
- Production API writes require an application request header to reduce CSRF risk.
- CORS permits only configured frontend origins.

## API Areas

| Area | Purpose |
| --- | --- |
| `/api/user` | Sign-up, sign-in, sign-out, profile |
| `/api/verification` | Email verification codes |
| `/api/runs` | Run discovery and registration |
| `/api/payment` | Membership and payment workflows |
| `/api/admin` | Protected administration operations |
| `/api/chat` | Run Club chatbot and knowledge management |
| `/api/health` | Service health check |

## Testing

Run backend tests with:

```bash
cd backend
npm test
```

## Contributing

1. Create a branch from `main`.
2. Make a focused change with clear commit messages.
3. Run the relevant tests and build checks.
4. Open a pull request with a concise description of the change.

## License

This project is private to 645 Run Club unless the repository owner specifies otherwise.
