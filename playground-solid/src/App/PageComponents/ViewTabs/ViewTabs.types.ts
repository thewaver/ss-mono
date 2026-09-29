import type { AccessorProps } from "@thewaver/ss-components-solid";

export type { PageViewKey } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/PageView.types";

export type PageViewTabsProps = AccessorProps<{
    baseRoute: string;
    hasExamples: boolean;
}>;
