# Google Play Store – Listing & Formalities

Use this document when filling out the Play Console for **Quran Wisdom** (package: `com.evrydaysolutions.wisdom`).

---

## 1. Store listing

### App name (30 characters max)
```
Quran Wisdom
```

### Short description (80 characters max)
```
Daily Quranic wisdom: a verse, its meaning, and one good thing to live by.
```

### Full description (4000 characters max)
```
Daily Quranic Wisdom helps you start each day with a moment of reflection from the Quran.

WHAT YOU GET EVERY DAY
• A verse from the Quran, chosen for clarity and relevance
• A clear explanation of its meaning so you can reflect on its wisdom
• One good thing to do today — a simple, actionable step to bring the verse into your day

HOW IT WORKS
Create a free account and enjoy full access during a 21-day trial. After that, unlock lifetime access with a single one-time payment so you can keep receiving daily wisdom without a subscription.

FEATURES
• New verse and reflection every day
• Optional daily reminder at a time you choose
• Browse past wisdom in the archive (premium)
• Clean, focused design for a few minutes of calm each morning

Daily Quranic Wisdom is for personal spiritual reflection and growth. It is not intended as religious ruling or a substitute for guidance from qualified scholars.

By Evryday Solutions — building tools for mindful living.
```

---

## 2. Required URLs

| Field | URL |
|-------|-----|
| **Privacy policy** (required) | https://quranwisdom.evrydaysolutions.com/privacy |
| **Terms of service** (if asked) | https://quranwisdom.evrydaysolutions.com/terms |
| **Account deletion request** (required by Play) | https://quranwisdom.evrydaysolutions.com/delete-account |
| **Website** (optional) | https://quranwisdom.evrydaysolutions.com |
| **Support / contact** | mailto:contact@evrydaysolutions.com |

---

## 3. Data safety form

Google requires you to declare what data is collected and how it’s used. Based on your app:

### Does your app collect or share user data?
**Yes.**

### Data types to declare

| Data type | Collected? | Shared? | Purpose | Optional? |
|-----------|------------|---------|---------|-----------|
| **Email address** | Yes | No | Account management, sign-in | No (required for account) |
| **Passwords** | Yes (hashed) | No | Account authentication | No |
| **Purchase history** | Yes (transaction ID, status) | No | Deliver premium access, records | No (for purchases) |
| **App interactions** | Optional | No | Improve app experience | Yes |

### How to fill in Play Console

1. **Data safety** → Start / Edit form.
2. **Does your app collect or share user data?** → **Yes**.
3. For **Account management**:
   - **Email address** – collected, not shared, required for account.
   - **Passwords** – collected (stored in hashed form), not shared, required for authentication.
4. For **App functionality** (or similar):
   - **Purchase history** (or “Financial info” – transaction ID only) – collected, not shared, for providing and managing premium access.
5. If you mention “usage” or “analytics” in the policy:
   - **App interactions** – collected, not shared, optional, for improving the app.
6. **Data not sold** – confirm that user data is **not** sold to third parties.
7. **Data security** – you can state that data is encrypted in transit and that you use industry-standard practices (e.g. Supabase, Razorpay).

Use your actual implementation; add or remove types if your app does more or less than above.

---

## 4. Content rating

1. In Play Console go to **Policy** → **App content** → **Content rating**.
2. Complete the questionnaire. Suggested answers for Quran Wisdom:
   - **Violence** – None.
   - **Sexual content** – None.
   - **Language** – None / Mild (only if your content has any strong language; otherwise None).
   - **Controlled substances** – None.
   - **Gambling** – No.
   - **User interaction** – None or minimal (no chat, no UGC).
   - **Shares location** – No (unless you actually use location).
   - **Unrestricted web access** – No (or Yes only if the app opens browser for payment/support and you’re comfortable with that).

Result is typically **Everyone** or **PEGI 3**-type rating. Submit and attach the certificate when asked.

---

## 5. Target audience & eligibility

- **Target age group:** e.g. 13+ or 18+ depending on your policy (your privacy policy says “not intended for under 13” – you can target 13+ and state that in the form if asked).
- **Ads:** If your app does **not** show ads, say “No” wherever the form asks about ad-supported or ads.
- **In-app purchases:** **Yes** – one-time purchase (lifetime access, ₹899). In the monetization section, declare “In-app products” and describe it as a one-time premium unlock, not a subscription.

---

## 6. App access & test user for Google Play reviewers

Google Play may ask how reviewers can access your app. Because login is required, you must provide a **test account** they can use.

### Step 1: Create the test account

