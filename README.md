# KaCollection — E-Commerce CAT Project

Working e-commerce web application for the **E-Commerce and Web Application** continuous assessment. Business topic: **KaCollection** (authentic Rwandan crafts, coffee and textiles). Prices are in **RWF**.

## Required modules covered

1. Home page and branding  
2. Product catalogue with categories, search/filter, availability  
3. Shopping cart (add, quantity, remove, totals)  
4. User accounts (register, login, logout; customer + admin roles)  
5. Checkout and orders with status tracking  
6. Simulated payment (Mobile Money, card, cash on delivery)  
7. Administrator dashboard (product CRUD + order status updates)  
8. Customer interaction (contact form, FAQ, WhatsApp link, product reviews)  
9. Responsive layout  
10. Basic security (bcrypt password hashes, validation, admin route protection)

## Tech stack

- Next.js (App Router) + React + TypeScript  
- SQLite via `better-sqlite3`  
- Tailwind CSS  
- JWT session cookies (`jose`) + `bcryptjs`

## Setup

```bash
npm install
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role     | Email                      | Password      |
|----------|----------------------------|---------------|
| Admin    | admin@kacollection.rw      | Admin123!     |
| Customer | customer@kacollection.rw   | Customer123!  |

## Database export

The SQLite file is created at `data/kacollection.db` after seeding. Include that file in your group submission zip together with the project source.

## Free hosting (Render)

This project is set up for a free **Render** Web Service (`render.yaml`).

1. Push this repo to GitHub.
2. Sign up at [https://render.com](https://render.com) and connect GitHub.
3. **New → Blueprint** (or Web Service) and select this repository.
4. Use the Free plan. Render will build and give you a URL like `https://kacollection.onrender.com`.

Note: free services sleep after ~15 minutes idle (first load can take ~1 minute). Local SQLite resets when the service sleeps, so demo data is re-seeded on startup.

## Project report

Write the Word/PDF report separately using section 5 of the CAT instructions (cover page, introduction, system description, design, screenshots, challenges, contributions, references). Acknowledge this stack and any Unsplash product images used.
