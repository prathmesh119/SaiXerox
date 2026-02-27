# SaiXerox – Print & Xerox Shop

A full-stack website for a print and Xerox shop: customers can place orders online, pay via **PhonePe Payment Gateway** (UPI/cards), and track status. Admin dashboard to update order status. Black & yellow theme, responsive (PC and mobile).

## Features

- **Home** – Hero, features, CTAs
- **Services** – List of print/Xerox services and pricing
- **Place Order** – Upload document (PDF/image), choose service, copies, pay online
- **Track Order** – Enter order ID + email to see status
- **Admin** – Password-protected dashboard to list orders and update status (pending → paid → processing → ready → collected)
- **Payments** – PhonePe hosted pay page (redirect) for UPI/cards

## Tech

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Storage:** JSON file (`server/data/orders.json`)
- **Payments:** PhonePe PG (UPI, cards)
- **Uploads:** Local `server/uploads/`

## Setup

1. **Install**

   ```bash
   npm install
   ```

   This installs root and `client` dependencies.

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `FRONTEND_URL` – e.g. `http://localhost:5173` in dev, your live URL in production
   - `BACKEND_URL` – e.g. `http://localhost:3001` in dev, your live API base URL in production
   - `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX`, `PHONEPE_HOST_URL` – from your PhonePe PG sandbox / production dashboard
   - `ADMIN_PASSWORD` – password for `/admin`

3. **Run**

   - Dev (client + server):

     ```bash
     npm run dev
     ```

     - App: http://localhost:5173  
     - API: http://localhost:3001  

   - Production:

     ```bash
     npm run build
     npm start
     ```

     Serves the built app and API from the same server (e.g. port 3001).

## Payments (PhonePe)

- Without PhonePe env vars: orders are created but no payment link; you can still use the app and admin.
- With valid PhonePe sandbox/production credentials set in `.env`:
  - After placing an order the user is redirected to the PhonePe hosted payment page.
  - After payment, PhonePe redirects back to the backend callback, which verifies the transaction and marks the order **paid**, then sends the user to `/order/success?orderId=...`.
  - Currency is **INR**; make sure your PhonePe account is configured for INR payments.

## Admin

- Open `/admin`, enter `ADMIN_PASSWORD`.
- View all orders and change status (pending / paid / processing / ready / collected).
- Default password in `.env.example` is `admin123` – change it in production.

## Mobile

The UI is responsive; use the same URLs on mobile. The header collapses to a hamburger menu on small screens.

## Optional

- Replace JSON store with a database (e.g. SQLite, PostgreSQL) for production.
- Add email notifications (e.g. order confirmation, status updates) via SendGrid, Resend, etc.
