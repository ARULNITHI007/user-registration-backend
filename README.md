# Local MySQL User Registration (Frontend + Node.js Backend)

This project is prepared to run with **Local MySQL** (for example: XAMPP, MAMP, or a local MySQL server).

## What you get
- `index.html` + `style.css` — simple frontend form
- `server.js` — Express backend that hashes passwords and stores users in MySQL
- `package.json`
- `.env.example` — example environment variables
- `db.sql` — optional SQL to create DB and table
- This README with step-by-step instructions

---

## Prerequisites
- Node.js (v14+)
- MySQL server (XAMPP, MAMP, or local installation)
- Optional: Git (if you clone repo)

---

## Quick start (Windows with XAMPP)
1. Start MySQL (use XAMPP control panel).
2. (Optional) Create the database manually using `db.sql` with a MySQL client:
   - Open `phpMyAdmin` or MySQL CLI and run `db.sql`.
   - OR let the server create it automatically on start.
3. Copy `.env.example` to `.env` and change values if needed.
4. Install Node dependencies:
```bash
npm install
```
5. Start the backend:
```bash
node server.js
```
You should see `🚀 Server running on http://localhost:3000` and messages about DB/table readiness.

6. Open `index.html` in your browser (double-click the file). Enter an email and password and submit.
   - The frontend sends a POST to `http://localhost:3000/register`.
   - If you get a CORS or connection error, make sure `server.js` is running and that MySQL is up.

---

## Notes & Security
- Passwords are hashed using `bcryptjs` before saving.
- This setup is for learning / local development only. For production deployments:
  - Use secure environment variables.
  - Use HTTPS.
  - Use stronger validation and rate-limiting.
  - Use an external managed database for production.

---

## Troubleshooting
- `Error connecting to server`: ensure Node server is running.
- `Access denied for user 'root'@'localhost'`: check MySQL username/password in `.env`.
- `Email already registered`: duplicate email constraint — try a different email.

---

If you want, I can also:
- Prepare a version that works with a free online MySQL (for deployment).
- Show step-by-step how to deploy backend (Render/Heroku) and frontend (Netlify/Neocities).
