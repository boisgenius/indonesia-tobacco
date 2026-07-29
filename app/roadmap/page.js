'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DocView, docCSS } from './doc-view';
import { Editable, TouchContext, editableCSS } from './editable';
import { GraphView, graphCSS } from './graph-view';
import { seedDoc } from './seed';

const EDIT_KEY_STORAGE = 'roadmap-edit-key';

export default function RoadmapPage() {
  const [doc, setDoc] = useState(seedDoc);
  const [loading, setLoading] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [savedAt, setSavedAt] = useState(null);

  const [view, setView] = useState('graph');
  const [selectedId, setSelectedId] = useState('step-1');

  const [unlocked, setUnlocked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { tone: 'ok' | 'error', text }
  const [confirmReset, setConfirmReset] = useState(false);

  const editKeyRef = useRef('');
  // Always holds the newest document, so a save can't send a stale closure copy.
  const docRef = useRef(doc);
  const dirtyRef = useRef(false);

  useEffect(() => {
    docRef.current = doc;
  }, [doc]);

  const markTouched = useCallback(() => {
    if (dirtyRef.current) return;
    dirtyRef.current = true;
    setDirty(true);
  }, []);

  // Load the saved version. The seed renders immediately (and server-side, so
  // the page is indexable), then gets replaced if storage has something newer.
  useEffect(() => {
    let cancelled = false;

    fetch('/api/roadmap', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.doc) setDoc(data.doc);
        if (data.savedAt) setSavedAt(data.savedAt);
        setStorageAvailable(Boolean(data.storageAvailable));
        setEditingEnabled(Boolean(data.editingEnabled));
      })
      .catch(() => {
        if (!cancelled) setStorageAvailable(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Restore a previously entered key for this browser session.
  useEffect(() => {
    const stored = sessionStorage.getItem(EDIT_KEY_STORAGE);
    if (stored) {
      editKeyRef.current = stored;
      setUnlocked(true);
    }
  }, []);

  // Don't let unsaved edits disappear on navigation.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const mutate = useCallback((fn) => {
    setDoc((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
    dirtyRef.current = true;
    setDirty(true);
    setStatus(null);
  }, []);

  const unlock = async (event) => {
    event?.preventDefault();
    const candidate = keyInput.trim();
    if (!candidate) return;
    if (!/^\d{3}$/.test(candidate)) {
      setStatus({ tone: 'error', text: 'Enter the 3-digit edit passcode.' });
      return;
    }

    setUnlocking(true);
    setStatus(null);

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-edit-key': candidate },
        body: JSON.stringify({ verify: true }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        editKeyRef.current = candidate;
        sessionStorage.setItem(EDIT_KEY_STORAGE, candidate);
        setUnlocked(true);
        setEditing(true);
        setShowKeyPrompt(false);
        setKeyInput('');
      } else {
        setStatus({ tone: 'error', text: data.error || 'Could not unlock editing.' });
      }
    } catch (error) {
      setStatus({ tone: 'error', text: 'Network error — could not reach the server.' });
    } finally {
      setUnlocking(false);
    }
  };

  const save = useCallback(async () => {
    if (saving) return;

    // The field the user is still inside only commits its text on blur, so flush
    // it first — otherwise the very edit they just typed would not be sent.
    const active = document.activeElement;
    if (active?.isContentEditable) {
      active.blur();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-edit-key': editKeyRef.current },
        body: JSON.stringify({ doc: docRef.current }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        dirtyRef.current = false;
        setDirty(false);
        setSavedAt(data.savedAt || new Date().toISOString());
        setStatus({ tone: 'ok', text: 'Saved. Everyone opening this page now sees your version.' });
      } else if (res.status === 401) {
        sessionStorage.removeItem(EDIT_KEY_STORAGE);
        editKeyRef.current = '';
        setUnlocked(false);
        setShowKeyPrompt(true);
        setStatus({ tone: 'error', text: 'That edit key is no longer valid. Enter it again — your changes are still here.' });
      } else {
        setStatus({ tone: 'error', text: data.error || 'Save failed. Your changes were NOT stored.' });
      }
    } catch (error) {
      setStatus({ tone: 'error', text: 'Network error. Your changes were NOT stored — download a backup.' });
    } finally {
      setSaving(false);
    }
  }, [saving]);

  // Cmd/Ctrl+S saves, the way a document is expected to behave.
  useEffect(() => {
    if (!editing) return undefined;
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editing, save]);

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(docRef.current, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roadmap-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetToOriginal = () => {
    setDoc(seedDoc);
    dirtyRef.current = true;
    setDirty(true);
    setConfirmReset(false);
    setStatus({ tone: 'ok', text: 'Restored the original PDF text. Nothing is stored until you press Save.' });
  };

  const savedLabel = savedAt
    ? new Date(savedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <main className="guide-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }

        :root {
          --nav-bg: #000;
          --nav-fg: #FFF;
          --nav-line: #2e2e2e;
        }

        .guide-shell { min-height: 100vh; background: #000; color: #fff; padding-bottom: 80px; }

        .toolbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px 40px;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #1d1d1d;
        }

        .toolbar-meta { color: #7d7d7d; font-size: 0.78rem; line-height: 1.4; }

        .toolbar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        .btn {
          font: inherit;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 14px;
          min-height: 36px;
          border-radius: 8px;
          border: 1px solid #333;
          background: transparent;
          color: #d6d6d6;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn:hover:not(:disabled) { border-color: #777; color: #fff; }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-primary { background: #fff; border-color: #fff; color: #000; }
        .btn-primary:hover:not(:disabled) { background: #e2e2e2; border-color: #e2e2e2; color: #000; }

        .btn-danger { border-color: #7a3a3a; color: #ff9d9d; }
        .btn-danger:hover:not(:disabled) { border-color: #ff6b6b; color: #ff6b6b; }

        .key-form { display: flex; gap: 8px; align-items: center; }

        .key-input {
          font: inherit;
          font-size: 0.8rem;
          padding: 8px 12px;
          min-height: 36px;
          width: 220px;
          border-radius: 8px;
          border: 1px solid #333;
          background: #0b0b0b;
          color: #fff;
          outline: none;
        }
        .key-input:focus { border-color: #777; }

        .status { font-size: 0.78rem; padding: 6px 12px; border-radius: 8px; line-height: 1.4; }
        .status-ok { color: #8fe3a4; background: rgba(107, 203, 119, 0.1); }
        .status-error { color: #ff9d9d; background: rgba(255, 107, 107, 0.1); }

        .doc { max-width: 1100px; margin: 0 auto; padding: 48px 40px 40px; }

        .eyebrow {
          color: #8a8a8a;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .doc-title {
          font-size: clamp(2.2rem, 5.4vw, 3.6rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .doc-subtitle { color: #9a9a9a; font-size: 1.05rem; line-height: 1.5; margin-top: 1rem; max-width: 640px; }

        .view-switch { display: inline-flex; gap: 4px; margin-top: 2rem; padding: 4px; border: 1px solid #222; border-radius: 10px; }

        .view-tab {
          font: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: #8a8a8a;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .view-tab:hover { color: #fff; }
        .view-tab-active { background: #fff; color: #000; }
        .view-tab-active:hover { color: #000; }

        ${graphCSS}
        ${docCSS}
        ${editableCSS}

        @media (max-width: 768px) {
          .toolbar { padding: 10px 20px; }
          .doc { padding: 32px 20px 24px; }
          .key-input { width: 150px; }
        }

        @media print {
          .toolbar, .view-switch, .graph-wrap, .bottom-nav, .bottom-nav-line { display: none !important; }
          .guide-shell, body { background: #fff; color: #000; }
          .doc { max-width: none; padding: 0; }
          .field-text, .doc-subtitle, .intro p, .map-what { color: #222; }
          .part-label { background: #eee; color: #000; border-left-color: #000; }
        }
      `}</style>

      <div className="toolbar">
        <div className="toolbar-meta">
          {loading
            ? 'Loading the latest saved version…'
            : !storageAvailable
              ? '⚠️ Storage is unreachable — showing the original document. Saving is unavailable.'
              : savedLabel
                ? `Last saved ${savedLabel}`
                : 'Original document — no edits saved yet'}
          {dirty && <span style={{ color: '#f5a524' }}> · unsaved changes</span>}
        </div>

        <div className="toolbar-actions">
          {status && (
            <span className={`status ${status.tone === 'ok' ? 'status-ok' : 'status-error'}`}>
              {status.text}
            </span>
          )}

          {editing && (
            <>
              <button type="button" className="btn" onClick={downloadBackup}>
                Download backup
              </button>
              {confirmReset ? (
                <>
                  <button type="button" className="btn btn-danger" onClick={resetToOriginal}>
                    Confirm reset
                  </button>
                  <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="btn" onClick={() => setConfirmReset(true)}>
                  Reset to original
                </button>
              )}
              <button type="button" className="btn" onClick={() => { setEditing(false); setConfirmReset(false); }}>
                Done
              </button>
              {/* Never disabled on "not dirty": the button must stay clickable
                  while a field is still focused, since that text isn't committed
                  yet and disabling here would strand the user's last edit. */}
              <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          )}

          {!editing && unlocked && (
            <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}

          {!editing && !unlocked && showKeyPrompt && (
            <form className="key-form" onSubmit={unlock}>
              <input
                type="password"
                className="key-input"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="3-digit passcode"
                aria-label="3-digit edit passcode"
                inputMode="numeric"
                pattern="[0-9]{3}"
                minLength={3}
                maxLength={3}
                autoFocus
                disabled={unlocking}
              />
              <button type="submit" className="btn btn-primary" disabled={unlocking || !/^\d{3}$/.test(keyInput)}>
                {unlocking ? 'Checking…' : 'Unlock'}
              </button>
              <button type="button" className="btn" onClick={() => { setShowKeyPrompt(false); setStatus(null); }}>
                Cancel
              </button>
            </form>
          )}

          {!editing && !unlocked && !showKeyPrompt && (
            <button
              type="button"
              className="btn"
              onClick={() => setShowKeyPrompt(true)}
              disabled={!editingEnabled}
              title={editingEnabled ? 'Unlock editing' : 'Editing is not configured on the server'}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <TouchContext.Provider value={markTouched}>
        <article className="doc">
          <p className="eyebrow">PT ITSFR · RYO Filter Initiative</p>

          <Editable
            as="h1"
            className="doc-title"
            editing={editing}
            value={doc.title}
            onChange={(v) => mutate((d) => { d.title = v; })}
          />

          <Editable
            as="p"
            className="doc-subtitle"
            editing={editing}
            value={doc.subtitle}
            onChange={(v) => mutate((d) => { d.subtitle = v; })}
          />

          <div className="view-switch" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'graph'}
              className={`view-tab${view === 'graph' ? ' view-tab-active' : ''}`}
              onClick={() => setView('graph')}
            >
              Graph
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'document'}
              className={`view-tab${view === 'document' ? ' view-tab-active' : ''}`}
              onClick={() => setView('document')}
            >
              Document
            </button>
          </div>

          {/* Both views stay mounted and are toggled with CSS. The graph only
              renders the selected node's detail, so if the document were
              unmounted the body text of every other step would vanish from the
              server-rendered HTML — and this page is public and indexed. */}
          <div style={{ display: view === 'graph' ? 'block' : 'none' }}>
            <GraphView
              doc={doc}
              editing={editing}
              mutate={mutate}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div style={{ display: view === 'document' ? 'block' : 'none' }}>
            <DocView doc={doc} editing={editing} mutate={mutate} />
          </div>
        </article>
      </TouchContext.Provider>
    </main>
  );
}
