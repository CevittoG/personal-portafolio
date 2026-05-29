import { Fragment, type ReactElement } from "react";

/**
 * Tiny description renderer for `experience.description` strings.
 *
 * The real data uses only paragraph breaks (\n\n) and **bold** runs — see
 * the description audit run at step 12. Pulling in `react-markdown` for
 * that would add ~50 KB to a single route's bundle for no observable
 * benefit.
 *
 * Extending: add new inline rules in `renderInline`, new block rules in
 * `parseBlocks`. If the data grows headings/lists/code/links, swap this
 * for `react-markdown` — the contract is `string → ReactElement[]`.
 */
export function renderDescription(description: string): ReactElement[] {
  const trimmed = description?.trim() ?? "";
  if (!trimmed) return [];
  return parseBlocks(trimmed).map((block, i) => (
    <p key={i} className="leading-relaxed text-text-secondary">
      {renderInline(block)}
    </p>
  ));
}

function parseBlocks(input: string): string[] {
  return input
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function renderInline(text: string): ReactElement {
  const parts: ReactElement[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    }
    parts.push(
      <strong key={key++} className="font-semibold text-text-primary">
        {m[1]}
      </strong>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  }
  return <>{parts}</>;
}
