# New Build and Play Store Release — Step by Step

---

## Changing the developer name (e.g. to "Evryday Solutions")

The name shown under your app on the Play Store (e.g. "Ujjwal Vasisht") is your **developer account’s public name**. To show **"Evryday Solutions"** instead:

1. Go to [Google Play Console](https://play.google.com/console) and sign in.
2. Click the **gear icon** (Settings) in the bottom left.
3. Under **Developer account**, open **Account details** (or **Developer profile**).
4. Look for **Developer name** or **Public developer name** — this is the name shown on the store listing.
5. If you see an **Edit** option next to it, change it to **Evryday Solutions** and save.

**If you don’t see an edit option or it’s greyed out:**  
- **Individual accounts:** Google often shows your verified legal name and may not allow changing it to a business name. In that case you have two options:
  - **Option A:** Check again under **Settings** → **Developer account** → **Account details** for any “Display name” or “Public name” field that can be edited (Google sometimes adds this).
  - **Option B:** Use an **organization** developer account: register a new developer account as **Evryday Solutions** (company/organization) and transfer your app to it, or publish new apps under that account. Organization registration may require business verification (e.g. D‑U‑N‑S number, documents). See [Create a developer account](https://support.google.com/googleplay/android-developer/answer/9859152).

**Summary:** Try **Settings** → **Developer account** → **Account details** and edit the developer name to **Evryday Solutions** if the field is editable; otherwise you may need an organization account to show a company name.

---

## Part A: Do You Need a New App Build?

**What you updated in Supabase (Edge Functions + secrets):**  
Those run on **Supabase’s servers**. They are already live. Every app (old or new) that uses your Supabase URL will now use the updated create-checkout, razorpay-webhook, and unsplash-image functions. **No new app build is required just for those changes.**

**When you DO need a new app build:**
- You need to release a **new version** on the Play Store (e.g. with your own Supabase project).
- The app currently on the Play Store (or your last build) was built with a **different** Supabase URL/keys (or without them). So you need a build that has **your** `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_RAZORPAY_KEY_ID) baked in.
- You made **any change to the app code** (screens, logic, etc.) and want that in the store.

**Summary:** If the app on the Play Store still points to an old Supabase (or no Supabase), you need to build again with the correct `.env` and then upload that new build to the Play Store. The Edge Function updates you did are already in effect once the app talks to your Supabase.

---

## Part B: Build the App on Your Computer (When You Need a New Build)

Do this in the **project folder** you downloaded (where you see `package.json`, `src`, `.env`, etc.).

### Step 1 — Check your `.env` file

In the project root, open `.env`. It should contain (with your real values):

```env
VITE_SUPABASE_URL=https://hagrzssoflxeyykcpvej.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

If anything is missing or wrong, fix it and save.

### Step 2 — Open Terminal and go to the project folder

- **Mac:** Open Terminal (Applications → Utilities → Terminal, or search “Terminal”).
- **Windows:** Open Command Prompt or PowerShell.

Then type (replace with your actual project path):

```bash
cd "/Users/ujjwalvasisht/Desktop/Quran wisdom"
```

Press Enter.

### Step 3 — Install dependencies and build the web app

Run these commands **one after the other** (press Enter after each):

```bash
npm install
```

Wait until it finishes. Then:

```bash
npm run build
```

Wait until you see something like “built in X seconds” with no errors.

### Step 4 — Sync the build to Android

Run:

```bash
npx cap sync android
```

Wait until it finishes without errors.

### Step 5 — Open the project in Android Studio

1. Open **Android Studio**.
2. **File** → **Open** (or “Open an existing project”).
3. Go to your project folder and select the **`android`** folder (the one inside “Quran wisdom”), not the main “Quran wisdom” folder.
4. Click **Open**. Let Android Studio load and sync (Gradle sync). Wait until it’s done (no red errors at the bottom).

### Step 6 — Bump the version (optional but good for Play Store)

So the Play Store sees this as a new release:

1. In Android Studio, in the left **Project** panel, make sure you're in **Project** view (dropdown at the top of that panel).
2. Expand **android** (click the small arrow next to it), then expand **app**.
3. Double‑click **build.gradle** (the one under **app**; it may show as **build.gradle** or **build.gradle.kts**). It opens in the editor.
4. Find the two lines **versionCode** and **versionName** (they're inside `defaultConfig { ... }`). For example:
   - `versionCode 1`  → change to `versionCode 2` (increase by 1 each release).
   - `versionName "1.0"` → change to e.g. `versionName "1.1"` or `"2.0"`.
5. Save the file (Ctrl+S / Cmd+S).

### Step 7 — Create the release bundle (AAB) for Play Store

1. In Android Studio top menu: **Build** → **Generate Signed Bundle / APK**.
2. Choose **Android App Bundle** → **Next**.
3. **Key store:**  
   - If you already have a keystore file (from Bold or a previous release), select it and enter the keystore password and key alias/password.  
   - If you don’t have one, choose **Create new** and fill in the form (path, password, alias, etc.). **Save the keystore file and passwords somewhere safe** — you need them for every future update.
4. Click **Next**.
5. Select **release** build variant. Click **Create** (or **Finish**).
6. When it’s done, Android Studio will show the path to the **.aab** file (usually something like `android/app/release/app-release.aab`). Remember or copy this path.

You now have a new build that uses your Supabase and Razorpay config. The Edge Function updates are already on Supabase, so this build will use them automatically.

---

## Part C: Upload the New Build to the Play Store

### Step 1 — Open Google Play Console

1. Go to [https://play.google.com/console](https://play.google.com/console).
2. Sign in with the Google account that owns the app.
3. Select your app (**Daily Quranic Wisdom** or whatever it’s named).

### Step 2 — Start a new release

1. In the left menu, go to **Release** → **Production** (or **Testing** → **Internal testing** / **Closed testing** if you want to test first).
2. Click **Create new release** (or **Create release**).

### Step 3 — Upload the AAB

1. In the “App bundle” section, click **Upload** (or “Upload new”).
2. Choose the **.aab** file you created (e.g. `app-release.aab` from `android/app/release/`).
3. Wait until the upload and processing finish. Google will show the version name and version code you set.

### Step 4 — Release name and notes

1. **Release name:** e.g. “1.1 – Supabase and payment updates” (optional; some use the version name).
2. **Release notes:** Short note for users, e.g. “Improvements and fixes.” (Required for production in many cases.)

### Step 5 — Review and submit

1. Click **Save** (if shown), then **Review release** (or **Next** until you get to review).
2. Accept the declarations if asked.
3. Click **Start rollout to Production** (or **Rollout to X** for testing tracks).

After that, the new build is in review. Once approved, it will replace the previous version on the Play Store. Your Edge Function and secret updates are already live on Supabase, so no extra step is needed for those.

---

## Quick Checklist

- [ ] `.env` has correct VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_RAZORPAY_KEY_ID.
- [ ] Ran `npm install`, `npm run build`, `npx cap sync android`.
- [ ] Opened the **android** folder in Android Studio and synced.
- [ ] Increased versionCode/versionName in `app/build.gradle`.
- [ ] Built signed AAB: **Build** → **Generate Signed Bundle / APK** → Android App Bundle → release.
- [ ] Uploaded the AAB in Play Console under **Release** → **Production** (or your chosen track).
- [ ] Filled release notes and submitted for review.

If you don’t have a keystore yet (first time releasing this app yourself), you must create one in Step 7 and keep it and its passwords safe for all future updates.
