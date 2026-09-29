import type { VNodeChild } from "vue";

import type { FormContextType, FormSectionState } from "@thewaver/ss-components";

export type FormSectionProps = {
    /** Whether the caption sits above the content or beside it. */
    orientation?: "horizontal" | "vertical";
    /** The space between the caption, the content and the message. */
    gap?: number;
    /** Names the section for assistive technology. */
    ariaLabel?: string;
    /** Puts the section into its error look and reads the message as the error rather than as help. */
    hasError?: boolean;
    /** The line shown under the content. Leave it empty and no line is rendered. */
    message?: string;
};

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
