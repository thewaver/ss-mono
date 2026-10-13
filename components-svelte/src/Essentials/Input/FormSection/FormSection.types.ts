import type { Snippet } from "svelte";

import type { BaseFormSectionProps, FormContextType, FormSectionState } from "@thewaver/ss-components";

export type FormSectionProps = BaseFormSectionProps & {
    /** Draws the section's caption. */
    renderCaption?: Snippet<[state: FormSectionState]>;
    /** Draws the message under the content. Left out, the message is shown as it is. */
    renderMessage?: Snippet<[state: FormSectionState]>;
    /** Draws the section's contents. */
    renderContent: Snippet<[state: FormSectionState]>;
};

export type FormSectionContentProps = {
    /** What the fields inside are told about the section: where to register, and whether it validates. */
    context: FormContextType;
    /** The section's contents, which are the only part of it that reads the context. */
    children: Snippet;
};
