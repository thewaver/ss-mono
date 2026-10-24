import type { VNodeChild } from "vue";

import type { BasePageDocsViewProps } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type PageDocsViewProps = BasePageDocsViewProps;

export type PageDocsViewSlots = {
    default?: () => VNodeChild;
};
