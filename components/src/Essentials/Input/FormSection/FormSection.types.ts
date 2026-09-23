import type { JSX } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type FormSectionState = {
    isValid: boolean;
    hasError: boolean;
    hasMessage: boolean;
};

export type FormSectionProps = AccessorProps<{
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
    renderCaption?: (getState: () => FormSectionState) => JSX.Element;
    /** Draws the message under the content. */
    renderMessage?: (getState: () => FormSectionState) => JSX.Element;
    /** Draws the section's contents. */
    renderContent: (getState: () => FormSectionState) => JSX.Element;
}>;
