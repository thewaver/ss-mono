import type { Snippet } from "svelte";

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
