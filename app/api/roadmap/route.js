import crypto from 'crypto';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DOC_KEY = 'roadmap:v1';
const HISTORY_KEY = 'roadmap:history';
const HISTORY_LIMIT = 20;
const BRANCH_LIMIT = 50;
const BRANCH_WORD_LIMIT = 6;
const BRANCH_TITLE_MAX_CHARS = 60;
// Roughly 10x the seed document. Enough headroom for real edits, small enough
// that a key holder can't push megabytes into storage by accident.
const MAX_DOC_BYTES = 400_000;

const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const EDIT_KEY = process.env.ROADMAP_EDIT_KEY || '';

function keyMatches(provided) {
  if (!EDIT_KEY || !provided) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(EDIT_KEY);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function looksLikeDoc(doc) {
  return Boolean(
    doc &&
    typeof doc === 'object' &&
    !Array.isArray(doc) &&
    typeof doc.title === 'string' &&
    Array.isArray(doc.parts) &&
    looksLikeBranches(doc.branches)
  );
}

function looksLikeBranches(branches) {
  // Older saved documents predate branches and remain valid.
  if (branches === undefined) return true;
  if (!Array.isArray(branches) || branches.length > BRANCH_LIMIT) return false;

  const ids = new Set();
  return branches.every((branch) => {
    if (
      !branch ||
      typeof branch !== 'object' ||
      typeof branch.id !== 'string' ||
      typeof branch.parentId !== 'string' ||
      typeof branch.title !== 'string' ||
      !/^branch-[a-z0-9-]+$/i.test(branch.id) ||
      !/^(step-(?:[1-9]|1[0-3])|gate-excise)$/.test(branch.parentId) ||
      !branch.title.trim() ||
      branch.title.length > BRANCH_TITLE_MAX_CHARS ||
      branch.title.trim().split(/\s+/).length > BRANCH_WORD_LIMIT ||
      ids.has(branch.id)
    ) {
      return false;
    }
    ids.add(branch.id);
    return true;
  });
}

// Public read. Anyone can view the guide; nothing here is gated.
export async function GET() {
  const base = { editingEnabled: Boolean(EDIT_KEY) };

  if (!hasKvConfig) {
    return NextResponse.json({ ...base, doc: null, storageAvailable: false });
  }

  try {
    const stored = await kv.get(DOC_KEY);
    return NextResponse.json({
      ...base,
      doc: stored?.doc || null,
      savedAt: stored?.savedAt || null,
      storageAvailable: true,
    });
  } catch (error) {
    console.error('Roadmap: failed to read from storage:', error);
    return NextResponse.json({ ...base, doc: null, storageAvailable: false });
  }
}

// Gated write. Requires the shared edit key in the x-edit-key header.
export async function POST(request) {
  const providedKey = request.headers.get('x-edit-key');

  if (!EDIT_KEY) {
    return NextResponse.json(
      { error: 'Editing is disabled: ROADMAP_EDIT_KEY is not configured on the server.' },
      { status: 503 }
    );
  }

  if (!keyMatches(providedKey)) {
    return NextResponse.json({ error: 'Incorrect edit key.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  // Key check only — used to unlock the editor before any changes are made.
  if (body?.verify) {
    return NextResponse.json({ ok: true, storageAvailable: hasKvConfig });
  }

  const { doc } = body || {};

  if (!looksLikeDoc(doc)) {
    return NextResponse.json({ error: 'Document has the wrong shape; refusing to save.' }, { status: 400 });
  }

  const serialized = JSON.stringify(doc);
  if (serialized.length > MAX_DOC_BYTES) {
    return NextResponse.json({ error: 'Document is too large to save.' }, { status: 413 });
  }

  // Never report success when the write didn't land — the same failure mode that
  // silently lost subscriber emails (see POSTMORTEM.md).
  if (!hasKvConfig) {
    console.error('Roadmap: KV not configured — edit NOT saved.');
    return NextResponse.json(
      { error: 'Storage is not configured, so your changes were not saved. Download a backup before leaving this page.' },
      { status: 503 }
    );
  }

  const savedAt = new Date().toISOString();

  try {
    // Keep the version we are about to overwrite, so a bad edit is recoverable.
    const previous = await kv.get(DOC_KEY);
    if (previous) {
      await kv.lpush(HISTORY_KEY, JSON.stringify(previous));
      await kv.ltrim(HISTORY_KEY, 0, HISTORY_LIMIT - 1);
    }

    await kv.set(DOC_KEY, { doc, savedAt });
  } catch (error) {
    console.error('Roadmap: failed to save edit:', error);
    return NextResponse.json(
      { error: 'Storage rejected the write, so your changes were not saved. Download a backup before leaving this page.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, savedAt });
}
