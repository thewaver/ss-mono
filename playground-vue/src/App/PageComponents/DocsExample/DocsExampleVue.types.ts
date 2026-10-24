import type { VNodeChild } from "vue";

import type { BasePageDocsExampleProps } from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.types";

export type PageDocsExampleProps = BasePageDocsExampleProps;

export type PageDocsExampleSlots = {
    default?: () => VNodeChild;
    renderKnobs?: () => VNodeChild;
};
