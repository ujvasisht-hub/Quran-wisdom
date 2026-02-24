# Setup Steps — Quran Wisdom App (Non-Developer Guide)

Follow these steps in order. Do not skip steps.

---

## Part 1: Supabase — One More SQL Script (Only If Needed)

You already ran the main migration. You only need this **if** when you created the `profiles` table earlier you used a version that did **not** include the `notification_time` column.

### How to check
1. Open your **Supabase** project in the browser.
2. Go to **Table Editor** (left sidebar).
3. Click the **profiles** table.
4. Look at the column names. Do you see **notification_time**?
   - **If YES** → Skip Part 1. Do nothing.
   - **If NO** → Run the script below.

### Script to run (only if notification_time is missing)

1. In Supabase, go to **SQL Editor** (left sidebar).
2. Click **New query**.
3. Copy and paste **exactly** this (one line):

```sql
alter table profiles add column if not exists notification_time text default '08:00';
```

4. Click **Run** (or press Ctrl+Enter / Cmd+Enter).
5. You should see “Success. No rows returned.” That’s correct.

---

## Part 2: Environment Variables — Where They Live and Where to Find Values

### Where the app’s env is

The app reads environment variables from a file named **`.env`** in the **root folder** of your project (same folder where you see `package.json`, `src`, etc.).

You already have a `.env` file with one line. You will add two more lines to it.

### Where to find VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Supabase

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Open **your project** (Quran Wisdom).

**VITE_SUPABASE_URL (API URL):**  
- In the left sidebar go to **Integrations** → **Data API**. The **API URL** shown there (e.g. `https://xxxxx.supabase.co`) is your `VITE_SUPABASE_URL`.  
- Or in **Project Settings** (gear) → **API** you may see a Project/API URL there. Use whichever you see.

**VITE_SUPABASE_ANON_KEY:**  
- Go to **Project Settings** (gear icon) → **API Keys**.  
- The **Publishable key** (sometimes labeled anon/public) is your `VITE_SUPABASE_ANON_KEY`. Copy the full value.

Copy both; you will put them in `.env` next.

### What to put in `.env`

Open the **`.env`** file in your project root (in Cursor/VS Code or any text editor). It should look like this (with your real values, not placeholders):

```env
VITE_RAZORPAY_KEY_ID=your_actual_live_key_here
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

- Replace `https://xxxxxxxxxxxx.supabase.co` with your **Project URL** from Supabase.
- Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...` with your **anon public** key from Supabase.
- Keep your existing `VITE_RAZORPAY_KEY_ID` line as is (with your real Razorpay key).

Save the file.

**Important:** The `.env` file is in `.gitignore`, so it is not uploaded to Git. That’s correct for keeping secrets safe.

---

## Part 3: Build That Produces the App (Bold.io and Android Studio)

The app (the one you open in Android Studio and upload to Play Store) is built in two stages:

1. **Web build** — runs `npm run build`. This step bakes the values from `.env` (like `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) into the app. So whoever runs this build must have access to the correct `.env`.
2. **Android build** — takes that built web app and wraps it in Android (Gradle, etc.) in Android Studio.

So the environment variables must be set **where the web build runs**.

### If you build on Bold.io

- If Bold.io runs the build (e.g. you connect a repo or upload code and it runs `npm run build`), then Bold.io must have those variables.
- In Bold.io, look for something like **Environment variables**, **Build settings**, or **Secrets**. Add there:
  - `VITE_SUPABASE_URL` = your Project URL from Supabase
  - `VITE_SUPABASE_ANON_KEY` = your anon key from Supabase
  - `VITE_RAZORPAY_KEY_ID` = your Razorpay key (if not already there)
- Then run a **new build** in Bold.io and **download/export** that new build. Use that exported project for the next step (Android Studio).

### If you build on your own computer (after downloading code from Bold)

