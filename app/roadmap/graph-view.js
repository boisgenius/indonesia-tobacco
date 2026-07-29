'use client';

import { useState } from 'react';
import { Editable } from './editable';
import {
  CANVAS,
  GRAPH_BANDS,
  GRAPH_EDGES,
  GRAPH_NODES,
  bandBox,
  edgeLabelPoint,
  edgePath,
  nodeBox,
} from './graph-layout';

const BRANCH_WORD_LIMIT = 6;
const BRANCH_CHAR_LIMIT = 60;
const BRANCH_W = 180;
const BRANCH_H = 94;
const BRANCH_GAP = 16;
const BRANCH_RAIL_LEFT = CANVAS.width + 54;

// Maps every step id to its position in the document so a node click can edit
// the right object without searching the tree each time.
function indexSteps(doc) {
  const index = new Map();
  doc.parts.forEach((part, partIndex) => {
    part.steps.forEach((step, stepIndex) => {
      index.set(step.id, { step, partIndex, stepIndex, part });
    });
  });
  return index;
}

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function cleanBranchTitle(value) {
  return value.trim().replace(/\s+/g, ' ');
}

// User-created branches live in a compact rail to the right of the fixed
// implementation graph. This keeps a new note from covering a legal step or
// changing the carefully authored core layout.
function layoutBranches(branches, baseBoxes) {
  const candidates = branches
    .map((branch, index) => ({ branch, index, parent: baseBoxes.get(branch.parentId) }))
    .filter((entry) => entry.parent)
    .sort((a, b) => a.parent.top - b.parent.top || a.index - b.index);

  const branchBoxes = new Map();
  let lastBottom = 24;

  candidates.forEach(({ branch, parent }) => {
    const desiredTop = parent.top + Math.max(0, (parent.height - BRANCH_H) / 2);
    const top = Math.max(desiredTop, lastBottom + BRANCH_GAP);
    branchBoxes.set(branch.id, {
      left: BRANCH_RAIL_LEFT,
      top,
      width: BRANCH_W,
      height: BRANCH_H,
      centerX: BRANCH_RAIL_LEFT + BRANCH_W / 2,
    });
    lastBottom = top + BRANCH_H;
  });

  return {
    branchBoxes,
    canvas: {
      width: candidates.length ? BRANCH_RAIL_LEFT + BRANCH_W + 54 : CANVAS.width,
      height: Math.max(CANVAS.height, lastBottom + 44),
    },
  };
}

function branchEdgePath(from, to) {
  const startX = from.centerX;
  const startY = from.top + from.height;
  const routeY = startY + 13;
  const elbowX = to.left - 22;
  const endY = to.top + to.height / 2;
  return `M ${startX} ${startY} L ${startX} ${routeY} L ${elbowX} ${routeY} L ${elbowX} ${endY} L ${to.left} ${endY}`;
}

