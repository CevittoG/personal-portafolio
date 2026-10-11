/**
 * When the tool field's icons are fetched.
 *
 * Each icon is `<use data-href="/sprites/tools.svg#slug">`: the address is
 * in the HTML, but nothing loads until it is copied to `href`. On wide
 * screens the field is on the first screen, so that happens while the page
 * is still being read in (the inline script below, placed right after the
 * field). On narrower screens the field is under the first screen, and the
 * sprite would only compete with the text for the connection: measured on
 * a simulated phone, fetching it up front cost about 0.37s of Largest
 * Contentful Paint. There it waits for the page's load event.
 *
 * `ToolField` runs the same steps in an effect, which covers arriving by a
 * client-side navigation (where an inline script does not run).
 */
export const WIDE_FIELD_QUERY = "(min-width: 80rem)";

/** Copy every pending address in the field to `href`. Safe to repeat. */
export function showToolIcons(root: ParentNode): void {
  for (const use of root.querySelectorAll("use[data-href]")) {
    use.setAttribute("href", use.getAttribute("data-href") ?? "");
  }
}

/** Run inline, immediately after the field's markup. */
export const toolIconsScript = `(() => {
  if (!window.matchMedia(${JSON.stringify(WIDE_FIELD_QUERY)}).matches) return;
  for (const use of document.querySelectorAll("use[data-href]")) {
    use.setAttribute("href", use.getAttribute("data-href"));
  }
})();`;
