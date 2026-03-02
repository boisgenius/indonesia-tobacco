import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = 'connect@indonesiatobacco.com';

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
    
    // Add to a set (prevents duplicates)
    const isNew = await kv.sadd('emails', email);
    
    // Also store with timestamp for reference
    await kv.hset('email_details', {
      [email]: timestamp
    });

    // Send notification email for new subscribers
    if (isNew) {
      try {
        await resend.emails.send({
          from: 'Indonesia Tobacco <notifications@indonesiatobacco.com>',
          to: NOTIFY_EMAIL,
          subject: `🚀 New Subscriber: ${email}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
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
export async function GET(request) {
  try {
    // Get all emails
    const emails = await kv.smembers('emails');
    const details = await kv.hgetall('email_details');
    
    return NextResponse.json({ 
      count: emails.length,
      emails,
      details 
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
