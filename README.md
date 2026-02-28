# IoT Hackathon – Dhanalakshmi Srinivasan Engineering College

A beautiful orange & white themed hackathon registration website built with Next.js.

## Features

- **Individual Registration**: Name, Roll No, Year, Branch, Phone, Payment screenshot
- **Payment**: UPI/PhonePe integration (shraddhagroup123@ybl) — opens UPI app, paste/upload payment screenshot
- **Team Formation**: 4–5 members per team, merge by roll numbers, unique team names
- **Validation**: Students cannot be in multiple teams
- **Prerequisites**: Laptop, VSCode, Node.js, Git
- **Problem Statements**: First year (Human Nutrition Tips), Second year (Health Management System), Third year (Tenant Architecture)
- **Contact**: Frontend & Backend team contact details

**Dates**: 26, 27, 28 February 2026

**Collaboration**: Shraddha × RTIH. Add logos as `public/shraddha-logo.png` and `public/rtih-logo.png` (shows fallback text until added).

**Pages**: `/team` — Shraddha Developers (name, mobile, email, role) | `/queries-tech` — Queries & Tech Stack per problem

**Admin**: Secret URL `/admin/<ADMIN_SECRET>` — View all registrations (name, roll no, year, branch, phone, screenshot, team). Set `ADMIN_SECRET` in `.env` (e.g. `ADMIN_SECRET=k8mN2pQ7xR4fL9`). Change it to your own random string!

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure `.env` has `DATABASE_URL` and `ADMIN_SECRET` (random string for admin page URL).

3. Push schema to database:
   ```bash
   npx prisma db push
   ```

4. Update contact details in `lib/constants.ts` with your team names and mobile numbers.

5. Run development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16, React 19, TypeScript
- Prisma ORM + PostgreSQL
- Tailwind CSS
