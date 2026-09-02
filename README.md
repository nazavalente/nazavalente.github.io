# Nazario Jose Valente da Cruz Portfolio

A modern full-stack personal portfolio built with Next.js App Router and Firebase. It includes public portfolio pages plus a browser-based admin dashboard for managing projects, repositories, achievements, skills, experiences, certificates, and contact messages.

## Detected Seed Sources

Seed data in `src/data/seedPortfolioData.js` is based only on detected workspace files:

- `C:/Users/Nazario/Documents/investment-portfolio-app`: README confirms a full-stack Investment Portfolio Web Application using React, Vite, Tailwind CSS, Express.js, Prisma, MySQL, JWT, and Recharts.
- `E:/IMPAL/MentalHealthWebApp-Frontend`: folder structure confirms a Next.js mental health tracking app with dashboard, mood, goals, journal, physical health, relaxation, articles, auth screens, Supabase utilities, Docker files, and SQL migrations.
- `E:/new-york-city-taxi-fare-prediction`: notebooks and files confirm a PySpark machine learning workflow for NYC taxi fare prediction.
- Public GitHub profile `https://github.com/nazavalente`: public repository metadata and available README/root files were used to add `AIPROJECT`, `MentalHealthWebApp-Frontend`, `nazavalente.github.io`, `AlgoritmaPemrogramaTubes`, `ExpenseTracker`, and `Introduction-to-Artificial-Intelligence`.

Missing links, years, exact roles, and certificate details are left empty until verified.

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Do not commit real Firebase credentials.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication with email/password.
3. Create a Firestore database.
4. Enable Firebase Storage.
5. Add the Firebase web app config to `.env.local`.
6. Create your admin user in Firebase Authentication.
7. Grant that account the `admin` custom claim: `node scripts/set-admin-claim.mjs <serviceAccountKey.json> <admin-email>` (see the script's header comment for how to download the service account key — never commit it).

Admin authorization in `firebase/firestore.rules` and `firebase/storage.rules` checks `request.auth.token.admin == true`, so any account with that custom claim gets admin access — no email needs to be hardcoded in the rules.

## Deploy Firebase Rules

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Admin Dashboard

Visit `/admin/login`, sign in with the Firebase Auth admin account, then use:

- `/admin/dashboard`
- `/admin/projects`
- `/admin/repositories`
- `/admin/achievements`
- `/admin/skills`
- `/admin/experiences`
- `/admin/certificates`
- `/admin/messages`

The dashboard has import buttons for detected seed data. Public pages read from Firestore, so import seed data or create records manually from admin pages.

## Vercel Deployment

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add all `NEXT_PUBLIC_FIREBASE_*` variables in the Vercel project settings.
4. Deploy.

## Notes

- Contact form submissions are saved to the `contactMessages` collection.
- Email sending is not implemented yet. Add Firebase Functions later if needed.
- File uploads use Firebase Storage and save download URLs in Firestore.
