# Fix: "Connection not secure" (HTTPS) and site not opening on some devices

Use this guide when **quranwisdom.evrydaysolutions.com** shows "This connection is not secure" in Safari (or other browsers), **"This site can't be reached" with DNS_PROBE_FINISHED_NXDOMAIN**, or when the site doesn’t open on some devices or networks.

---

## "This site can't be reached" — DNS_PROBE_FINISHED_NXDOMAIN

**What it means:** The browser could not resolve **quranwisdom.evrydaysolutions.com** to any server. DNS is returning "this domain does not exist" (NXDOMAIN). So the problem is **DNS configuration**, not your app code.

**Why it appears on only some devices:** Different networks use different DNS servers (e.g. your ISP, mobile carrier, office Wi‑Fi). If the CNAME for `quranwisdom` is missing, wrong, or not yet propagated, some resolvers will return NXDOMAIN and you’ll see this error on those networks/devices.

**What to do:**

- **If evrydaysolutions.com nameservers are at Cloudflare** (GoDaddy says “nameservers aren’t managed by us”): you manage DNS only in Cloudflare. There is **no quranwisdom record** in your Cloudflare DNS yet — that’s why you see NXDOMAIN. Follow the step-by-step guide: **[SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md](SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md)** to add the CNAME in Cloudflare and set the custom domain in Pages.
- **If you still managed DNS at GoDaddy** (you have not moved nameservers to Cloudflare): add or fix the CNAME at GoDaddy as in the old steps below; Cloudflare Pages will show the exact target under Custom domains.

**After the CNAME is in place (Cloudflare or GoDaddy):**

