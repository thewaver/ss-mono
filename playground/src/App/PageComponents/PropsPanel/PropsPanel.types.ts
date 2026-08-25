import type { AccessorProps } from "@thewaver/ss-components";

export type PagePropsPanelScope = "global" | "local";

export type PagePropsPanelProps = AccessorProps<{
    scope: PagePropsPanelScope;
}>;
