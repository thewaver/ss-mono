import type { AccessorProps } from "@thewaver/ss-components";

export type PageViewKey = "docs" | "samples";

export type PageViewTabsProps = AccessorProps<{
    baseRoute: string;
    hasSamples: boolean;
}>;
