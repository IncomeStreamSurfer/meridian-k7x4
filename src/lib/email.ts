// Resend helper — simple REST wrapper
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

export async function sendWelcomeEmail(to: string, siteUrl: string) {
  if (!RESEND_API_KEY) {
    console.warn('[resend] No RESEND_API_KEY set; skipping welcome email');
    return { ok: false, skipped: true };
  }

  const subject = 'You’re on the Meridian list.';
  const html = `<!doctype html><html><body style="background:#141110;color:#f5f1ea;font-family:Georgia,serif;padding:48px 24px;">
    <div style="max-width:520px;margin:0 auto;">
      <p style="letter-spacing:4px;font-size:12px;color:#8c857d;text-transform:uppercase;">Meridian · Specialty Coffee</p>
      <h1 style="font-size:28px;line-height:1.2;margin:24px 0;">Good taste confirmed.</h1>
      <p style="font-size:16px;line-height:1.6;color:#d7d1c7;">
        Thanks for joining the Meridian waitlist. We’re working quietly on our first-roast drops — traceable beans from a short list of growers we’ve chosen one harvest at a time.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#d7d1c7;">
        You’ll hear from us before launch with origin stories, a look inside the roastery, and early access to the first release.
      </p>
      <p style="margin-top:32px;">
        <a href="${siteUrl}" style="color:#b84d2f;text-decoration:underline;">Back to the site</a>
      </p>
      <p style="margin-top:48px;font-size:12px;color:#8c857d;">— The Meridian Team</p>
    </div>
  </body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Meridian <onboarding@resend.dev>',
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn('[resend] send failed', res.status, txt);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.warn('[resend] send error', err);
    return { ok: false };
  }
}
