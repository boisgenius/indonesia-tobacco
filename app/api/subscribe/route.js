import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'connect@indonesiatobacco.com';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Indonesia Tobacco <notifications@indonesiatobacco.com>';
const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Store email with timestamp
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    let isNew = true;
    let stored = false;

    if (hasKvConfig) {
      try {
        // Add to a set (prevents duplicates)
        isNew = await kv.sadd('emails', email);

        // Also store with timestamp for reference
        await kv.hset('email_details', {
          [email]: timestamp
        });
        stored = true;
      } catch (storageError) {
        console.error('Failed to store subscriber email:', storageError);
      }
    } else {
      console.error('KV not configured — subscriber email NOT stored:', email);
    }

    // Send notification email for new subscribers.
    // This also acts as a capture net: if storage is down, the notification
    // still fires so the lead can be recovered from the inbox.
    if (isNew && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `${stored ? '🚀' : '⚠️'} New Subscriber: ${email}${stored ? '' : ' (NOT STORED — DB down)'}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
              ${stored ? '' : '<div style="padding: 12px 32px; background: #4a1a1a; color: #ffb3b3; font-size: 12px; text-align: center;">⚠️ Storage was unavailable — this subscriber was NOT saved to the database. Add them manually once storage is restored.</div>'}
              <div style="padding: 32px; text-align: center; background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);">
                <h1 style="color: #fff; font-size: 20px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.02em;">NEW SUBSCRIBER</h1>
                <p style="color: #666; font-size: 13px; margin: 0;">Indonesia Tobacco Mailing List</p>
              </div>
              <div style="padding: 28px 32px;">
                <div style="background: #111; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #222;">
                  <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Email Address</p>
                  <p style="color: #fff; font-size: 16px; font-weight: 500; margin: 0;">${email}</p>
                </div>
                <div style="background: #111; border-radius: 8px; padding: 16px; border: 1px solid #222;">
                  <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Signed Up</p>
                  <p style="color: #fff; font-size: 14px; margin: 0;">${formattedDate}</p>
                </div>
              </div>
              <div style="padding: 16px 32px 24px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://indonesiatobacco.com'}/admin" style="display: inline-block; background: #fff; color: #000; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 500; text-decoration: none;">View All Subscribers</a>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        // Log but don't fail the subscription if notification fails
        console.error('Failed to send notification email:', emailError);
      }
    }

    // Don't fake success: if the email wasn't actually stored, tell the client.
    // The lead is still captured via the notification email above.
    if (!stored) {
      return NextResponse.json(
        { error: 'Subscription is temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}

// GET route to retrieve all emails (protect this in production!)
export async function GET() {
  if (!hasKvConfig) {
    return NextResponse.json({
      count: 0,
      emails: [],
      details: {},
      storageAvailable: false
    });
  }

  try {
    // Get all emails
    const emails = await kv.smembers('emails');
    const details = await kv.hgetall('email_details');

    return NextResponse.json({
      count: emails.length,
      emails,
      details,
      storageAvailable: true
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({
      count: 0,
      emails: [],
      details: {},
      storageAvailable: false
    });
  }
}
