import { OG_COLORS as c, OG_STRAND_COLORS } from "./brand-tokens";

/**
 * Abstract artwork for the share image: eight strands (one per tag type)
 * merge into one ember point and leave as a single line. Returned as an SVG
 * data URI because `next/og` draws it as an image.
 */
const NODE = { x: 880, y: 150 };

export function ogArtwork(): string {
  const strands = OG_STRAND_COLORS.map((color, i) => {
    const startY = 24 + i * 36;
    const path = `M -20 ${startY} C 380 ${startY}, 520 ${NODE.y + (startY - NODE.y) * 0.15}, ${NODE.x} ${NODE.y}`;
    // Packets of data at staggered positions along each strand.
    const dot = 60 + ((i * 137) % 330);
    return (
      `<path d="${path}" fill="none" stroke="${color}" stroke-width="3" opacity="0.75"/>` +
      `<path d="${path}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round" stroke-dasharray="1 26 1 2000" stroke-dashoffset="-${dot}"/>`
    );
  }).join("");

  const rings = [44, 82, 128]
    .map(
      (r, i) =>
        `<circle cx="${NODE.x}" cy="${NODE.y}" r="${r}" fill="none" stroke="${c.accent}" stroke-width="2" opacity="${0.45 - i * 0.14}"/>`,
    )
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">` +
    `<defs><radialGradient id="glow"><stop offset="0" stop-color="${c.accent}" stop-opacity="0.55"/><stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></radialGradient></defs>` +
    `<circle cx="${NODE.x}" cy="${NODE.y}" r="230" fill="url(#glow)"/>` +
    strands +
    rings +
    `<path d="M ${NODE.x} ${NODE.y} L 1220 ${NODE.y}" stroke="${c.accentHover}" stroke-width="10"/>` +
    `<circle cx="${NODE.x}" cy="${NODE.y}" r="22" fill="${c.accentHover}"/>` +
    `</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
