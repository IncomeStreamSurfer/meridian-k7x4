import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendWelcomeEmail } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, url }) => {
  let payload: Record<string, unknown> = {};
  const ct = request.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }
  } catch (_e) {
    payload = {};
  }

  const email = String(payload.email || '').trim().toLowerCase();
  const source = String(payload.source || 'homepage').slice(0, 64);
  // Honeypot — bots fill this, humans don't
  const botField = String(payload.website || '');

  if (botField) {
    return redirectOrJson(request, url, '/thanks', { ok: true });
  }

  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return redirectOrJson(request, url, '/?error=invalid', {
      ok: false,
      error: 'Please enter a valid email address.',
    });
  }

  const ua = request.headers.get('user-agent')?.slice(0, 200) ?? null;

  const { error } = await supabase.from('meridian_waitlist').insert({
    email,
    source,
    user_agent: ua,
  });

  // Treat unique-violation (already on list) as success
  if (error && error.code !== '23505') {
    console.error('[waitlist] insert error', error);
    return redirectOrJson(request, url, '/?error=server', {
      ok: false,
      error: 'Something went wrong. Please try again.',
    });
  }

  // Fire-and-forget welcome email
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;
  sendWelcomeEmail(email, siteUrl).catch((e) => console.warn('email err', e));

  return redirectOrJson(request, url, '/thanks', { ok: true });
};

function redirectOrJson(
  request: Request,
  url: URL,
  redirectPath: string,
  jsonBody: Record<string, unknown>
) {
  const accept = request.headers.get('accept') || '';
  const wantsJson =
    accept.includes('application/json') ||
    request.headers.get('x-requested-with') === 'fetch';

  if (wantsJson) {
    return new Response(JSON.stringify(jsonBody), {
      status: jsonBody.ok ? 200 : 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  return Response.redirect(new URL(redirectPath, url), 303);
}
