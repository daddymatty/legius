/**
 * LEGIUS — lead-form → Telegram + Zoho CRM proxy (Cloudflare Worker).
 *
 * Keeps the bot token server-side (as an encrypted Worker secret), so it is
 * NEVER exposed in the static site's source. The site form POSTs JSON here;
 * this worker validates it, forwards a formatted message to Telegram and
 * (optionally) creates a Lead in Zoho CRM.
 *
 * Required secrets (set with `wrangler secret put` or in the dashboard):
 *   BOT_TOKEN  — Telegram bot token from @BotFather
 *   CHAT_ID    — target chat id (your group / personal chat with the bot)
 *
 * Optional vars:
 *   THREAD_ID        — forum topic id, to post into a specific group topic
 *   TURNSTILE_SECRET — Cloudflare Turnstile secret; if set, the worker verifies
 *                      the cf-turnstile-response token before sending (anti-spam)
 *   ALLOWED_ORIGINS  — comma-separated list (defaults below)
 *
 * Optional Zoho CRM integration (enabled when all three secrets are set):
 *   ZOHO_CLIENT_ID     — Self Client ID (api-console.zoho.eu)
 *   ZOHO_CLIENT_SECRET — Self Client secret
 *   ZOHO_REFRESH_TOKEN — OAuth refresh token (scope ZohoCRM.modules.leads.CREATE)
 *   ZOHO_ACCOUNTS_BASE — optional, default https://accounts.zoho.eu
 *   ZOHO_API_BASE      — optional, default https://www.zohoapis.eu
 */

const DEFAULT_ORIGINS = [
  "https://legius.com.ua",
  "https://www.legius.com.ua",
  "https://daddymatty.github.io", // pre-domain testing
];

function corsHeaders(origin, allowed) {
  const ok = origin && allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- Zoho CRM: create a Lead (fire-and-forget) ---------- */

let zohoToken = null; /* { value, expires } — кешується між викликами воркера */

async function zohoAccessToken(env) {
  if (zohoToken && zohoToken.expires > Date.now()) return zohoToken.value;
  const base = env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.eu";
  const params = new URLSearchParams({
    refresh_token: env.ZOHO_REFRESH_TOKEN,
    client_id: env.ZOHO_CLIENT_ID,
    client_secret: env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  const res = await fetch(`${base}/oauth/v2/token`, { method: "POST", body: params });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) throw new Error("zoho token: " + JSON.stringify(data).slice(0, 200));
  zohoToken = { value: data.access_token, expires: Date.now() + 50 * 60 * 1000 };
  return zohoToken.value;
}

async function zohoCreateLead(env, { name, phone, email, message, source, page }) {
  const token = await zohoAccessToken(env);
  const api = env.ZOHO_API_BASE || "https://www.zohoapis.eu";
  const lead = {
    Last_Name: name,                       /* обов'язкове поле модуля Leads */
    Phone: phone,
    Lead_Source: "Website",
    Description:
      (message ? `Повідомлення: ${message}\n` : "") +
      (source ? `Форма: ${source}\n` : "") +
      (page ? `Сторінка: ${page}` : ""),
  };
  if (email) lead.Email = email;
  const res = await fetch(`${api}/crm/v8/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [lead] }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error("zoho lead: " + res.status + " " + detail.slice(0, 200));
  }
}

export default {
  async fetch(request, env, ctx) {
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(","))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, allowed);
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "json" }, 400);
    }

    // Honeypot: real users never fill this hidden field.
    if (data.company) return json({ ok: true }); // pretend success, drop silently

    const name = (data.name || "").toString().trim().slice(0, 120);
    const phone = (data.phone || "").toString().trim().slice(0, 40);
    const email = (data.email || "").toString().trim().slice(0, 120);
    const message = (data.message || "").toString().trim().slice(0, 2000);
    const source = (data.source || "site").toString().slice(0, 60);
    const page = (data.page || "").toString().slice(0, 200);

    if (!name || !phone) return json({ ok: false, error: "required" }, 422);

    // Optional Cloudflare Turnstile verification (enforced only if secret is set).
    if (env.TURNSTILE_SECRET) {
      const token = data["cf-turnstile-response"];
      if (!token) return json({ ok: false, error: "captcha" }, 403);
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const vr = await verify.json().catch(() => ({ success: false }));
      if (!vr.success) return json({ ok: false, error: "captcha" }, 403);
    }

    const text =
      `🟢 <b>Нова заявка — LEGIUS</b>\n\n` +
      `👤 <b>Імʼя:</b> ${esc(name)}\n` +
      `📞 <b>Телефон:</b> ${esc(phone)}\n` +
      (email ? `✉️ <b>E-mail:</b> ${esc(email)}\n` : "") +
      (message ? `📝 <b>Повідомлення:</b> ${esc(message)}\n` : "") +
      `\n📍 <b>Форма:</b> ${esc(source)}\n` +
      `🔗 <b>Сторінка:</b> ${esc(page)}`;

    const payload = {
      chat_id: env.CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };
    if (env.THREAD_ID) payload.message_thread_id = Number(env.THREAD_ID);

    const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!tgRes.ok) {
      const detail = await tgRes.text().catch(() => "");
      return json({ ok: false, error: "telegram", detail: detail.slice(0, 200) }, 502);
    }

    /* Zoho CRM — не блокує відповідь користувачу і не ламає заявку при збої:
       Telegram лишається основним каналом, CRM — дублювання для обліку. */
    if (env.ZOHO_REFRESH_TOKEN && env.ZOHO_CLIENT_ID && env.ZOHO_CLIENT_SECRET) {
      ctx.waitUntil(
        zohoCreateLead(env, { name, phone, email, message, source, page }).catch((e) =>
          console.log("zoho lead failed:", e.message)
        )
      );
    }

    return json({ ok: true });
  },
};
