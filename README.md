# Jesuraj Event Decors — Website

A full-stack website for Jesuraj Event Decors (Chennai). Built with Next.js 14, Prisma, NextAuth, Tailwind, and Cloudinary.

## What's inside

**Public site**
- Home — hero, services, featured portfolio, testimonials, feedback bubble (WhatsApp/call/review)
- Gallery — filterable portfolio with lightbox
- Pricing — interactive estimator with live total
- Contact — inquiry form
- Reviews — public testimonials + submit-your-review form

**Admin suite** (password/Google-protected at `/admin`)
- Dashboard with stats and recent inquiries
- Inquiries with status, notes, filtering
- Orders / booked events
- Gallery management with drag-and-drop upload to Cloudinary
- Feedback moderation (approve / feature / delete)

---

## 1. Run it locally (10 minutes)

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- Git

### Steps

```bash
# clone the repo
git clone <your-github-url> jesuraj-decors
cd jesuraj-decors

# install dependencies
npm install

# create your local .env (already present as .env — just keep it)
# The default .env points to a local SQLite database (prisma/dev.db).

# set up the database and sample data
npm run db:push
npm run db:seed

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The gallery, pricing, contact, feedback pages all work immediately with seeded data.

### Admin access in local dev

The admin is at [/admin](http://localhost:3000/admin). To sign in locally without configuring Google OAuth yet, add this line to `.env`:

```
ADMIN_DEV_PASSWORD="choose-a-local-password"
```

Restart the dev server, go to `/admin-signin`, click the dev-password form, sign in.

---

## 2. Set up real services (one-time, ~30 minutes)

### Cloudinary (for photo uploads) — required before admins can upload

1. Sign up free at [cloudinary.com](https://cloudinary.com/users/register_free).
2. On the Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. In Cloudinary, go to **Settings → Upload → Upload presets**. Click **Add upload preset**:
   - Preset name: `jesuraj_gallery`
   - Signing mode: **Unsigned**
   - Folder (optional): `jesuraj`
   - Save.
4. Add all four values to your `.env`:
   ```
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="jesuraj_gallery"
   ```

### Google OAuth (for production admin sign-in)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/).
2. Create a new project (name it "Jesuraj Decors").
3. **APIs & Services → OAuth consent screen**: choose "External", fill in app name, support email, developer email. Save.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local dev)
     - `https://yourdomain.com/api/auth/callback/google` (add after you deploy)
5. Copy the Client ID and Client Secret to `.env`:
   ```
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   NEXTAUTH_SECRET="run: openssl rand -base64 32"
   ADMIN_EMAILS="you@gmail.com,teammate@gmail.com"
   ```

---

## 3. Deploy to Vercel (free tier)

Vercel is perfect for Next.js: auto-deploys from GitHub, free SSL, global CDN, and millisecond page loads.

### Step 1: push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# create a repo on github.com, then:
git remote add origin https://github.com/<you>/jesuraj-decors.git
git push -u origin main
```

### Step 2: create a Postgres database for production

SQLite doesn't work on Vercel (no persistent disk). Use **Neon** (free):

1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project. Copy the **Connection string** (it starts with `postgres://`).
3. Save it — you'll paste it into Vercel in Step 4.

> Before first deploy, update `prisma/schema.prisma` — change `provider = "sqlite"` to `provider = "postgresql"`. Commit and push.

### Step 3: deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project**, import your `jesuraj-decors` repo.
3. Vercel auto-detects Next.js. Leave build settings as-is.
4. **Environment Variables** — paste these:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string |
   | `NEXTAUTH_SECRET` | 32+ random chars (`openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` (your live URL) |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
   | `ADMIN_EMAILS` | Comma-separated Gmails allowed into `/admin` |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary |
   | `CLOUDINARY_API_KEY` | From Cloudinary |
   | `CLOUDINARY_API_SECRET` | From Cloudinary |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as above (public) |
   | `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `jesuraj_gallery` |
   | `NEXT_PUBLIC_BUSINESS_PHONE` | e.g. `+91 98765 00000` |
   | `NEXT_PUBLIC_BUSINESS_EMAIL` | `hello@jesurajdecors.com` |
   | `NEXT_PUBLIC_BUSINESS_ADDRESS` | Chennai, Tamil Nadu, India |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, digits only (e.g. `919876500000`) |
   | `NEXT_PUBLIC_INSTAGRAM_URL` | Your Instagram page |
   | `NEXT_PUBLIC_FACEBOOK_URL` | Your Facebook page |

5. Click **Deploy**. First deploy takes ~2 minutes.
6. Once live, run seed data once:
   ```bash
   # locally, pointing DATABASE_URL at your Neon URL:
   DATABASE_URL="postgres://..." npm run db:seed
   ```
7. Add the live redirect URI to Google OAuth (step 2.4 above): `https://your-project.vercel.app/api/auth/callback/google`.

### Step 4: custom domain (optional, ~₹900/year)

Buy a domain from GoDaddy / Namecheap / Google Domains. In Vercel project settings → **Domains → Add**, enter your domain. Vercel shows the DNS records to set at your registrar. Usually takes 5-30 minutes to propagate.

Don't forget to update `NEXTAUTH_URL` and the Google OAuth redirect URI once your custom domain is live.

---

## Common tasks

### Change pricing rates
Edit `src/lib/pricing.ts` — base rates, venue multipliers, and add-on prices all live in one file.

### Change theme colors
Edit `tailwind.config.ts` — ivory, cream, burgundy, rose, blush, sand are all defined there.

### Update contact details
Change `NEXT_PUBLIC_BUSINESS_*` and related env vars. Re-deploy (Vercel redeploys automatically on push).

### Open Prisma Studio (visual DB browser)
```bash
npm run db:studio
```
Opens at [localhost:5555](http://localhost:5555).

### Reset local database + reseed
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

---

## Project structure

```
src/
├── app/
│   ├── (public pages)/      home, gallery, pricing, contact, feedback
│   ├── admin/               protected admin suite
│   ├── admin-signin/        sign-in page
│   └── api/                 REST endpoints
├── components/              shared React components
└── lib/                     pricing engine, auth helpers, Prisma client
prisma/
├── schema.prisma            database schema
└── seed.ts                  sample data
```

## Tech stack
- [Next.js 14](https://nextjs.org/) (App Router, RSC, server actions)
- [Prisma](https://www.prisma.io/) (ORM)
- [NextAuth](https://next-auth.js.org/) (Google OAuth + dev password)
- [Tailwind CSS](https://tailwindcss.com/) (styling)
- [Cloudinary](https://cloudinary.com/) (image hosting + optimization)
- [lucide-react](https://lucide.dev/) (icons)
- [zod](https://zod.dev/) (input validation)

## License
Proprietary — Jesuraj Event Decors.
