import type { Snippet } from "svelte";

import type { BasePageDocsViewProps } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type PageDocsViewProps = BasePageDocsViewProps & {
    children?: Snippet;
};
