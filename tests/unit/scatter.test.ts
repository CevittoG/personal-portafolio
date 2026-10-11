import { describe, expect, it } from "vitest";
import { FIELD_LAYOUTS, scatter, type FieldBreakpoint } from "@/lib/explorer/scatter";
import { FIELD_TOOLS } from "@/lib/site/field-tools";

const BREAKPOINTS = Object.keys(FIELD_LAYOUTS) as FieldBreakpoint[];

describe("explorer/scatter", () => {
  const tools = scatter(FIELD_TOOLS.length);

  it("is the same every time, so the server and the browser agree", () => {
    expect(scatter(FIELD_TOOLS.length)).toEqual(tools);
    expect(scatter(FIELD_TOOLS.length, 8)).not.toEqual(tools);
  });

  it("shows every field tool on wide screens and the first few on narrow ones", () => {
    expect(FIELD_LAYOUTS.xl.count).toBe(FIELD_TOOLS.length);
    for (const breakpoint of BREAKPOINTS) {
      const shown = tools.map((tool, i) => (tool.cells[breakpoint] ? i : -1)).filter((i) => i >= 0);
      expect(shown, breakpoint).toEqual(Array.from({ length: FIELD_LAYOUTS[breakpoint].count }, (_, i) => i));
    }
  });

  // One tool per cell is what keeps two tools from overlapping.
  it("never puts two tools in the same cell", () => {
    for (const breakpoint of BREAKPOINTS) {
      const { cols, rows } = FIELD_LAYOUTS[breakpoint];
      for (const side of [0, 1]) {
        const cells = tools
          .filter((tool) => tool.side === side && tool.cells[breakpoint])
          .map((tool) => tool.cells[breakpoint]!);
        expect(new Set(cells.map((c) => `${c.col},${c.row}`)).size, `${breakpoint} side ${side}`).toBe(cells.length);
        for (const cell of cells) {
          expect(cell.col).toBeGreaterThanOrEqual(0);
          expect(cell.col).toBeLessThan(cols);
          expect(cell.row).toBeLessThan(rows);
          // Names in an edge column open inwards.
          expect(cell.tip).toBe(cell.col === 0 ? 0 : cell.col === cols - 1 ? 1 : 0.5);
        }
      }
    }
  });

  it("keeps every nudge inside its cell and every icon a pressable size", () => {
    for (const tool of tools) {
      expect(Math.abs(tool.jx)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(tool.jy)).toBeLessThanOrEqual(0.5);
      expect(tool.size).toBeGreaterThanOrEqual(20);
      expect(tool.size).toBeLessThanOrEqual(40);
    }
  });

  it("with no mess is a plain upright arrangement", () => {
    for (const tool of scatter(12, 7, 0)) {
      expect(tool.rest === 0 && tool.jx === 0 && tool.jy === 0).toBe(true);
    }
  });

  it("refuses more tools than a layout has cells for", () => {
    expect(() => scatter(60)).not.toThrow(); // extra tools are simply not placed
    expect(scatter(60).filter((tool) => tool.cells.xl).length).toBe(FIELD_LAYOUTS.xl.count);
  });
});
