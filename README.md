# space-university
Pure JavaScript single page app. Benefits from Kinvey as BaaS &amp; ...
---
🧠 The Core Idea
Your GitHub Pages app does not talk directly to GitHub.
Instead:

Code
GitHub Pages (JS app) => (Kinvey user token) 

Kinvey Custom Endpoint / Business Logic => (secure GitHub token) 

GitHub API => creates Issue 
        ↓ 
GitHub Webhook → Azure Function 

This gives you:

secure GitHub token storage (never exposed to frontend)

Kinvey authentication (only logged‑in users allowed)

server‑side validation (spam protection)

Azure Function triggers (post‑processing)
