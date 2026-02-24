# iOS App Store Release — Step by Step

This guide walks you through building and submitting **Quran Wisdom** to the Apple App Store. Your app uses **Capacitor**, so the flow is: build the web app → sync to iOS → open in Xcode → archive → upload to App Store Connect → submit for review.

---

## Prerequisites

1. **Apple Developer Program**  
   - Enroll at [developer.apple.com](https://developer.apple.com/programs/).  
   - Cost: **$99 USD/year**.  
   - Required to distribute on the App Store.

2. **Mac with Xcode**  
   - You need a Mac. Install **Xcode** from the Mac App Store (free).  
   - After installing, open Xcode once and accept the license.  
   - Optional: install command-line tools: `xcode-select --install`.

3. **Same project setup as Android**  
   - Your `.env` should already have `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_RAZORPAY_KEY_ID` (same as for the Play Store build).

---

## Part A: Add the iOS Platform (First Time Only)

If you don’t have an **`ios`** folder in your project root, add the iOS platform:

1. In Terminal, go to your project folder:
   ```bash
   cd "/Users/ujjwalvasisht/Desktop/Quran wisdom"
   ```

2. Install dependencies and build the web app:
   ```bash
   npm install
   npm run build
   ```

3. Add the iOS platform:
   ```bash
   npx cap add ios
   ```

   This creates the **`ios`** folder and an Xcode project inside it (e.g. `ios/App/App.xcworkspace`).

---

## Part B: Build and Sync Before Every Release

Whenever you change app code or env and want a new iOS build:

1. **Check `.env`**  
   Ensure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_RAZORPAY_KEY_ID` are correct.

2. **Build and sync:**
   ```bash
   cd "/Users/ujjwalvasisht/Desktop/Quran wisdom"
   npm run build
   npx cap sync ios
   ```

   This updates the **`ios`** project with your latest `dist` and native config.

---

## Part C: Configure the iOS Project in Xcode

1. **Open the iOS project in Xcode**  
   Open the **workspace** (not the `.xcodeproj`):
   ```bash
   npx cap open ios
   ```
   Or in Finder: open **`ios/App/App.xcworkspace`**.

2. **Select the App target**  
   In the left sidebar, click the blue **App** project, then under **TARGETS** select **App**.

3. **Signing & Capabilities**  
   - Open the **Signing & Capabilities** tab.  
   - Check **Automatically manage signing**.  
   - Choose your **Team** (your Apple Developer account).  
   - Set **Bundle Identifier** to match your app (e.g. `com.evrydaysolutions.wisdom` — should already match `capacitor.config.ts`).

4. **Bump version and build number**  
   - In the same **App** target, go to the **General** tab.  
   - **Version** (e.g. `1.0` → `1.1`) — user-facing.  
   - **Build** (e.g. `1` → `2`) — must increase for each upload to App Store Connect.  
   - Apple requires each new upload to have a higher **Build** than the previous one.

5. **Icons and display name**  
   - **Display Name** is in **General** (e.g. “Quran Wisdom”).  
   - App icon: **Assets.xcassets** → **AppIcon**. Add all required sizes or use **@capacitor/assets** to generate them from a single image (see Capacitor docs).

---

## Part D: Create an Archive and Upload to App Store Connect

1. **Select “Any iOS Device (arm64)”**  
   In Xcode’s top bar, set the run destination to **Any iOS Device (arm64)** (not a simulator). If you don’t see it, connect an iPhone or add a generic device.

2. **Create an archive**  
   - Menu: **Product** → **Archive**.  
   - Wait for the archive to finish.  
   - The **Organizer** window will open with your archive.

3. **Distribute the app**  
   - In Organizer, select the new archive and click **Distribute App**.  
   - Choose **App Store Connect** → **Next**.  
   - Choose **Upload** → **Next**.  
   - Leave options as default (e.g. upload symbols, manage version/build) → **Next**.  
   - Select your **distribution certificate** and **provisioning profile** (Xcode usually manages these if “Automatically manage signing” is on).  
   - Click **Upload**.  
   - Wait until the upload completes.

4. **If you get signing errors**  
   - In **Signing & Capabilities**, ensure **Team** is set and there are no red errors.  
   - For “No signing certificate” or “No provisioning profile”: **Xcode** → **Settings** → **Accounts** → select your Apple ID → **Manage Certificates** / **Download Manual Profiles** as needed.

---

## Part E: App Store Connect — Create the App and Submit for Review

1. **Open App Store Connect**  
   Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and sign in with your Apple Developer account.

2. **Create a new app (first time only)**  
   - **My Apps** → **+** → **New App**.  
   - **Platforms:** iOS.  
   - **Name:** e.g. **Quran Wisdom**.  
   - **Primary Language:** your choice (e.g. English).  
   - **Bundle ID:** select the one you used in Xcode (e.g. `com.evrydaysolutions.wisdom`).  
   - **SKU:** any unique string (e.g. `quran-wisdom-ios`).  
   - **User Access:** Full Access (or as needed).  
   - Create the app.

3. **Wait for the build to appear**  
   After upload, the build can take **5–30 minutes** to show under **TestFlight** and under the app’s **App Store** tab. If you don’t see it, wait and refresh.

4. **Fill in App Store listing**  
   In your app’s **App Store** tab:  
   - **App Information:** category, privacy policy URL (required), etc.  
   - **Pricing and Availability:** free or paid, countries.  
   - **App Privacy:** complete the privacy questionnaire (data collection, etc.).  
   - **Version information:**  
     - **Screenshots:** required for at least one iPhone size (e.g. 6.7", 6.5", 5.5").  
     - **Description, keywords, support URL.**  
     - **What’s New** (release notes for this version).

5. **Select the build and submit**  
   - In the version’s **Build** section, click **+** and select the build you uploaded.  
   - Answer **Export Compliance**, **Content Rights**, **Advertising Identifier**, etc. (Razorpay/Supabase may affect some answers).  
   - Click **Add for Review** / **Submit for Review**.

6. **Review**  
   Apple typically reviews within **24–48 hours**. You’ll get email about status (Accepted / Rejected). If rejected, fix the issues they mention and resubmit.

---

## Quick Checklist

- [ ] Apple Developer account ($99/year) and Mac with Xcode.
- [ ] `.env` has correct `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`.
- [ ] Ran `npm run build` and `npx cap sync ios` (and `npx cap add ios` if first time).
- [ ] Opened **`ios/App/App.xcworkspace`** in Xcode.
- [ ] Signing & Capabilities: Team set, Bundle ID correct.
- [ ] Version and Build number set; Build increased for this upload.
- [ ] **Product** → **Archive** → **Distribute App** → App Store Connect → Upload.
- [ ] App created in App Store Connect (if first time) with correct Bundle ID.
- [ ] Store listing complete: screenshots, description, privacy policy, privacy questionnaire.
- [ ] Build selected for the version and app **Submitted for Review**.

---

## Optional: Match Version with Android

To keep versions in sync with your Android app (e.g. **1.1**), set the same **Version** in Xcode **General** tab and use **Build** as a separate, ever-increasing number (e.g. 1, 2, 3…) for each upload.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| “No such module ‘Capacitor’” | In project root: `npx cap sync ios`, then open `App.xcworkspace` (not `.xcodeproj`) and clean (Product → Clean Build Folder). |
| Signing errors | Use “Automatically manage signing” and pick your Team; ensure Bundle ID matches App Store Connect. |
| Build doesn’t appear in App Store Connect | Wait 10–30 minutes; check **Activity** in App Store Connect for processing/errors. |
| Rejected for guideline X.X | Read the resolution center message; fix the specific issue (e.g. privacy, permissions, metadata) and resubmit. |

Once your first build is uploaded and the app is submitted, future updates are: bump Version/Build → Archive → Upload → submit a new version in App Store Connect.
