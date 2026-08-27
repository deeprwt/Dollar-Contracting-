# Supabase Setup — Dollar Contracting Admin

Follow these steps in order. Total time: ~10 minutes.

## 1. Create the Supabase project

1. Go to https://supabase.com and click **Start your project** (sign in with GitHub or email — both free).
2. Click **New Project**.
3. Fill in:
   - **Organization**: your default org is fine
   - **Name**: `dollarcontractor`
   - **Database Password**: click "Generate a password" and **save it somewhere safe** (you won't use it day-to-day but losing it is painful)
   - **Region**: `Canada (Central)` — `ca-central-1` (closest to Northern Ontario)
   - **Pricing Plan**: Free
4. Click **Create new project**. Wait ~2 minutes for it to provision.

## 2. Run the schema SQL

1. In the Supabase dashboard sidebar, click **SQL Editor**.
2. Click **+ New query**.
3. Open `supabase/schema.sql` from this repo, copy the entire contents.
4. Paste into the SQL editor, click **Run** (bottom right).
5. You should see "Success. No rows returned." If you see errors, send me the error text.

## 3. Create the resume storage bucket

The SQL above creates the bucket, but verify:

1. Sidebar → **Storage**.
2. You should see a bucket named `applications` (private, not public).
3. If it's missing: click **New bucket** → name `applications` → uncheck "Public bucket" → Create.

## 4. Create your admin user

1. Sidebar → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Email: your real email (you'll log into the admin dashboard with this).
4. Password: pick a strong one you'll remember.
5. Check **Auto Confirm User** (so you don't need to click an email link).
6. Click **Create user**.

You now have admin credentials.

## 5. Copy your project keys

1. Sidebar → **Project Settings** (gear icon, bottom left) → **API**.
2. Copy these three values — I'll need them to fill in `.env.local`:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **Project API keys → anon / public** (a long `eyJ...` string)
   - **Project API keys → service_role** (a different long `eyJ...` string — KEEP THIS SECRET, never commit it)

## 6. Paste them into this chat

Send me the three values like this:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

I'll write them to `.env.local` (which is gitignored, so they don't get committed) and add the same three names to your Vercel project's Environment Variables when we're ready to deploy.

---

## What's free vs. paid?

- **Free tier**: 500 MB database, 1 GB file storage, 50,000 monthly active users, 5 GB bandwidth. For a contractor site this lasts indefinitely.
- **No credit card required** to use the free tier. (Unlike Google Places API.)
- **You only pay if** you exceed those limits, and you'd see warnings well in advance.