1. **Verify the custom domain in Cloudflare Pages**  
   [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → your Quran Wisdom project → **Custom domains**. **quranwisdom.evrydaysolutions.com** should be listed and **Active**.

2. **Check propagation**  
   Go to [whatsmydns.net](https://www.whatsmydns.net) and search for **quranwisdom.evrydaysolutions.com**. If many locations show "Record not found", wait 30 minutes–24 hours and check again.

3. **On the device that showed the error**  
   Try another network (e.g. mobile data or different Wi‑Fi); clear browser cache or use a private/incognito window.

Once the CNAME exists where you manage DNS (Cloudflare) and the custom domain is active in Cloudflare Pages, NXDOMAIN should go away as DNS propagates (usually within a few hours; sometimes up to 48 hours on some carriers).

---

## Why this happens

1. **"Not secure" in Safari/browsers**  
   The browser is either:
   - Opening **http://** (no **s**) and the server isn’t redirecting to HTTPS, or  
   - Reaching a server that doesn’t have a valid HTTPS certificate for that domain.

2. **Site not opening on some devices**  
   Often:
   - **DNS**: That device/network is using an old or wrong DNS result (e.g. still pointing to GoDaddy or an old host).  
   - **Caching**: Browser or network cache is keeping an old or broken URL.

So the fix is: **always use HTTPS** and make sure **DNS and hosting** are correct and **HTTPS is enforced** where the domain points.

---

## 1. Always use HTTPS when opening or sharing the link

- **Correct:** `https://quranwisdom.evrydaysolutions.com`  
- **Wrong:** `http://quranwisdom.evrydaysolutions.com` or `quranwisdom.evrydaysolutions.com` (some clients may default to HTTP)

When you share the link (e.g. in Play Store, emails, docs), use **https://** at the start so no one lands on HTTP.

---

## 2. Enforce HTTPS in Cloudflare (where the site is hosted)

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. If **evrydaysolutions.com** is added as a zone in Cloudflare:
   - Go to **SSL/TLS**.
   - Set encryption mode to **Full** or **Full (strict)** (not "Flexible").
   - In **SSL/TLS → Edge Certificates**, turn **Always Use HTTPS** **On**.
3. If the site is only on **Cloudflare Pages** (no zone for evrydaysolutions.com):
   - Pages serves over HTTPS by default for your custom domain.
   - In **Pages → your project → Custom domains**, ensure **quranwisdom.evrydaysolutions.com** is listed and shows a valid certificate (e.g. “Active”).
   - If it shows a warning, use “Verify” or “Re-provision certificate” and wait a few minutes.

This makes sure traffic to your domain is forced to HTTPS and uses a valid certificate.

---

## 3. Check DNS (Cloudflare or GoDaddy)

The subdomain **quranwisdom** must point to your Cloudflare Pages project. **If your nameservers are at Cloudflare** (GoDaddy says "nameservers aren't managed by us"), manage DNS only in Cloudflare — see **[SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md](SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md)**. If nameservers are still at GoDaddy, use the steps below.

1. Log in at [GoDaddy](https://www.godaddy.com) → **My Products** → **evrydaysolutions.com** → **DNS** (or **Manage DNS**).
2. Find the **CNAME** record for **quranwisdom** (or **quranwisdom.evrydaysolutions.com**).
3. It should look like:
   - **Name:** `quranwisdom`
   - **Value / Points to:** your Cloudflare Pages URL, e.g. `quranwisdom.pages.dev` (exactly as shown in Cloudflare Pages → Custom domains).
4. If it points to anything else (e.g. an old Bolt URL, or an IP, or a different host), **edit** it to the Cloudflare Pages URL above. Remove any other **A** or **CNAME** for **quranwisdom** that might send traffic elsewhere.
5. Save and wait 10–30 minutes (sometimes up to 48 hours) for DNS to update everywhere.

If DNS was wrong, some devices would have been opening the old server (no or bad HTTPS), which matches “not secure” and “not opening.”

---

## 4. Root domain evrydaysolutions.com not opening

**evrydaysolutions.com** (without **quranwisdom.**) is a separate host. It’s likely still on GoDaddy (e.g. Website Builder or old hosting).

- If it’s not on Cloudflare: its HTTPS depends on **GoDaddy**. In the GoDaddy product for that domain, enable **SSL/HTTPS** (e.g. “SSL Certificate” or “HTTPS” in the hosting/site settings) and, if available, “Force HTTPS” or “Redirect HTTP to HTTPS.”
- If **evrydaysolutions.com** is on Cloudflare: follow the same SSL steps as in section 2 (Full or Full (strict), Always Use HTTPS).

So: fix HTTPS and redirect on the place where **evrydaysolutions.com** is actually hosted (GoDaddy or Cloudflare).

---

## 5. What to do on the device that showed “not secure”

1. **Use the exact HTTPS link:**  
   In the address bar type or paste:  
   `https://quranwisdom.evrydaysolutions.com`  
   and press Enter.
2. **Clear cache (Safari):**  
   **Settings → Safari → Clear History and Website Data** (or only “Website Data” if you prefer). Then open the link again.
3. **Try another network:**  
   e.g. switch between Wi‑Fi and mobile data to see if one still has old DNS.

---

## 6. Quick checklist

| Check | Action |
|--------|--------|
| **NXDOMAIN / "Site can't be reached"** | **DNS in Cloudflare:** add CNAME `quranwisdom` → Pages URL in evrydaysolutions.com zone (see [SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md](SETUP_QURANWISDOM_DNS_STEP_BY_STEP.md)). Pages: custom domain Active; check [whatsmydns.net](https://www.whatsmydns.net) |
| Link used | Always **https://**quranwisdom.evrydaysolutions.com |
| Cloudflare Pages | Custom domain active; certificate valid; no SSL errors |
| Cloudflare (if zone exists) | SSL = Full or Full (strict); Always Use HTTPS = On |
| DNS for **quranwisdom** | CNAME in Cloudflare (or GoDaddy if nameservers there) → Cloudflare Pages URL only; Proxied = on in Cloudflare |
| evrydaysolutions.com | SSL enabled and “Force HTTPS” where it’s hosted (GoDaddy or Cloudflare) |
| Device | Clear Safari (or browser) cache; try HTTPS link again |

---

## 7. If it still fails

- **Check from another device/network:** e.g. phone on mobile data, or a friend’s network. If it works there, the issue is likely cached DNS or network on the original device.
- **Check DNS propagation:** Use [whatsmydns.net](https://www.whatsmydns.net) for **quranwisdom.evrydaysolutions.com** and confirm it resolves to Cloudflare (e.g. Cloudflare IPs or the Pages hostname). If some locations show a different IP, wait for propagation or fix the record at GoDaddy.
- **Contact Cloudflare support** if the custom domain on Pages keeps showing certificate or HTTPS errors after the above.

---

*Summary: Use **https://** always; point **quranwisdom** only to Cloudflare Pages in GoDaddy; enforce HTTPS in Cloudflare; fix SSL for **evrydaysolutions.com** where it’s hosted; clear cache and retry.*
