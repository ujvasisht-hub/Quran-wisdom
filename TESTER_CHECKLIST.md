# Daily Quranic Wisdom — App Tester Checklist

Use this checklist to test the app before release. Test on a real Android device when possible.

---

## Before You Start

- [ ] Install the app from the link provided (Internal/Closed testing track, or Production once live).
- [ ] Ensure you have a stable internet connection.
- [ ] For **payment testing**: Prefer Razorpay **test mode** (test cards) if the developer has enabled it; otherwise one real payment can be used and refunded if needed.

---

## 1. First Launch & Onboarding

- [ ] App opens without crashing.
- [ ] You see the **login / sign up** screen (email + password).
- [ ] Screen looks correct (no broken layout, text readable).

---

## 2. Account — Sign Up

- [ ] Tap or switch to **Sign up** (or “Create account”).
- [ ] Enter a **valid email** and **password** (e.g. at least 6 characters).
- [ ] Tap **Sign up** (or equivalent).
- [ ] You see a success message (e.g. “Account created. You can now sign in.”) or are taken to login.
- [ ] **No** error message for a valid email/password.

---

## 3. Account — Sign In

- [ ] Enter the **same email and password** you used to sign up.
- [ ] Tap **Sign in** (or **Login**).
- [ ] You are taken to the **main daily wisdom screen** (verse, reflection, action).
- [ ] You do **not** see “Invalid login” or similar for correct credentials.

---

## 4. Main Screen (Daily Wisdom)

- [ ] You see **today’s verse** (Arabic and/or translation).
- [ ] You see **reflection** and **action** (or similar) content.
- [ ] A **background image** loads (nature/landscape). If it fails, a gradient may show instead (acceptable).
- [ ] You see **trial** information (e.g. “X days left” in trial).
- [ ] You can open **Settings** (gear or menu) and **Archive** (or “Past wisdom”) if the app has those.

---

## 5. Trial & Paywall

- [ ] As a **new user**, you can read today’s content (trial active).
- [ ] You see an option to **upgrade** or **unlock lifetime** (e.g. on main screen or in Settings).
- [ ] Tapping upgrade / “Get Lifetime Access” (or similar) opens the **paywall** (price ₹899, benefits list).
- [ ] **Terms & Conditions** and **Refund policy** links open (or show in a modal) and are readable.

---

## 6. Payment Flow (Critical)

- [ ] On the paywall, tap **Get Lifetime Access — ₹899** (or the main payment button).
- [ ] **Razorpay** payment screen opens (browser or in-app).
- [ ] You can enter card/UPI details (use **test card** in test mode if available).
- [ ] Complete the payment (test or real, as agreed with the developer).
- [ ] After success, you are returned to the app.
- [ ] You see a **success** state (e.g. “Lifetime Access Unlocked” or similar).
- [ ] You do **not** see “Payment verification failed” or “Contact support” after a successful payment.

---

## 7. Premium Status After Payment

- [ ] After a successful payment, the main screen shows **full access** (no lock or “trial expired” on today’s content).
- [ ] In **Settings**, the **Plan** (or “Account”) section shows **Lifetime Premium** (or similar).
- [ ] You can open **Archive** (past wisdom) and see past days’ content without being blocked.

---

## 8. Settings

- [ ] **Settings** panel opens from the main screen.
- [ ] Your **email** is shown correctly.
- [ ] **Member since** (or “Join date”) shows a date.
- [ ] **Plan** shows either “Free Trial — X days left” or “Lifetime Premium” as appropriate.
- [ ] You can change **notification time** (e.g. daily reminder) and tap **Save**; no crash, and ideally a success state.
- [ ] If **Lifetime Premium** is shown after payment, a positive message (e.g. “Lifetime Unlocked”) is visible where expected.

---

## 9. Archive (Past Wisdom)

- [ ] **Archive** (or “Past wisdom” / “History”) opens from the main screen.
- [ ] If you are on **trial**, you may see a lock or “Upgrade to view” for some content (expected).
- [ ] If you are **premium**, you can open past days and read verse, reflection, and action.
- [ ] List or calendar of past days loads; no crash or blank screen.

---

## 10. Sign Out & Sign Back In

- [ ] From Settings (or main screen), tap **Sign out** (or “Log out”).
- [ ] You are returned to the **login / sign up** screen.
- [ ] Sign in again with the **same** email and password.
- [ ] You see the **same** account: trial days or **Lifetime Premium** still correct (no reset).

---

## 11. Edge Cases (Optional but Recommended)

- [ ] **Wrong password**: Sign in with wrong password → you see an error (e.g. “Invalid login credentials”), no crash.
- [ ] **Invalid email**: Sign up with invalid email (e.g. “abc”) → you see an error or validation message.
- [ ] **Close app during payment**: Start payment, then close the app before completing. Reopen, sign in — either premium is already set (webhook) or you can retry payment; no crash.
- [ ] **No internet**: Turn off Wi‑Fi and mobile data, open app — you see an error or offline behavior, no endless loading or crash.

---

## 12. General

- [ ] No **crashes** during normal use.
- [ ] No **blank white/black screens** (except brief loading if any).
- [ ] **Text** is readable (no cut-off, wrong language, or placeholder “Lorem ipsum”).
- [ ] **Buttons** and links respond to taps.
- [ ] **Back** or **close** from Settings/Archive returns to the main screen as expected.

---

## Reporting Issues

For each failed item, please note:

- **What you did** (e.g. “Tapped Sign in after entering email and password”).
- **What you expected** (e.g. “Main screen with today’s verse”).
- **What happened** (e.g. “App crashed” or “Error: Invalid login”).
- **Device** (e.g. “Samsung Galaxy, Android 14”) and **app version** if visible (e.g. in Settings).

Send this to the developer (e.g. by email or shared doc) so they can fix before full release.

---

**Thank you for testing. Your feedback helps make the app better for everyone.**
