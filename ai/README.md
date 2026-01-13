## College-Only Marketplace App

Full-stack web application where verified college students can buy, sell, rent, or exchange items within their own college community.

### Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios, JWT auth
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Multer, Nodemailer

### Folder Structure

- `backend/` – Express API (MVC, JWT auth, email, file uploads)
- `frontend/` – React SPA (routing, auth, marketplace, admin)

### Getting Started

1. **Backend**
   - Copy `backend/.env.example` contents into `backend/.env` and fill values.
   - Install and run:
     - `cd backend`
     - `npm install`
     - `npm run dev`
2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

