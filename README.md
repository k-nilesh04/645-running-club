# 645 Run Club

645 Run Club is a full-stack running club platform built with the MERN stack. The project provides a structured digital experience for club members, administrators, and run organizers, covering authentication, memberships, run registration, attendance, payments, announcements, profiles, and verification.

## Overview

The platform is designed to support the operational needs of a running community through a dedicated web application and REST API.

The current implementation is organized into two applications:

- `frontend` — React-based client application powered by Vite
- `backend` — Express and MongoDB REST API

The root project includes a shared development command for running both applications concurrently.

## Core Capabilities

- User registration and authentication
- JWT-based authentication and protected routes
- Password hashing with bcrypt
- User profile management
- Membership management
- Run creation and registration
- Run attendance tracking
- Payment processing workflows
- Email-based verification and communication
- Club announcements
- Administrative dashboard functionality
- Admin authorization and protected administrative operations
- Backend API testing

## Architecture

```text
645-running-club/
├── backend/
│   ├── controller/
│   ├── middlewares/
│   ├── models/
│   ├── route/
│   ├── tests/
│   ├── utils/
│   ├── .env.example
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── index.html
│
├── package.json
└── README.md
```

## Technology Stack

### Frontend

- React 18
- React Router
- Vite
- Tailwind CSS
- Axios
- Vercel Analytics

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Nodemailer
- Cookie Parser
- CORS
- dotenv

### Development and Testing

- Nodemon
- Node.js test runner
- Git and GitHub

The frontend dependencies and build tooling are defined in `frontend/package.json`, while the backend uses Express, Mongoose, JWT, bcryptjs, Nodemailer, and related server-side packages.

## Data Models

The backend currently defines models for the core club domain, including:

- Users
- Memberships
- Runs
- Attendance
- Payments
- Announcements

This structure separates club operations into focused domain models and provides a foundation for extending the platform as the community grows.

## API Structure

The backend follows a controller, model, middleware, and route-based architecture.

```text
Request
  |
  v
Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Model
  |
  v
MongoDB
```

Dedicated routes and controllers are provided for authentication and users, runs, payments, administration, and verification.

## Security

The application includes several security-oriented mechanisms:

- JWT authentication
- Password hashing with bcryptjs
- Authentication middleware for protected endpoints
- Separate administrator authorization middleware
- Environment variables for configuration and secrets
- CORS configuration
- Cookie parsing for authentication-related workflows

Sensitive configuration should be provided through environment variables and never committed to the repository.

## Local Development

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB or a MongoDB connection string
- Git

### Clone the repository

```bash
git clone https://github.com/k-nilesh04/645-running-club.git
cd 645-running-club
```

### Configure environment variables

Create environment files using the provided examples:

```text
backend/.env.example
frontend/.env.example
```

Copy the required variables into the corresponding `.env` files and provide your local configuration.

### Install dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Run the project

From the project root:

```bash
npm start
```

The root start script launches the backend and frontend development servers concurrently. fileciteturn3file0

Alternatively, run them independently:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Testing

Backend tests can be executed with:

```bash
cd backend
npm test
```

The repository includes tests covering administrative dashboard functionality and email-sending behavior.

## Production Build

Build the frontend with:

```bash
cd frontend
npm run build
```

Preview the production frontend locally with:

```bash
npm run preview
```

## Project Status

645 Run Club is an active full-stack project and is being developed as a production-oriented platform for managing a running community.

The architecture is intentionally modular so additional member, event, payment, communication, and administrative capabilities can be added without restructuring the entire application.

## Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the changes locally.
5. Commit your work with a clear commit message.
6. Open a pull request describing the changes.

## Author

Developed by [K Nilesh](https://github.com/k-nilesh04).

Repository: [k-nilesh04/645-running-club](https://github.com/k-nilesh04/645-running-club)
