'use client';

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

export function GraphView({ doc, editing, mutate, selectedId, onSelect }) {
  const steps = indexSteps(doc);
  const boxes = new Map(GRAPH_NODES.map((node) => [node.id, nodeBox(node)]));
  const selected = selectedId ? steps.get(selectedId) : null;
  const selectedNode = GRAPH_NODES.find((n) => n.id === selectedId) || null;

  // The gate stands in for the excise decision, so editing it edits the callout
  // that states the condition.
  const gatePartIndex = doc.parts.findIndex((p) => p.callout);
  const gateCallout = gatePartIndex >= 0 ? doc.parts[gatePartIndex].callout : null;

  return (
    <div className="graph-wrap">
      <div className="graph-scroll">
        <div className="graph-canvas" style={{ width: CANVAS.width, height: CANVAS.height }}>
          <svg
            className="graph-edges"
            width={CANVAS.width}
            height={CANVAS.height}
            viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
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
        </div>
      </div>

      <div className="graph-legend">
        <span className="legend-item"><i className="legend-line" /> depends on</span>
        <span className="legend-item"><i className="legend-line legend-line-dashed" /> conditional</span>
        <span className="legend-item"><i className="legend-dot legend-dot-flag" /> needs confirmation</span>
        <span className="legend-item"><i className="legend-dot legend-dot-milestone" /> first legal sale</span>
      </div>

      <div className="graph-detail">
        {!selectedNode && (
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

  .graph-band-label {
    fill: #5f5f5f;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .graph-edge { stroke: #4a4a4a; stroke-width: 1.5; transition: stroke 0.2s; }
  .graph-edge-dashed { stroke-dasharray: 5 5; }
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

  @media (max-width: 768px) {
    .graph-detail { padding: 16px; }
  }
`;
