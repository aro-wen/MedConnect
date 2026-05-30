<div align="center">

<a href="https://med-connect-five.vercel.app" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/MedConnect-0D9488?style=for-the-badge&logo=stethoscope&logoColor=white" alt="MedConnect" /></a>

# 🩺 MedConnect

### _Modern Telehealth Platform — Connect with Doctors, Anytime, Anywhere_

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [Patient Module](#patient-module)
  - [Doctor Module](#doctor-module)
  - [System Features](#system-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Demo Credentials](#demo-credentials)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🌟 Overview

**MedConnect** is a full-stack telehealth web application built for the **WC Launchpad 2026 Builder Round**. It bridges the gap between patients and healthcare providers through a seamless, secure, and intuitive digital platform.

> 🏆 _"Healthcare should be accessible, not complicated."_

Patients can discover specialists, book video consultations, manage medical records, and receive intelligent health recommendations. Doctors can manage their schedules, conduct virtual consultations, and maintain comprehensive patient records — all in one unified platform.

---

## ✨ Features

### Patient Module

| Feature                          | Status      | Description                                                                                                            |
| -------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| 🔐 **Account Registration**      | ✅ Complete | Secure email/password registration with role-based access                                                              |
| 👤 **Profile Management**        | ✅ Complete | Full profile editing: name, birthday, weight, height, blood type, allergies, medical history, contact details, address |
| 🔍 **Doctor Discovery**          | ✅ Complete | Browse all specialists with detailed profiles, ratings, and experience                                                 |
| 🤖 **AI Symptom Recommendation** | ✅ Complete | Keyword-based symptom analysis suggesting relevant specialties (e.g., "chest pain" → Cardiology)                       |
| 🔎 **Advanced Filtering**        | ✅ Complete | Filter by name, specialization, or bio; search across all doctor fields                                                |
| 📅 **Smart Booking**             | ✅ Complete | Book appointments only during doctor's available days and time slots                                                   |
| 🔄 **Reschedule & Cancel**       | ✅ Complete | Full appointment lifecycle management with status tracking                                                             |
| 🔔 **Real-time Notifications**   | ✅ Complete | Browser push + toast + in-app notifications for all status changes                                                     |
| ⏰ **Smart Reminders**           | ✅ Complete | Automated reminders at 1 day, 1 hour, and 30 minutes before appointments                                               |
| 📹 **Video Consultation**        | ✅ Complete | Integrated Jitsi Meet for secure, browser-based video calls                                                            |
| 📋 **Medical Records**           | ✅ Complete | View diagnosis, prescriptions, and doctor notes from completed consultations                                           |
| 📜 **Appointment History**       | ✅ Complete | Complete consultation history with status badges and filtering                                                         |

### Doctor Module

| Feature                        | Status      | Description                                                                       |
| ------------------------------ | ----------- | --------------------------------------------------------------------------------- |
| 🔐 **Doctor Registration**     | ✅ Complete | Registration with specialization, bio, and professional details                   |
| 👨‍⚕️ **Profile Management**      | ✅ Complete | Edit specialization, bio, experience, education, license number, consultation fee |
| 📅 **Schedule Management**     | ✅ Complete | Set weekly availability by day with custom start/end times                        |
| 🚫 **Block Time Slots**        | ✅ Complete | Toggle availability on/off for any scheduled slot                                 |
| ✅ **Confirm Appointments**    | ✅ Complete | Review and confirm pending patient bookings                                       |
| 📝 **Complete Consultations**  | ✅ Complete | Add diagnosis, prescription, and notes; auto-creates medical record               |
| 📹 **Video Consultation**      | ✅ Complete | Join secure video calls with patients via Jitsi Meet                              |
| 📋 **Patient Records**         | ✅ Complete | Access all medical records for consultations you've conducted                     |
| 🔔 **Real-time Notifications** | ✅ Complete | Instant alerts for new bookings, cancellations, and reschedules                   |

### System Features

| Feature                    | Status      | Description                                                            |
| -------------------------- | ----------- | ---------------------------------------------------------------------- |
| 🔒 **JWT Authentication**  | ✅ Complete | Secure token-based auth with 7-day expiry and bcrypt password hashing  |
| 🎭 **Role-Based Access**   | ✅ Complete | Separate portals for Patients and Doctors with protected routes        |
| 🔔 **Notification System** | ✅ Complete | Multi-layered: Browser Push API + Sonner Toasts + In-App Bell Dropdown |
| 📊 **Status Tracking**     | ✅ Complete | PENDING → CONFIRMED → COMPLETED / CANCELLED / RESCHEDULED              |
| 🗄️ **Database**            | ✅ Complete | PostgreSQL with Prisma ORM, fully relational schema                    |
| 🎨 **Responsive UI**       | ✅ Complete | Mobile-first design with Tailwind CSS and shadcn/ui components         |

---

## 🛠 Tech Stack

### Frontend

| Technology                                    | Version | Purpose                                    |
| --------------------------------------------- | ------- | ------------------------------------------ |
| [Next.js](https://nextjs.org/)                | 16.2.6  | Full-stack React framework with App Router |
| [React](https://react.dev/)                   | 19.2.4  | UI component library                       |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type-safe development                      |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.x     | Utility-first CSS framework                |
| [shadcn/ui](https://ui.shadcn.com/)           | latest  | Accessible, composable UI components       |
| [Radix UI](https://www.radix-ui.com/)         | latest  | Unstyled accessible primitives             |
| [Lucide React](https://lucide.dev/)           | latest  | Beautiful icon library                     |
| [Sonner](https://sonner.emilkowal.ski/)       | latest  | Toast notifications                        |

### Backend

| Technology                                                                                         | Version    | Purpose                    |
| -------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | 16.2.6     | RESTful API endpoints      |
| [PostgreSQL](https://www.postgresql.org/)                                                          | 15+        | Relational database        |
| [Prisma](https://www.prisma.io/)                                                                   | 5.22.0     | Type-safe ORM              |
| [Neon](https://neon.tech/)                                                                         | Serverless | Managed PostgreSQL hosting |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                                         | 9.x        | JWT authentication         |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)                                                   | 3.x        | Password hashing           |

### Third-Party Services

| Service                            | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| [Jitsi Meet](https://meet.jit.si/) | Video conferencing (iframe integration) |
| [Dicebear](https://dicebear.com/)  | Avatar generation                       |
| [Vercel](https://vercel.com/)      | Deployment & hosting                    |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Patient    │  │    Doctor    │  │  Public (Auth)   │  │
│  │    Portal    │  │    Portal    │  │  Login/Register  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     API LAYER (Next.js)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ /api/   │ │ /api/   │ │ /api/   │ │ /api/   │ │ /api/ │ │
│  │register │ │ login   │ │appoint- │ │ doctors │ │records│ │
│  └─────────┘ └─────────┘ │ ments   │ └─────────┘ └───────┘ │
│                          └─────────┘                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────────────┐ │
│  │ /api/   │ │ /api/   │ │ /api/   │ │ /api/             │ │
│  │patient/ │ │doctor/  │ │doctor/  │ │notifications      │ │
│  │profile  │ │profile  │ │schedule │ │                   │ │
│  └─────────┘ └─────────┘ └─────────┘ └───────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   DATA LAYER (Prisma + Neon)                 │
│  ┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │  User   │ │   Patient   │ │   Doctor    │ │Appointment│ │
│  │         │ │   Profile   │ │   Profile   │ │           │ │
│  └─────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│  ┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │Medical  │ │ Availability│ │ Notification│ │   ...     │ │
│  │ Record  │ │             │ │             │ │           │ │
│  └─────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **PostgreSQL** database (local or [Neon](https://neon.tech/) free tier)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/aro-wen/MedConnect.git
cd MedConnect

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Optional: Public app URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ **Security Note:** Change `JWT_SECRET` to a cryptographically secure random string before deploying to production.

### Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed demo data (doctors, patients, appointments)
npx prisma db seed

# Optional: Launch Prisma Studio for data inspection
npx prisma studio
```

### Demo Credentials

The project includes seeded demo doctor accounts (created by the seeding script). Use these to sign in as a doctor in the demo environment:

- **Dr. Sarah Smith** — Email: dr.smith@telehealth.com Password: password123
- **Dr. Michael Johnson** — Email: dr.johnson@telehealth.com Password: password123
- **Dr. Emily Lee** — Email: dr.lee@telehealth.com Password: password123
- **Dr. Raj Patel** — Email: dr.patel@telehealth.com Password: password123
- **Dr. Carlos Garcia** — Email: dr.garcia@telehealth.com Password: password123
- **Dr. Lisa Chen** — Email: dr.chen@telehealth.com Password: password123
- **Dr. James Wilson** — Email: dr.wilson@telehealth.com Password: password123
- **Dr. Amanda Brown** — Email: dr.brown@telehealth.com Password: password123

Patient demo account (use to sign in as a patient):

- **Jane Doe (Patient)** — Email: janedoe.patient@demo.com Password: test123!

Note: Run `npx prisma db seed` or call the seed API (`POST /api/seed`) to recreate these demo accounts.

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
MedConnect/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Demo data seeding script
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # REST API routes
│   │   │   ├── appointments/  # Appointment CRUD + reschedule
│   │   │   ├── doctors/       # Doctor listing + availability
│   │   │   ├── login/         # Authentication
│   │   │   ├── register/      # User registration
│   │   │   ├── records/       # Medical records
│   │   │   ├── notifications/ # Notification CRUD
│   │   │   ├── patient/
│   │   │   │   └── profile/   # Patient profile API
│   │   │   └── doctor/
│   │   │       ├── profile/   # Doctor profile API
│   │   │       └── schedule/  # Schedule management API
│   │   ├── doctor/            # Doctor portal pages
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   ├── schedule/
│   │   │   ├── profile/
│   │   │   ├── records/
│   │   │   └── consultation/
│   │   ├── patient/           # Patient portal pages
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── appointments/
│   │   │   ├── profile/
│   │   │   ├── records/
│   │   │   └── consultation/
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles + Tailwind
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navbar.tsx         # Navigation bar
│   │   ├── notification-button.tsx  # Notification bell dropdown
│   │   ├── reschedule-dialog.tsx    # Reschedule modal
│   │   └── protected-route.tsx      # Auth guard wrapper
│   └── lib/
│       ├── auth.ts            # JWT + bcrypt utilities
│       ├── auth-context.tsx   # React auth context
│       ├── prisma.ts          # Prisma client singleton
│       ├── notifications.ts   # Notification system
│       └── utils.ts           # Helper functions
├── .env                       # Environment variables
├── next.config.js             # Next.js configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint        | Description                            |
| ------ | --------------- | -------------------------------------- |
| `POST` | `/api/register` | Create new account (patient or doctor) |
| `POST` | `/api/login`    | Authenticate and receive JWT token     |

### Appointments

| Method  | Endpoint                                 | Description                             |
| ------- | ---------------------------------------- | --------------------------------------- |
| `GET`   | `/api/appointments?role=PATIENT\|DOCTOR` | List appointments                       |
| `POST`  | `/api/appointments`                      | Book new appointment                    |
| `PATCH` | `/api/appointments/:id`                  | Update status (confirm/cancel/complete) |
| `PUT`   | `/api/appointments/:id/reschedule`       | Reschedule appointment                  |

### Doctors

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| `GET`  | `/api/doctors`                  | List all doctors                 |
| `GET`  | `/api/doctors/:id/availability` | Get doctor's public availability |

### Profiles

| Method   | Endpoint                   | Description              |
| -------- | -------------------------- | ------------------------ |
| `GET`    | `/api/patient/profile`     | Get patient profile      |
| `PUT`    | `/api/patient/profile`     | Update patient profile   |
| `GET`    | `/api/doctor/profile`      | Get doctor profile       |
| `PUT`    | `/api/doctor/profile`      | Update doctor profile    |
| `GET`    | `/api/doctor/schedule`     | Get doctor's schedule    |
| `POST`   | `/api/doctor/schedule`     | Add availability slot    |
| `PATCH`  | `/api/doctor/schedule/:id` | Toggle slot availability |
| `DELETE` | `/api/doctor/schedule/:id` | Remove slot              |

### Records

| Method | Endpoint                            | Description                 |
| ------ | ----------------------------------- | --------------------------- |
| `GET`  | `/api/records?role=PATIENT\|DOCTOR` | List medical records        |
| `POST` | `/api/records`                      | Create record (doctor only) |

### Notifications

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| `GET`  | `/api/notifications` | Get user's notifications     |
| `POST` | `/api/notifications` | Mark as read (single or all) |

---

## 📸 Screenshots

<div align="center">

|                 Patient Dashboard                 |                    Doctor Dashboard                    |
| :-----------------------------------------------: | :----------------------------------------------------: |
| _Browse doctors, book appointments, view records_ | _Manage schedule, confirm bookings, add prescriptions_ |

| Booking Flow | Video Consultation |
| _AI symptom recommendation + smart scheduling_ | _Secure Jitsi Meet integration_ |

</div>

---

## 🌐 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Environment Setup on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - `DATABASE_URL` — Your Neon PostgreSQL connection string
   - `JWT_SECRET` — Secure random string

### Database Migration on Deploy

```bash
# Run migration against production database
npx prisma migrate deploy
```

---

## 🗺 Roadmap

- [x] Patient & Doctor authentication
- [x] Profile management (both roles)
- [x] Doctor discovery with AI symptom recommendation
- [x] Smart appointment booking with availability validation
- [x] Reschedule & cancellation with notifications
- [x] Real-time browser notifications + reminders
- [x] Video consultation via Jitsi Meet
- [x] Medical records system
- [x] Doctor schedule management
- [ ] WebSocket real-time updates
- [ ] In-app messaging between patient and doctor
- [ ] Payment integration (Stripe)
- [ ] Mobile app (React Native)
- [ ] AI-powered health chatbot

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

<div align="center">

**Built with ❤️ for the WC Launchpad 2026 Builder Round**

[🌐 Live Demo](https://med-connect-five.vercel.app) · [🐛 Report Bug](https://github.com/aro-wen/MedConnect/issues) · [✨ Request Feature](https://github.com/aro-wen/MedConnect/issues)

</div>
