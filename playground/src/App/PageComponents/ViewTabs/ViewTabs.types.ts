import type { AccessorProps } from "@thewaver/ss-components";

export type PageViewKey = "docs" | "api" | "samples";

export type PageViewTabsProps = AccessorProps<{
    baseRoute: string;
}>;
