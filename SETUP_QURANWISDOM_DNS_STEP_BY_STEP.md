# Step-by-step: Fix quranwisdom.evrydaysolutions.com (DNS in Cloudflare)

You moved **evrydaysolutions.com** nameservers to Cloudflare. So:

- **GoDaddy** no longer manages DNS — that’s why it says “We can't display your DNS information because your nameservers aren't managed by us.” You can ignore that; it’s normal.
- **Cloudflare** is where you manage DNS for evrydaysolutions.com.

Your Cloudflare DNS has records for `app` and for the main site, but **there is no record for quranwisdom**. So **quranwisdom.evrydaysolutions.com** doesn’t resolve yet. Follow the steps below to add it.

---

## Part 1: Get the Cloudflare Pages address (target for quranwisdom)

1. Open a browser and go to: **https://dash.cloudflare.com**
2. Log in to your Cloudflare account.
3. In the left sidebar, click **Workers & Pages** (or **Pages**).
4. Under **Pages**, click your **Quran Wisdom** project (the one you deploy the marketing site to).
5. Click the **Custom domains** tab (or **Domains**).
6. Look for **quranwisdom.evrydaysolutions.com**:
   - If it’s **already listed** and shows “Active” and “SSL enabled”: the **CNAME target** is not shown in the Custom domains list. Clicking the three dots (⋯) and **“Manage Cloudflare DNS”** takes you to the evrydaysolutions.com DNS page — that’s where you’ll add the record in Part 2. For a project named **quranwisdom**, the target to use is **`quranwisdom.pages.dev`**.
   - If it’s **not listed**: click **Set up a custom domain** (or **Add custom domain**), type **quranwisdom.evrydaysolutions.com**, and add it. Cloudflare will show you a **CNAME target** (e.g. `your-project.pages.dev`). Copy that exact address — that’s what you’ll enter in Part 2.

---

## Part 2: Add the quranwisdom DNS record in Cloudflare

**Important:** In the **Target** field you must enter the **.pages.dev** address from Part 1 (e.g. `quranwisdom-xxxx.pages.dev`). Do **not** enter `quranwisdom.evrydaysolutions.com` as the Target — that causes the error “CNAME content cannot reference itself.”

1. Stay in Cloudflare. In the left sidebar, click **Websites** (or **Sites**).
2. Click **evrydaysolutions.com**.
3. Click **DNS** in the left menu (under that domain). You’ll see the list of records (like `app`, `evrydaysolutions.com`, `www`, etc.).
4. Click the **Add record** button (top right).
5. Fill in:
   - **Type:** choose **CNAME** (from the dropdown).
   - **Name:** type exactly: **quranwisdom**  
     (Cloudflare will treat it as quranwisdom.evrydaysolutions.com.)
   - **Target:** paste the address you got from **Part 1** — it must be the **Cloudflare Pages** hostname that **ends in `.pages.dev`** (e.g. `quranwisdom-xxxx.pages.dev` or `your-project.pages.dev`).  
     - Use **only** that hostname (no `https://`, no `/`, no spaces).
     - **Do not** put `quranwisdom.evrydaysolutions.com` in the Target — that causes “CNAME content cannot reference itself.” The Target must be the **.pages.dev** address from Part 1.
   - **Proxy status:** turn **Proxied** on (orange cloud). This gives you HTTPS and better security.
6. Click **Save**.

You should now see a new row in the table: **quranwisdom** → CNAME → (your Pages address) → **Proxied**.

---

## Part 3: Make sure the custom domain is active in Pages

1. Go back to **Workers & Pages** → your **Quran Wisdom** project → **Custom domains**.
2. Check **quranwisdom.evrydaysolutions.com**:
   - If it shows **Active** or a green check, you’re done.
   - If it shows “Pending” or “Needs configuration”, wait 2–5 minutes and refresh. Cloudflare will issue the SSL certificate once the CNAME from Part 2 is in place.
   - If there’s a **Verify** or **Retry** button, click it.

---

## Part 4: Wait and test

- DNS can take **a few minutes to about an hour** to update. On some mobile networks it can take longer (up to a few hours).
- On your phone or computer, open: **https://quranwisdom.evrydaysolutions.com**
- If it still says “This site can’t be reached” or “not secure”, wait 30 minutes and try again, or try from another network (e.g. mobile data vs Wi‑Fi).

---

## Quick recap

| Where | What you did |
|--------|----------------|
| **GoDaddy** | Nothing — DNS is at Cloudflare; the “can’t display DNS” message is expected. |
| **Cloudflare DNS** (evrydaysolutions.com) | Added a **CNAME** record: **Name** = `quranwisdom`, **Target** = your Pages project address (e.g. `….pages.dev`), **Proxied** = on. |
| **Cloudflare Pages** (Quran Wisdom project) | Made sure **quranwisdom.evrydaysolutions.com** is added under Custom domains and is Active. |

After this, **quranwisdom.evrydaysolutions.com** should open over HTTPS on all devices once DNS has propagated.
