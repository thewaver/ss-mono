import type { Snippet } from "svelte";

import type { BasePageDocsExampleProps } from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.types";

export type PageDocsExampleProps = BasePageDocsExampleProps & {
    renderKnobs?: Snippet;
    children?: Snippet;
};
