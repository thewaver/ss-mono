import type { VNodeChild } from "vue";

import type { BasePageDocsSectionProps } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.types";

export type PageDocsSectionProps = BasePageDocsSectionProps;

export type PageDocsSectionSlots = {
    default?: () => VNodeChild;
};
