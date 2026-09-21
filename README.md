# Student Management System

A practical student management app for keeping student records, profiles, and access in one place. It has a React frontend for the day-to-day experience and an Express API for authentication, student data, image uploads, and dashboard statistics.

## Live App

- **Frontend:** https://student-management-p.vercel.app
- **Backend API:** https://backend-livid-kappa-qlu6p6x3dr.vercel.app

The frontend is deployed from `student-management/frontend` and the API is deployed from `student-management/backend`.

## What You Can Do

### Admin workspace

- Sign in securely with JWT authentication
- View dashboard statistics
- Search and review student records
- Add, edit, and remove students
- Upload student profile images through Cloudinary
- Manage active and inactive student accounts

### Student portal

- Sign in with student details
- View a personal profile and dashboard
- Change the account password

## Project Structure

```text
student-management/
├── backend/     Express API, MongoDB models, authentication, and uploads
└── frontend/    React and Vite application
```

## Run Locally

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

Create `backend/.env` with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

For local development, set the API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Build Checks

```bash
cd frontend
npm run build
npm run lint
```

## API Overview

- `POST /api/auth/login` - admin login
- `POST /api/auth/student-login` - student login
- `GET /api/students` - list students for authenticated users
- `GET /api/students/dashboard` - dashboard statistics
- `POST /api/students` - create a student as an admin
- `PUT /api/students/:id` - update a student as an admin
- `DELETE /api/students/:id` - delete a student as an admin

## Notes

- Never commit `.env` files or production secrets.
- The frontend needs `VITE_API_URL` set to the deployed backend URL in Vercel.
- The backend expects MongoDB and Cloudinary credentials to be configured in its deployment environment.
