// Fixed layout for the roadmap graph.
//
// Positions are computed from a column/row grid rather than measured from the
// DOM, so the graph renders identically on the server and the client and the
// edges never need a layout pass to find their anchors.

// Wide enough that the longest step name ("Own-brand export to the EU: appoint
// an EPR Authorized Representative") wraps to three lines, and tall enough to
// show all three without clipping.
export const NODE_W = 252;
export const NODE_H = 106;
export const TERMINAL_W = 132;
export const TERMINAL_H = 40;

const COL_X = [190, 540, 890];
const ROW_TOP = 58;
const ROW_GAP = 140;

export const CANVAS = { width: 1080, height: ROW_TOP + 10 * ROW_GAP + NODE_H + 60 };

export const GRAPH_NODES = [
  { id: '__start__', kind: 'terminal', label: '__start__', col: 1, row: 0 },

  { id: 'step-1', kind: 'step', col: 1, row: 1 },
  { id: 'step-2', kind: 'step', col: 1, row: 2 },

  { id: 'step-3', kind: 'step', col: 0, row: 3 },
  { id: 'step-4', kind: 'step', col: 1, row: 3 },
  { id: 'step-5', kind: 'step', col: 2, row: 3 },

  { id: 'gate-excise', kind: 'gate', label: 'Is it subject to excise?', col: 0, row: 4 },

  { id: 'step-6', kind: 'step', col: 0, row: 5 },
  { id: 'step-7', kind: 'step', col: 2, row: 5 },

  { id: 'step-8', kind: 'step', col: 1, row: 6 },
  { id: 'step-9', kind: 'step', col: 1, row: 7 },
  { id: 'step-10', kind: 'step', col: 1, row: 8, milestone: true },

  { id: 'step-13', kind: 'step', col: 0, row: 9 },
  { id: 'step-12', kind: 'step', col: 1, row: 9 },
  { id: 'step-11', kind: 'step', col: 2, row: 9 },

  { id: '__end__', kind: 'terminal', label: '__end__', col: 1, row: 10 },
];

// `dashed` marks a conditional edge — the same convention LangGraph uses for
// edges that only fire once a condition is met.
export const GRAPH_EDGES = [
  { from: '__start__', to: 'step-1' },
  { from: 'step-1', to: 'step-2' },

  { from: 'step-2', to: 'step-3' },
  { from: 'step-2', to: 'step-4', label: 'run in parallel' },
  { from: 'step-2', to: 'step-5' },

  { from: 'step-3', to: 'gate-excise' },
  { from: 'gate-excise', to: 'step-6', dashed: true, label: 'once answered' },
  { from: 'gate-excise', to: 'step-7', dashed: true },

  { from: 'step-4', to: 'step-8' },
  { from: 'step-6', to: 'step-8' },
  { from: 'step-7', to: 'step-8' },

  { from: 'step-8', to: 'step-9' },
  { from: 'step-9', to: 'step-10' },

  { from: 'step-10', to: 'step-13', dashed: true },
  { from: 'step-10', to: 'step-12', dashed: true, label: 'once cash flow is running' },
  { from: 'step-10', to: 'step-11', dashed: true },

  // Step 5 clears the name that Step 11 registers. Bowed out to the right so it
  // passes outside the Step 7 card instead of through it.
  { from: 'step-5', to: 'step-11', dashed: true, bow: 175 },

  { from: 'step-13', to: '__end__' },
  { from: 'step-12', to: '__end__' },
  { from: 'step-11', to: '__end__' },
];

// Labelled bands behind the nodes, the way LangGraph draws subgraphs.
export const GRAPH_BANDS = [
  { id: 'part-a', label: 'A · Preparation', fromRow: 1, toRow: 2 },
  { id: 'part-b', label: 'B · Three key decisions', fromRow: 3, toRow: 3 },
  { id: 'part-c', label: 'C · Business licensing', fromRow: 4, toRow: 5 },
  { id: 'part-d', label: 'D · Ready to sell', fromRow: 6, toRow: 8 },
  { id: 'part-e', label: 'E · Later phase: own brand', fromRow: 9, toRow: 9 },
];

export function nodeBox(node) {
  const isTerminal = node.kind === 'terminal';
  const width = isTerminal ? TERMINAL_W : NODE_W;
  const height = isTerminal ? TERMINAL_H : NODE_H;
  return {
    width,
    height,
    left: COL_X[node.col] - width / 2,
    top: ROW_TOP + node.row * ROW_GAP + (isTerminal ? (NODE_H - height) / 2 : 0),
    centerX: COL_X[node.col],
  };
}

export function bandBox(band) {
  // The extra headroom keeps the band's label clear of the first node in it.
  const top = ROW_TOP + band.fromRow * ROW_GAP - 34;
  const bottom = ROW_TOP + band.toRow * ROW_GAP + NODE_H + 22;
  return { top, height: bottom - top };
}

// Cubic bezier from the bottom of one node to the top of the next.
export function edgePath(from, to, bow = 0) {
  const start = { x: from.centerX, y: from.top + from.height };
  const end = { x: to.centerX, y: to.top };
  const dy = end.y - start.y;

  if (bow) {
    const cx = start.x + bow;
    return `M ${start.x} ${start.y} C ${cx} ${start.y + dy * 0.25}, ${cx} ${end.y - dy * 0.25}, ${end.x} ${end.y}`;
  }

  if (Math.abs(end.x - start.x) < 1) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  const midY = start.y + dy / 2;
  return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
}

export function edgeLabelPoint(from, to, bow = 0) {
  const start = { x: from.centerX, y: from.top + from.height };
  const end = { x: to.centerX, y: to.top };
  return {
    x: (start.x + end.x) / 2 + bow * 0.75,
    y: (start.y + end.y) / 2,
  };
}
