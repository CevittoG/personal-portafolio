/**
 * The tool field's scatter: where each tool sits, how big it is and how it
 * is tilted. A pure function of the tool count, so the server renders it
 * and the browser never computes a position.
 *
 * Each side of the hero is cut into more cells than it has tools. Tools
 * take cells at random and are nudged inside their own cell: the empty
 * cells and the nudge make the mess, and staying inside a cell is what
 * keeps two tools from ever overlapping. The CSS (`.tool` in globals.css)
 * turns a cell and a nudge into a position, scaling the nudge by the room
 * the cell really has at the current width.
 *
 * There are three arrangements, one per breakpoint, because the space is
 * different: two loose bands under the copy on small screens, the hero's
 * side gutters on wide ones.
 */

/** Cells per side and how many tools show, per breakpoint. */
export const FIELD_LAYOUTS = {
  sm: { cols: 4, rows: 2, count: 12 },
  md: { cols: 7, rows: 2, count: 20 },
  xl: { cols: 3, rows: 8, count: 36 },
} as const;

export type FieldBreakpoint = keyof typeof FIELD_LAYOUTS;
const BREAKPOINTS = Object.keys(FIELD_LAYOUTS) as FieldBreakpoint[];

/** How loose the scatter is, 0 (a grid) to 1. Chosen with the owner. */
export const FIELD_MESS = 0.8;
/** Which scatter: change it for a different, equally random arrangement. */
export const FIELD_SEED = 7;

export interface FieldCell {
  col: number;
  row: number;
  /** Where the name label hangs: 0 start, 0.5 centre, 1 end. Labels in an
   *  edge column open inwards, so they never cross into the copy or off
   *  the screen. */
  tip: 0 | 0.5 | 1;
}

export interface ScatteredTool {
  /** 0 = the left (or first) field, 1 = the right (or second). */
  side: 0 | 1;
  /** Icon size in px. */
  size: number;
  /** Tilt at rest, in degrees. */
  rest: number;
  /** Nudge inside the cell, each from -0.5 to 0.5 of the free room. */
  jx: number;
  jy: number;
  /** How strongly this tool answers the wind (around 1). */
  k: number;
  /** The cell per breakpoint; absent where the tool is not shown. */
  cells: Partial<Record<FieldBreakpoint, FieldCell>>;
}

/** A small seeded generator (mulberry32): same seed, same sequence. */
function generator(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number, places = 3) => Number(n.toFixed(places));

export function scatter(count: number, seed = FIELD_SEED, mess = FIELD_MESS): ScatteredTool[] {
  const tools: ScatteredTool[] = Array.from({ length: count }, (_, i) => {
    // One stream per tool, so adding a tool never moves the others.
    const random = generator(seed * 7919 + i * 104729);
    return {
      side: (i % 2) as 0 | 1,
      // The first few are the core stack: slightly larger.
      size: Math.round(Math.min(40, Math.max(20, 26 + (random() - 0.5) * 20 * mess + (i < 8 ? 4 : 0)))),
      rest: round((random() - 0.5) * 30 * mess, 1),
      jx: round((random() - 0.5) * mess),
      jy: round((random() - 0.5) * mess),
      k: round(0.75 + random() * 0.5, 2),
      cells: {},
    };
  });

  for (const [b, breakpoint] of BREAKPOINTS.entries()) {
    const { cols, rows, count: shown } = FIELD_LAYOUTS[breakpoint];
    for (const side of [0, 1] as const) {
      const random = generator(seed * 101 + b * 31 + side * 13);
      const slots = Array.from({ length: cols * rows }, (_, k) => k);
      for (let k = slots.length - 1; k > 0; k--) {
        const j = Math.floor(random() * (k + 1));
        [slots[k], slots[j]] = [slots[j], slots[k]];
      }
      const onThisSide = tools.filter((tool, i) => tool.side === side && i < shown);
      if (onThisSide.length > slots.length) {
        throw new Error(`scatter: ${onThisSide.length} tools do not fit ${slots.length} cells (${breakpoint})`);
      }
      onThisSide.forEach((tool, k) => {
        const col = slots[k] % cols;
        tool.cells[breakpoint] = {
          col,
          row: Math.floor(slots[k] / cols),
          tip: col === 0 ? 0 : col === cols - 1 ? 1 : 0.5,
        };
      });
    }
  }
  return tools;
}