**Option A – Using the app (recommended)**  
1. Open your app (or the live app at https://app.evrydaysolutions.com).  
2. Tap **Create Account**.  
3. Register with a dedicated test email and a simple password you’ll share only with Play Console.  
   - **Suggested email:** `playstore.review@evrydaysolutions.com` (or any address you control).  
   - **Suggested password:** Choose something simple for reviewers (e.g. `ReviewTest2026`). Store it in a password manager or this doc; do not use a personal or important password.

**Option B – Using Supabase Dashboard**  
1. Go to [Supabase](https://supabase.com) → your project → **Authentication** → **Users**.  
2. Click **Add user** → **Create new user**.  
3. Enter the test email and password (e.g. as above).  
4. Confirm so the user can sign in.

### Step 2: (Optional) Grant premium for full experience

So reviewers can see premium content (e.g. archive) without paying:

1. In Supabase go to **Table Editor** → **profiles**.  
2. Find the row where **id** matches the new test user’s UUID (same as in **Authentication** → **Users**).  
3. Set **is_premium** to **true** and save.

### Step 3: Add credentials in Play Console

1. In Play Console go to your app → **Policy** → **App content** (or **Release** → **App access** / **Testing**).  
2. Find **App access** or **How can testers/reviewers access your app?**  
3. Select that **some or all functionality is restricted** (login required).  
4. In the instructions / credentials field, enter something like:

```
Test account for Google Play review:

Email: playstore.review@evrydaysolutions.com
Password: [YOUR_CHOSEN_PASSWORD]

This account has premium access so reviewers can see the full app experience (daily verse, archive, settings). Do not use for any other purpose.
```

Replace the email/password with the ones you actually created.

### Credentials to use (fill in after creating the account)

| Field    | Value (replace with yours) |
|----------|----------------------------|
| **Email**    | `playstore.review@evrydaysolutions.com` |
| **Password** | `________________` (choose and store securely) |

Keep this account only for Play (and similar) review. You can change the password or disable the user in Supabase after review if you want.

---

## 7. Screenshots & graphics

### Phone screenshots (required)
- **Minimum:** 2 screenshots.
- **Recommended:** 4–8.
- **Size:** 16:9 or 9:16; min 320px, max 3840px on the long side.
- **Content ideas:** Home/daily verse, “What it means,” “One good thing today,” archive, settings, paywall (optional).

### Feature graphic (required)
- **Size:** 1024 x 500 px.
- **Format:** PNG or JPEG, 32-bit.
- Use your logo, app name, and tagline on the emerald/gold theme.

### App icon
- Already set in the project (e.g. 512 x 512 and adaptive icons). Use the same logo/icon as in the app.

---

## 8. Internal testing release (bundle, name, notes)

When Play Console asks you to create an internal testing release, you need to upload an **app bundle**, set a **release name**, and add **release notes**.

### Step 1: Build the Android App Bundle (.aab)

On your computer (with the project open):

1. **Build the web app and sync to Android:**
   ```bash
   cd "/Users/ujjwalvasisht/Desktop/Quran wisdom"
   npm run build:mobile
   ```
   (This runs `vite build` then `npx cap sync` so the latest site is in the Android app.)

2. **Build the release bundle:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   (On Windows use `gradlew.bat bundleRelease`.)

3. **Find the .aab file:**  
   After it finishes, the file is at:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
   That’s the file you upload in Play Console under **App bundles** (drag and drop or **Upload**).

**If you don’t have Android SDK / Gradle:** Install [Android Studio](https://developer.android.com/studio), open the `android` folder as a project, then use **Build → Generate Signed Bundle / APK** and choose **Android App Bundle**. Or run the same `./gradlew bundleRelease` from the `android` folder in a terminal (Android Studio installs the SDK Gradle needs).

### Step 2: Release name

In **Release details → Release name** enter something like:

```
1
```
or
```
1.0 (1)
```

Play often uses the first number as version (e.g. 1 for first release). You can use `1` or `1.0 (1)`.

### Step 3: Release notes

Play may ask for **Release notes** on this page or on **Preview and confirm**. Internal testers see these. You can use:

```
Initial internal test release for Quran Wisdom.
• Daily verse, meaning, and one good thing
• 21-day free trial, then one-time lifetime access
• Account sign-in and optional daily reminder
```

Or shorter:

```
First internal build. Please test sign-up, daily wisdom, and settings. Use the test account from App access if needed.
```

### Summary

| What | Where / value |
|------|----------------|
| **App bundle** | Upload `android/app/build/outputs/bundle/release/app-release.aab` (after running `npm run build:mobile` then `cd android && ./gradlew bundleRelease`). |
| **Release name** | `1` or `1.0 (1)` |
| **Release notes** | Short note for testers (see examples above). |

Then click **Save as draft** or **Next** and complete **Preview and confirm** to publish the internal test.

---

## 9. Pre-launch checklist

- [ ] Store listing: name, short & full description filled.
- [ ] Privacy policy URL: https://quranwisdom.evrydaysolutions.com/privacy
- [ ] Account deletion URL: https://quranwisdom.evrydaysolutions.com/delete-account
- [ ] Data safety form completed and saved.
- [ ] Content rating questionnaire done and certificate added.
- [ ] Target audience / age group set.
- [ ] In-app purchase (one-time) declared; no ads if you don’t show ads.
- [ ] App access: demo account provided for review (if required).
- [ ] At least 2 phone screenshots uploaded.
- [ ] Feature graphic 1024x500 uploaded.
- [ ] App signed and release build (or internal/closed track) uploaded.
- [ ] Internal test: .aab uploaded, release name and notes set.

---

## 10. Quick links

- **Play Console:** https://play.google.com/console  
- **Privacy policy (live):** https://quranwisdom.evrydaysolutions.com/privacy  
- **Terms:** https://quranwisdom.evrydaysolutions.com/terms  
- **Account deletion:** https://quranwisdom.evrydaysolutions.com/delete-account  
- **Contact:** contact@evrydaysolutions.com  

---

*Update this file if your app name, URLs, or data practices change.*
