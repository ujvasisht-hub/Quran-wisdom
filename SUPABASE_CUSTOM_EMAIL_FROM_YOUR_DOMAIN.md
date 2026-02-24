# Send Supabase Auth Emails From contact@evrydaysolutions.com

Supabase Auth (sign-up confirmation, password reset, magic links, etc.) uses its own mailer by default. To send those emails **from your domain address** (`contact@evrydaysolutions.com`), you need to configure **custom SMTP** in your Supabase project and use an SMTP server that can send from that address.

---

## Overview

1. **Get SMTP credentials** that can send from `contact@evrydaysolutions.com`.
2. **Configure custom SMTP** in the Supabase Dashboard.
3. **(Recommended)** Set up **SPF/DKIM** for `evrydaysolutions.com` so emails don’t land in spam.

---

## Step 1: Get SMTP credentials for contact@evrydaysolutions.com

You have two main options.

### Option A: Use your existing email host (if you already have contact@evrydaysolutions.com)

If you already use **contact@evrydaysolutions.com** with a provider (e.g. **Google Workspace**, **Microsoft 365**, **Zoho Mail**, or your domain host’s email), use that provider’s SMTP:

- **Host** – e.g. `smtp.gmail.com`, `smtp.office365.com`, or the host your provider gives.
- **Port** – usually `587` (TLS) or `465` (SSL).
- **User** – full email: `contact@evrydaysolutions.com`.
- **Password** – the password for that mailbox, or an **app password** if the provider requires it (e.g. Gmail).

**Gmail / Google Workspace:**  
Use an [App Password](https://support.google.com/accounts/answer/185833) for the account; do not use the normal account password with SMTP.

**Microsoft 365:**  
Use the account password or an app password if you have modern auth enabled.

Write down: **Host**, **Port**, **User** (`contact@evrydaysolutions.com`), **Password**.

---

### Option B: Use a transactional email provider (Resend, SendGrid, etc.)

If you don’t have a mailbox for `contact@evrydaysolutions.com` yet, use a transactional provider and verify your domain:

1. Sign up for a provider that supports SMTP and custom “From” address, for example:
   - [Resend](https://resend.com) (works well with Supabase)
   - [SendGrid](https://sendgrid.com)
   - [Brevo](https://brevo.com)
   - [Postmark](https://postmarkapp.com)
2. Add and **verify** the domain **evrydaysolutions.com** (they’ll give you DNS records: SPF, DKIM, etc.).
3. In the provider’s dashboard, create an **API key** or get **SMTP credentials**.
4. Set the “From” address to **contact@evrydaysolutions.com** (most allow this once the domain is verified).
5. Note the **SMTP host**, **port**, **username**, and **password** they provide.

Example for **Resend**:  
[Send email with Supabase using Resend SMTP](https://resend.com/docs/send-with-supabase-smtp) – after domain verification you can use `contact@evrydaysolutions.com` as the sender.

---

## Step 2: Configure custom SMTP in Supabase

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and select your project (e.g. the one used by Quran Wisdom).
2. In the left sidebar go to **Authentication** → **SMTP** (or **Providers** → **Email** depending on UI; the direct link is usually `https://supabase.com/dashboard/project/<YOUR_PROJECT_REF>/auth/smtp`).
3. Enable **Custom SMTP** (or “Use custom SMTP”).
4. Fill in:

   | Field | What to enter |
   |-------|-------------------------------|
   | **Sender email** (or “From” / “Admin email”) | `contact@evrydaysolutions.com` |
   | **Sender name** | e.g. `Quran Wisdom` or `Evryday Solutions` |
   | **Host** | Your SMTP host (e.g. `smtp.gmail.com`, `smtp.resend.com`) |
   | **Port** | `587` (TLS) or `465` (SSL) – match your provider |
   | **Username** | Usually `contact@evrydaysolutions.com` or the value the provider gives |
   | **Password** | SMTP password or app password |

5. Save.

After this, Supabase Auth will send all auth emails (confirm signup, reset password, magic link, etc.) **from** `contact@evrydaysolutions.com` via your SMTP server.

---

## Step 3: (Recommended) Improve deliverability – SPF and DKIM

To reduce the chance of emails going to spam:

1. **SPF** – Add a TXT record for `evrydaysolutions.com` (or the subdomain your provider uses) as instructed by your email/SMTP provider.
2. **DKIM** – Add the CNAME/TXT records they give you for DKIM.
3. **DMARC** (optional but good) – Add a DMARC TXT record for the domain.

Your SMTP provider’s docs (Resend, SendGrid, Gmail, etc.) will list the exact DNS records and values. Add them in the place where you manage DNS for **evrydaysolutions.com** (e.g. Cloudflare, Namecheap, GoDaddy).

---

## Step 4: Optional – Rate limits and templates

- **Rate limits:** After enabling custom SMTP, Supabase may apply a default limit (e.g. 30 emails/hour). You can change this under **Authentication** → **Rate Limits** in the dashboard.
- **Templates:** You can customize the text of confirmation, reset, magic link, etc. under **Authentication** → **Email Templates**. The “From” address is already set by the SMTP config above.

---

## Quick checklist

- [ ] SMTP credentials that can send from `contact@evrydaysolutions.com` (existing email host or transactional provider with domain verified).
- [ ] Supabase Dashboard → **Authentication** → **SMTP** → Custom SMTP enabled.
- [ ] **Sender email** = `contact@evrydaysolutions.com`, **Sender name** set, Host/Port/User/Password correct and saved.
- [ ] (Recommended) SPF/DKIM (and optionally DMARC) set for `evrydaysolutions.com`.
- [ ] Test: trigger a “Forgot password” or sign-up confirmation and confirm the email is from `contact@evrydaysolutions.com` and lands in inbox (not spam).

---

## If you don’t have SMTP yet

- **Fast path:** Sign up for [Resend](https://resend.com), add and verify `evrydaysolutions.com`, create an API key, then use Resend’s SMTP settings in Supabase with sender `contact@evrydaysolutions.com`.
- **Already have contact@evrydaysolutions.com in Gmail/Outlook/etc.:** Use that provider’s SMTP and an app password (Option A above).

No code changes are required in your app; only Supabase Dashboard configuration and (optionally) DNS for your domain.
