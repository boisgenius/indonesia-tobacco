import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

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
    
    // Add to a set (prevents duplicates)
    await kv.sadd('emails', email);
    
    // Also store with timestamp for reference
    await kv.hset('email_details', {
      [email]: timestamp
    });

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
