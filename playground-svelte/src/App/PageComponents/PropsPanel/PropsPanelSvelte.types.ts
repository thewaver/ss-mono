import type { Snippet } from "svelte";

import type { PagePropsPanelScope } from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.types";

export type { PagePropsPanelScope } from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.types";

export type PagePropsPanelProps = {
    scope: PagePropsPanelScope;
    children?: Snippet;
};
