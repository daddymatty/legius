/**
 * LEGIUS — lead-form → Telegram proxy (Cloudflare Worker).
 *
 * Keeps the bot token server-side (as an encrypted Worker secret), so it is
 * NEVER exposed in the static site's source. The site form POSTs JSON here;
 * this worker validates it and forwards a formatted message to Telegram.
 *
 * Required secrets (set with `wrangler secret put` or in the dashboard):
 *   BOT_TOKEN  — Telegram bot token from @BotFather
 *   CHAT_ID    — target chat id (your group / personal chat with the bot)
 *
 * Optional var:
 *   ALLOWED_ORIGINS — comma-separated list (defaults below)
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

export default {
  async fetch(request, env) {
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

    const text =
      `🟢 <b>Нова заявка — LEGIUS</b>\n\n` +
      `👤 <b>Імʼя:</b> ${esc(name)}\n` +
      `📞 <b>Телефон:</b> ${esc(phone)}\n` +
      (email ? `✉️ <b>E-mail:</b> ${esc(email)}\n` : "") +
      (message ? `📝 <b>Повідомлення:</b> ${esc(message)}\n` : "") +
      `\n📍 <b>Форма:</b> ${esc(source)}\n` +
      `🔗 <b>Сторінка:</b> ${esc(page)}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const detail = await tgRes.text().catch(() => "");
      return json({ ok: false, error: "telegram", detail: detail.slice(0, 200) }, 502);
    }
    return json({ ok: true });
  },
};