export function GraphView({ doc, editing, mutate, selectedId, onSelect }) {
  const [branchDraft, setBranchDraft] = useState('');
  const [branchError, setBranchError] = useState('');
  const steps = indexSteps(doc);
  const boxes = new Map(GRAPH_NODES.map((node) => [node.id, nodeBox(node)]));
  const branches = Array.isArray(doc.branches) ? doc.branches : [];
  const branchIndex = new Map(branches.map((branch) => [branch.id, branch]));
  const { branchBoxes, canvas } = layoutBranches(branches, boxes);
  const selected = selectedId ? steps.get(selectedId) : null;
  const selectedNode = GRAPH_NODES.find((n) => n.id === selectedId) || null;
  const selectedBranch = selectedId ? branchIndex.get(selectedId) || null : null;
  const branchWordCount = countWords(branchDraft);

  // The gate stands in for the excise decision, so editing it edits the callout
  // that states the condition.
  const gatePartIndex = doc.parts.findIndex((p) => p.callout);
  const gateCallout = gatePartIndex >= 0 ? doc.parts[gatePartIndex].callout : null;

  const parentName = (parentId) => {
    const step = steps.get(parentId);
    if (step) return `Step ${step.step.num}`;
    return GRAPH_NODES.find((node) => node.id === parentId)?.label || 'roadmap node';
  };

  const addBranch = (event) => {
    event.preventDefault();
    const title = cleanBranchTitle(branchDraft);
    const words = countWords(title);

    if (!title) {
      setBranchError('Enter a short branch title.');
      return;
    }
    if (words > BRANCH_WORD_LIMIT) {
      setBranchError(`Use ${BRANCH_WORD_LIMIT} words or fewer.`);
      return;
    }

    const id = `branch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    mutate((d) => {
      if (!Array.isArray(d.branches)) d.branches = [];
      d.branches.push({ id, parentId: selectedId, title });
    });
    setBranchDraft('');
    setBranchError('');
    onSelect(id);
  };

  const updateSelectedBranch = (value) => {
    if (!selectedBranch) return;
    const words = countWords(value);
    if (!value.trim() || value.length > BRANCH_CHAR_LIMIT || words > BRANCH_WORD_LIMIT) return;
    mutate((d) => {
      const target = (d.branches || []).find((branch) => branch.id === selectedBranch.id);
      if (target) target.title = value;
    });
  };

  const deleteSelectedBranch = () => {
    if (!selectedBranch) return;
    const parentId = selectedBranch.parentId;
    mutate((d) => {
      d.branches = (d.branches || []).filter((branch) => branch.id !== selectedBranch.id);
    });
    onSelect(parentId);
  };

  return (
    <div className="graph-wrap">
      <div className="graph-scroll">
        <div className="graph-canvas" style={{ width: canvas.width, height: canvas.height }}>
          <svg
            className="graph-edges"
            width={canvas.width}
            height={canvas.height}
            viewBox={`0 0 ${canvas.width} ${canvas.height}`}
            aria-hidden="true"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5a5a5a" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fff" />
              </marker>
            </defs>

            {GRAPH_BANDS.map((band) => {
              const box = bandBox(band);
              return (
                <g key={band.id}>
                  <rect
                    x={14}
                    y={box.top}
                    width={CANVAS.width - 28}
                    height={box.height}
                    rx={14}
                    className="graph-band"
                  />
                  <text x={30} y={box.top + 19} className="graph-band-label">
                    {band.label}
                  </text>
                </g>
              );
            })}

            {branches.length > 0 && (
              <g>
                <rect
                  x={CANVAS.width + 24}
                  y={14}
                  width={BRANCH_W + 60}
                  height={canvas.height - 28}
                  rx={14}
                  className="graph-branch-rail"
                />
                <text x={CANVAS.width + 40} y={36} className="graph-band-label">
                  Added branches
                </text>
              </g>
            )}

            {GRAPH_EDGES.map((edge) => {
              const from = boxes.get(edge.from);
              const to = boxes.get(edge.to);
              if (!from || !to) return null;
              const active = selectedId && (edge.from === selectedId || edge.to === selectedId);
              return (
                <path
                  key={`${edge.from}->${edge.to}`}
                  d={edgePath(from, to, edge.bow || 0)}
                  className={`graph-edge${edge.dashed ? ' graph-edge-dashed' : ''}${active ? ' graph-edge-active' : ''}`}
                  markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                  fill="none"
                />
              );
            })}

            {branches.map((branch) => {
              const from = boxes.get(branch.parentId);
              const to = branchBoxes.get(branch.id);
              if (!from || !to) return null;
              const active = selectedId === branch.id || selectedId === branch.parentId;
              return (
                <path
                  key={`${branch.parentId}->${branch.id}`}
                  d={branchEdgePath(from, to)}
                  className={`graph-edge graph-edge-branch${active ? ' graph-edge-active' : ''}`}
                  markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                  fill="none"
                />
              );
            })}

            {GRAPH_EDGES.filter((e) => e.label).map((edge) => {
              const from = boxes.get(edge.from);
              const to = boxes.get(edge.to);
              if (!from || !to) return null;
              const point = edgeLabelPoint(from, to, edge.bow || 0);
              return (
                <text
                  key={`label-${edge.from}->${edge.to}`}
                  x={point.x}
                  y={point.y}
                  className="graph-edge-label"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              );
            })}
          </svg>

          {GRAPH_NODES.map((node) => {
            const box = boxes.get(node.id);
            const entry = steps.get(node.id);
            const isSelected = selectedId === node.id;

            if (node.kind === 'terminal') {
              return (
                <div
                  key={node.id}
                  className="gnode gnode-terminal"
                  style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
                >
                  {node.label}
                </div>
              );
            }

            if (node.kind === 'gate') {
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`gnode gnode-gate${isSelected ? ' gnode-selected' : ''}`}
                  style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
                  onClick={() => onSelect(isSelected ? null : node.id)}
                >
                  <span className="gnode-kind">Conditional</span>
                  <span className="gnode-title">{node.label}</span>
                </button>
              );
            }

            if (!entry) return null;

            return (
              <button
                key={node.id}
                type="button"
                className={`gnode gnode-step${isSelected ? ' gnode-selected' : ''}${node.milestone ? ' gnode-milestone' : ''}`}
                style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
                onClick={() => onSelect(isSelected ? null : node.id)}
              >
                <span className="gnode-head">
                  <span className="gnode-num">Step {entry.step.num}</span>
                  {entry.step.needsConfirmation && (
                    <span className="gnode-flag" title="Needs confirmation">
                      !
                    </span>
                  )}
                </span>
                <span className="gnode-title">{entry.step.title}</span>
              </button>
            );
          })}

          {branches.map((branch) => {
            const box = branchBoxes.get(branch.id);
            if (!box) return null;
            const isSelected = selectedId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                className={`gnode gnode-branch${isSelected ? ' gnode-selected' : ''}`}
                style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
                onClick={() => onSelect(isSelected ? null : branch.id)}
              >
                <span className="gnode-kind">Branch</span>
                <span className="gnode-title">{branch.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="graph-legend">
        <span className="legend-item"><i className="legend-line" /> depends on</span>
        <span className="legend-item"><i className="legend-line legend-line-dashed" /> conditional</span>
        <span className="legend-item"><i className="legend-dot legend-dot-flag" /> needs confirmation</span>
        <span className="legend-item"><i className="legend-dot legend-dot-milestone" /> first legal sale</span>
        <span className="legend-item"><i className="legend-dot legend-dot-branch" /> added branch</span>
      </div>

      <div className="graph-detail">
        {!selectedNode && !selectedBranch && (
          <p className="graph-hint">Select any node to read the detail{editing ? ' and edit it' : ''}.</p>
        )}

        {selectedNode?.kind === 'gate' && gateCallout && (
          <>
            <p className="detail-eyebrow">Conditional edge</p>
            <h3 className="detail-title">{selectedNode.label}</h3>
            <Editable
              as="p"
              className="detail-callout"
              editing={editing}
              value={gateCallout.text}
              onChange={(v) => mutate((d) => { d.parts[gatePartIndex].callout.text = v; })}
            />
          </>
        )}

        {selected && (
          <>
            <div className="detail-head">
              <p className="detail-eyebrow">Step {selected.step.num}</p>
              {editing ? (
                <button
                  type="button"
                  className={`flag flag-toggle${selected.step.needsConfirmation ? '' : ' flag-off'}`}
                  onClick={() =>
                    mutate((d) => {
                      const target = d.parts[selected.partIndex].steps[selected.stepIndex];
                      target.needsConfirmation = !target.needsConfirmation;
                    })
                  }
                >
                  {selected.step.needsConfirmation ? 'Needs confirmation' : 'Confirmed'}
                </button>
              ) : (
                selected.step.needsConfirmation && <span className="flag">Needs confirmation</span>
              )}
            </div>

            <Editable
              as="h3"
              className="detail-title"
              editing={editing}
              value={selected.step.title}
              onChange={(v) => mutate((d) => { d.parts[selected.partIndex].steps[selected.stepIndex].title = v; })}
            />

            <div className="fields">
              {selected.step.fields.map((field, fieldIndex) => (
                <div className="field" key={field.id}>
                  <Editable
                    className="field-label"
                    editing={editing}
                    value={field.label}
                    onChange={(v) =>
                      mutate((d) => {
                        d.parts[selected.partIndex].steps[selected.stepIndex].fields[fieldIndex].label = v;
                      })
                    }
                  />
                  <Editable
                    className="field-text"
                    editing={editing}
                    value={field.text}
                    onChange={(v) =>
                      mutate((d) => {
                        d.parts[selected.partIndex].steps[selected.stepIndex].fields[fieldIndex].text = v;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {selectedBranch && (
          <>
            <div className="detail-head">
              <p className="detail-eyebrow">Branch from {parentName(selectedBranch.parentId)}</p>
              {editing && (
                <button type="button" className="btn btn-danger" onClick={deleteSelectedBranch}>
                  Delete branch
                </button>
              )}
            </div>
            {editing ? (
              <input
                type="text"
                className="branch-title-editor"
                value={selectedBranch.title}
                onChange={(event) => updateSelectedBranch(event.target.value)}
                maxLength={BRANCH_CHAR_LIMIT}
                aria-label="Branch title"
              />
            ) : (
              <h3 className="detail-title">{selectedBranch.title}</h3>
            )}
            <p className="branch-limit">
              {countWords(selectedBranch.title)}/{BRANCH_WORD_LIMIT} words
            </p>
          </>
        )}

        {editing && selectedNode && selectedNode.kind !== 'terminal' && (
          <form className="branch-composer" onSubmit={addBranch}>
            <div>
              <p className="detail-eyebrow">Add a small branch</p>
              <p className="branch-help">It will connect to this node and save with the roadmap.</p>
            </div>
            <div className="branch-compose-controls">
              <input
                type="text"
                className="branch-title-editor"
                value={branchDraft}
                onChange={(event) => {
                  setBranchDraft(event.target.value.slice(0, BRANCH_CHAR_LIMIT));
                  setBranchError('');
                }}
                maxLength={BRANCH_CHAR_LIMIT}
                placeholder={`Branch title — max ${BRANCH_WORD_LIMIT} words`}
                aria-label="New branch title"
              />
              <span className={`branch-limit${branchWordCount > BRANCH_WORD_LIMIT ? ' branch-limit-error' : ''}`}>
                {branchWordCount}/{BRANCH_WORD_LIMIT} words
              </span>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!branchDraft.trim() || branchWordCount > BRANCH_WORD_LIMIT}
              >
                Add branch
              </button>
            </div>
            {branchError && <p className="branch-error">{branchError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export const graphCSS = `
  .graph-wrap { margin-top: 2rem; }

  .graph-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid #1c1c1c;
    border-radius: 12px;
    background:
      radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0) 0 0 / 26px 26px,
      #050505;
  }

  .graph-canvas { position: relative; }

  .graph-edges { position: absolute; inset: 0; pointer-events: none; }

  .graph-band { fill: rgba(255, 255, 255, 0.018); stroke: #1e1e1e; stroke-dasharray: 3 5; }
  .graph-branch-rail {
    fill: rgba(138, 180, 255, 0.025);
    stroke: rgba(138, 180, 255, 0.2);
    stroke-dasharray: 3 5;
  }

  .graph-band-label {
    fill: #5f5f5f;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .graph-edge { stroke: #4a4a4a; stroke-width: 1.5; transition: stroke 0.2s; }
  .graph-edge-dashed { stroke-dasharray: 5 5; }
  .graph-edge-branch { stroke: rgba(138, 180, 255, 0.65); stroke-dasharray: 4 4; }
  .graph-edge-active { stroke: #fff; stroke-width: 2; }

  .graph-edge-label {
    fill: #6f6f6f;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    paint-order: stroke;
    stroke: #050505;
    stroke-width: 5px;
  }

  .gnode {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 12px 14px;
    text-align: left;
    font: inherit;
    border-radius: 10px;
    border: 1px solid #333;
    background: #111;
    color: #fff;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }

  button.gnode { cursor: pointer; }
  button.gnode:hover { border-color: #6f6f6f; background: #171717; transform: translateY(-1px); }

  .gnode-selected { border-color: #fff; background: #1b1b1b; }

  .gnode-terminal {
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border-color: #2c2c2c;
    background: #0b0b0b;
    color: #7a7a7a;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .gnode-gate {
    border-style: dashed;
    border-color: rgba(245, 165, 36, 0.5);
    background: rgba(245, 165, 36, 0.07);
  }
  .gnode-gate:hover { border-color: #f5a524; background: rgba(245, 165, 36, 0.12); }

  .gnode-milestone { border-color: rgba(107, 203, 119, 0.45); background: rgba(107, 203, 119, 0.07); }
  .gnode-milestone:hover { border-color: #6BCB77; background: rgba(107, 203, 119, 0.12); }

  .gnode-branch {
    border-color: rgba(138, 180, 255, 0.45);
    background: rgba(138, 180, 255, 0.08);
  }
  .gnode-branch:hover { border-color: #8ab4ff; background: rgba(138, 180, 255, 0.14); }
  .gnode-branch .gnode-kind { color: #8ab4ff; }

  .gnode-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

  .gnode-num, .gnode-kind {
    color: #7d7d7d;
    font-size: 0.63rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .gnode-kind { color: #f5a524; }

  .gnode-flag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(245, 165, 36, 0.16);
    border: 1px solid rgba(245, 165, 36, 0.5);
    color: #f5a524;
    font-size: 0.6rem;
    font-weight: 900;
  }

  .gnode-title {
    font-size: 0.84rem;
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .graph-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 14px;
    color: #6f6f6f;
    font-size: 0.75rem;
  }

  .legend-item { display: inline-flex; align-items: center; gap: 7px; }

  .legend-line { display: inline-block; width: 22px; height: 0; border-top: 1.5px solid #5a5a5a; }
  .legend-line-dashed { border-top-style: dashed; }

  .legend-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; }
  .legend-dot-flag { background: rgba(245, 165, 36, 0.5); border: 1px solid #f5a524; }
  .legend-dot-milestone { background: rgba(107, 203, 119, 0.4); border: 1px solid #6BCB77; }
  .legend-dot-branch { background: rgba(138, 180, 255, 0.45); border: 1px solid #8ab4ff; }

  .graph-detail {
    margin-top: 22px;
    padding: 22px;
    border: 1px solid #1c1c1c;
    border-radius: 12px;
    background: #080808;
    min-height: 150px;
  }

  .graph-hint { color: #6f6f6f; font-size: 0.92rem; }

  .detail-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

  .detail-eyebrow {
    color: #7d7d7d;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .detail-title {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.01em;
    margin-top: 8px;
  }

  .detail-callout {
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid rgba(245, 165, 36, 0.4);
    background: rgba(245, 165, 36, 0.08);
    color: #f0c37a;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .branch-composer {
    display: grid;
    gap: 12px;
    margin-top: 22px;
    padding-top: 20px;
    border-top: 1px solid #222;
  }

  .branch-help {
    margin-top: 5px;
    color: #737373;
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .branch-compose-controls {
    display: grid;
    grid-template-columns: minmax(180px, 1fr) auto auto;
    align-items: center;
    gap: 10px;
  }

  .branch-title-editor {
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    border: 1px solid #333;
    border-radius: 8px;
    background: #0d0d0d;
    color: #fff;
    font: inherit;
    font-size: 0.92rem;
    outline: none;
  }
  .branch-title-editor:focus { border-color: #8ab4ff; }

  .branch-limit {
    margin-top: 8px;
    color: #6f6f6f;
    font-size: 0.72rem;
    white-space: nowrap;
  }
  .branch-compose-controls .branch-limit { margin-top: 0; }
  .branch-limit-error, .branch-error { color: #ff9d9d; }
  .branch-error { font-size: 0.78rem; }

  @media (max-width: 768px) {
    .graph-detail { padding: 16px; }
    .branch-compose-controls { grid-template-columns: 1fr auto; }
    .branch-compose-controls .branch-title-editor { grid-column: 1 / -1; }
  }
`;
