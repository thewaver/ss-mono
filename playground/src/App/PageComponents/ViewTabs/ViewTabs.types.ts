import type { AccessorProps } from "@thewaver/ss-components";

export type PageViewKey = "docs" | "examples";

export type PageViewTabsProps = AccessorProps<{
    baseRoute: string;
    hasExamples: boolean;
}>;
