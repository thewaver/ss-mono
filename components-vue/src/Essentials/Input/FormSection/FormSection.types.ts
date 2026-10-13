import type { VNodeChild } from "vue";

import type { BaseFormSectionProps, FormContextType, FormSectionState } from "@thewaver/ss-components";

export type FormSectionProps = BaseFormSectionProps;

export type FormSectionSlots = {
    /** Draws the section's caption. */
    renderCaption?: (state: FormSectionState) => VNodeChild;
    /** Draws the message under the content. */
    renderMessage?: (state: FormSectionState) => VNodeChild;
    /** Draws the section's contents. */
    renderContent: (state: FormSectionState) => VNodeChild;
};

export type FormSectionContentProps = {
    /** What the section's contents, and only they, read as their form. */
    context: FormContextType;
};
