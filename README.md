# DDoSGuard Flask Backend

## Project Structure
```
flaskbackend/
├── app.py            # App factory + entry point
├── config.py         # Config (reads from env vars)
├── database.py       # SQLAlchemy db instance
├── models.py         # User + Feedback models
├── auth_utils.py     # JWT helpers + login_required decorator
├── routes/
│   ├── auth.py       # POST /api/auth/register, /login, /logout | GET /api/auth/me
│   ├── profile.py    # GET/PUT /api/profile/
│   └── feedback.py   # CRUD /api/feedback/ and /api/feedback/<id>
├── requirements.txt
├── Procfile          # For Render/Railway
└── render.yaml       # Render deployment config
```

## API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET  | `/api/auth/me` | Yes | Get current user (replaces check-session) |
| POST | `/api/auth/logout` | No | Client discards token |
| GET  | `/api/profile/` | Yes | Get profile |
| PUT  | `/api/profile/` | Yes | Update profile |
| GET  | `/api/feedback/` | Yes | List all feedback |
| POST | `/api/feedback/` | Yes | Create feedback |
| PUT  | `/api/feedback/<id>` | Yes | Update own feedback |
| DELETE | `/api/feedback/<id>` | Yes | Delete own feedback |

Auth uses `Authorization: Bearer <token>` header.

---

## Deploy on Render (Free)

1. Push `flaskbackend/` to a GitHub repo
2. Go to https://render.com → New Web Service → connect repo
3. Set env vars in Render dashboard:
   - `DATABASE_URL` = `mysql+pymysql://if0_41371466:SFW1dIfgMrnE9@sql310.infinityfree.com/if0_41371466_capstone_db`
   - `JWT_SECRET_KEY` = any long random string
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app,http://localhost:3000`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`

---

## Frontend Changes Required

Replace these files in your React project:

| File | What changed |
|------|-------------|
| `src/api/axiosConfig.js` | New baseURL + JWT interceptor |
| `src/context/AuthContext.jsx` | Added `login()` / `logout()` helpers, reads JWT from localStorage |
| `src/pages/LoginPage.jsx` | Calls `/api/auth/login`, saves token |
| `src/pages/RegisterPage.jsx` | Calls `/api/auth/register` |
| `src/components/navbar.jsx` | Calls `/api/auth/logout`, uses `logout()` from context |
| `src/pages/AccountSettingsPage.jsx` | Calls `/api/profile/` routes |
| `src/pages/FeedbackPage.jsx` | Calls `/api/feedback/` routes |

### Add to Vercel env vars:
```
VITE_API_URL=https://your-flask-backend.onrender.com
```

---

## Local Development

```bash
cd flaskbackend
pip install -r requirements.txt
export DATABASE_URL="mysql+pymysql://..."
export JWT_SECRET_KEY="dev-secret"
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3080"
python app.py
```
