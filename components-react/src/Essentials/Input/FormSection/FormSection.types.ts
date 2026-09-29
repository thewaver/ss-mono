import type { ReactNode } from "react";

import type { FormSectionState } from "@thewaver/ss-components";

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
    /** Draws the section's caption. */
    renderCaption?: (state: FormSectionState) => ReactNode;
    /** Draws the message under the content. */
    renderMessage?: (state: FormSectionState) => ReactNode;
    /** Draws the section's contents. */
    renderContent: (state: FormSectionState) => ReactNode;
};
