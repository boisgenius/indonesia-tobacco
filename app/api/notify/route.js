export async function POST(request) {
  try {
    const { page, referrer, device } = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return Response.json({ ok: false });

    // Vercel injects these geo headers automatically
    const country = request.headers.get('x-vercel-ip-country') || '?';
    const city = request.headers.get('x-vercel-ip-city') || '?';
    const region = request.headers.get('x-vercel-ip-region') || '?';

    const lines = [
      `🌿 *Indonesia Tobacco — New Visitor*`,
      `📄 Page: \`${page}\``,
      `📍 Location: ${city}, ${region}, ${country}`,
      device ? `📱 Device: ${device}` : null,
      referrer ? `🔗 From: ${referrer}` : null,
    ].filter(Boolean).join('\n');

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: 'Markdown' }),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