- Put the **`.env`** file (with the three variables above) in the **root** of the project you downloaded.
- In Terminal, go to the project folder and run:
  - `npm install`
  - `npm run build`
- Then run the Capacitor sync and open in Android Studio, for example:
  - `npx cap sync android`
  - Open the `android` folder in Android Studio and build the app there.

So in short: **wherever `npm run build` runs (Bold.io or your computer), that place must have the correct `.env` (or env vars in Bold’s UI).** The Android Studio step only packages the already-built web app; it does not read `.env` again.

---

## Part 4: Edge Function (Payment Verification) — Step by Step

The Edge Function runs on **Supabase’s servers** and marks a user as premium after a successful Razorpay payment. You need to deploy it **once** to your Supabase project and set its secrets.

### Step 4.1 — Open Edge Functions in Supabase

1. Go to [https://supabase.com](https://supabase.com) → your project.
2. In the left sidebar, click **Edge Functions**.

### Step 4.2 — Create or update the function

- If you **don’t** see a function named **create-checkout**:
  1. Click **Create a new function**.
  2. Name it: **create-checkout**.
  3. Supabase may create a placeholder. You will replace its code in the next step.

- If you **already** have **create-checkout**:
  1. Click on **create-checkout** to open it.
  2. You will replace or paste the full code in the editor.

### Step 4.3 — Paste the function code

1. Open the file **`supabase/functions/create-checkout/index.ts`** from your project in a text editor (e.g. in Cursor).
2. Select **all** the code (Ctrl+A / Cmd+A) and copy it.
3. In Supabase Edge Functions, in the code editor for **create-checkout**, select all and paste this code (so the whole function is replaced).
4. Save/Deploy the function (Supabase usually has a **Deploy** or **Save** button).

### Step 4.4 — Set secrets for the function

The function needs your Razorpay keys and Supabase service role key. Supabase usually sets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for you. You must set the Razorpay ones.

1. In Supabase, go to **Project Settings** (gear icon) → **Edge Functions** (or **Secrets** / **Environment variables** for Edge Functions).
2. Find where to add **secrets** or **environment variables** for Edge Functions.
3. Add these (use your real values from Razorpay dashboard and Supabase):

| Name                         | Value                                      |
|-----------------------------|--------------------------------------------|
| `RAZORPAY_KEY_ID`          | Your Razorpay Key ID (same as in .env)     |
| `RAZORPAY_KEY_SECRET`      | Your Razorpay Key Secret from Razorpay     |

- **SUPABASE_URL** and **SUPABASE_SERVICE_ROLE_KEY**: If Supabase does **not** set them automatically, add them:
  - **Project Settings** → **API** → copy **Project URL** → use as `SUPABASE_URL`.
  - **Project Settings** → **API** → under **Project API keys** copy **service_role** (secret) → use as `SUPABASE_SERVICE_ROLE_KEY`. Keep this key secret.

4. Save. Redeploy the **create-checkout** function if needed after changing secrets.

### Step 4.5 — Test (optional)

After deployment, try a small test payment in your app (or a test mode payment if you have one). If payment completes and the user becomes premium, the Edge Function is working.

### Step 4.6 — Razorpay webhook (optional but recommended)

The app already activates premium right after payment using **create-checkout** (verify). A **webhook** is a backup: Razorpay’s servers call your Supabase function when a payment is captured, so premium can be set even if the user closes the app before the in-app verify finishes.

**You do not need the webhook for the app to work.** If you want it (e.g. Bold asked for it, or you want the backup):

1. **Deploy the webhook function in Supabase**
   - **Edge Functions** → **Create a new function** → name it **razorpay-webhook**.
   - Paste the full code from **`supabase/functions/razorpay-webhook/index.ts`** and deploy.

2. **Add the webhook secret in Supabase**
   - In **Project Settings** → **Edge Functions** (or **Secrets**), add:
   - **Name:** `RAZORPAY_WEBHOOK_SECRET`
   - **Value:** the **Webhook Secret** from Razorpay (see step 3).

3. **Create the webhook in Razorpay Dashboard**
   - Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/) → **Settings** → **Webhooks**.
   - **Add New Webhook**.
   - **Webhook URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/razorpay-webhook`  
     (replace `YOUR_PROJECT_REF` with your Supabase project ref, e.g. `hagrzssoflxeyykcpvej`).
   - Under **Alert Events**, enable **payment.captured** (and any others you want).
   - Save. Razorpay will show a **Webhook Secret** — copy it and use it as `RAZORPAY_WEBHOOK_SECRET` in Supabase (step 2).

If you skip the webhook, the app still works; only the in-app verify flow is used to set premium.

---

## Part 5: Daily Background Image (Unsplash) — Edge Function

The app shows a **new nature image every day** as the background on the main screen. That image comes from **Unsplash** via a Supabase Edge Function called **unsplash-image**. You need to deploy that function and add your Unsplash API key as a secret.

### Step 5.1 — Get an Unsplash API key

1. Go to [https://unsplash.com/developers](https://unsplash.com/developers) and sign in (or create an account).
2. Click **Your apps** → **New Application**.
3. Accept the API use terms.
4. Create an app (e.g. name it “Quran Wisdom”). You will see **Access Key** and **Secret Key**. You only need the **Access Key**.
5. Copy the **Access Key**; you will add it as a secret in Supabase in the next part.

### Step 5.2 — Deploy the unsplash-image Edge Function

1. In Supabase, go to **Edge Functions** (left sidebar).
2. If you **don’t** see **unsplash-image**:
   - Click **Create a new function** and name it **unsplash-image**.
3. Open the function **unsplash-image** in the editor.
4. Open the file **`supabase/functions/unsplash-image/index.ts`** from your project in Cursor (or any text editor), select all the code, copy it, and paste it into the Supabase editor (replacing any placeholder).
5. Click **Deploy** (or Save) so the function is live.

### Step 5.3 — Add the Unsplash key as a secret

The function needs your Unsplash **Access Key** so it can fetch images. You add it as a **secret** for Edge Functions (same place you added Razorpay keys).

1. In Supabase, go to **Project Settings** (gear icon) → find **Edge Functions** or **Secrets** (where you set RAZORPAY_KEY_ID, etc.).
2. Add a new secret:
   - **Name:** `UNSPLASH_ACCESS_KEY`
   - **Value:** the Unsplash **Access Key** you copied in Step 5.1
3. Save. If Supabase asks you to redeploy the function after changing secrets, do that.

After this, when users open the app, the main screen will call this function once per day (per device) and show a new Unsplash image as the background. **You do not add the Unsplash key to the `.env` file** — it stays only in Supabase secrets so it is not exposed in the app.

---

## Quick Checklist

- [ ] Part 1: Run the `alter table profiles add column...` SQL **only if** `notification_time` is missing in `profiles`.
- [ ] Part 2: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` (URL can be under Integrations → Data API; anon key under Project Settings → API Keys).
- [ ] Part 3: Ensure the place that runs `npm run build` (Bold.io or your PC) has these env vars; then build and use that build in Android Studio.
- [ ] Part 4: Deploy **create-checkout** Edge Function and set **RAZORPAY_KEY_ID**, **RAZORPAY_KEY_SECRET** (and SUPABASE_URL / SERVICE_ROLE if required).
- [ ] Part 4.6 (optional): Deploy **razorpay-webhook** and set **RAZORPAY_WEBHOOK_SECRET**; add webhook URL in Razorpay Dashboard.
- [ ] Part 5: Deploy **unsplash-image** Edge Function and set **UNSPLASH_ACCESS_KEY** (Unsplash Access Key) in Edge Function secrets.

If you tell me whether you build on Bold.io or on your computer after downloading, I can narrow Part 3 to exact clicks (e.g. “In Bold.io click X, then Y”) if you have screenshots or menu names.
