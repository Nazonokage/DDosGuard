# Capstone PHP Backend + Frontend Task Tracker

**Progress: 14/15 complete**

## Backend Structure (capstonebackend/)
- [x] config.php (SQLite PDO + table init)
- [x] index.php (API router)
- [x] api/auth.php (register, login, check-session, logout)
- [ ] api/feedback.php (GET/POST/PUT/DELETE /api/feedback)
- [ ] api/profile.php (GET /api/profile, PUT /api/profile)
- [ ] .htaccess (optional clean URLs)

## Archive Folder
- [ ] mkdir archive/
- [ ] cp capstonebackend/db.sqlite archive/db_v1.sqlite (after testing)

## Frontend Updates
- [ ] package.json: proxy = "http://localhost:8080"
- [ ] src/api/axiosConfig.js: Remove CSRF/fetchCsrfToken, update baseURL if needed
- [ ] src/pages/LoginPage.js: Remove fetchCsrfToken()
- [ ] src/pages/RegisterPage.js: OK (no CSRF)
- [ ] src/pages/FeedbackPage.js: Fix user.uid → user.id, remove fetchCsrfToken()
- [ ] src/pages/AccountSettingsPage.js: Fix user.id, remove CSRF/retry
- [ ] src/context/AuthContext.js: OK
- [ ] src/components/navbar.js: Remove fetchCsrfToken() from logout

## Testing
- [ ] Backend: cd capstonebackend && php -S localhost:8080
- [ ] Test auth endpoints (Postman/curl)
- [ ] Frontend: npm start, test full flow
- [ ] Archive DB

Next: Create feedback.php + profile.php

