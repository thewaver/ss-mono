import type { ReactNode } from "react";

import type { BaseFormSectionProps, FormSectionState } from "@thewaver/ss-components";

export type FormSectionProps = BaseFormSectionProps & {
    /** Draws the section's caption. */
    renderCaption?: (state: FormSectionState) => ReactNode;
    /** Draws the message under the content. */
    renderMessage?: (state: FormSectionState) => ReactNode;
    /** Draws the section's contents. */
    renderContent: (state: FormSectionState) => ReactNode;
};
