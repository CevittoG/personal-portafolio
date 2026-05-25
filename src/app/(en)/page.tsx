import { Explorer } from "@/components/explorer/Explorer";

/**
 * EN Explorer route (`/`). All assembly lives in the shared `<Explorer>`
 * component, which reads locale from the surrounding `I18nProvider`
 * (set to "en" by `(en)/layout.tsx`).
 */
export default function ExplorerPage() {
  return <Explorer />;
}
