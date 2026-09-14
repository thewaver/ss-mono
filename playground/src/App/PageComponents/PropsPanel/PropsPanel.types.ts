import type { AccessorProps } from "@thewaver/ss-components";

export type PagePropsPanelScope = "global" | "local" | "sample";

export type PagePropsPanelProps = AccessorProps<{
    scope: PagePropsPanelScope;
}>;
