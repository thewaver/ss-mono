import type { JSX } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type FormFieldState = {
    hasError: boolean;
    hasMessage: boolean;
};

export type FormFieldProps = AccessorProps<{
    /** Whether the label sits above the control or beside it. */
    dir?: "column" | "row";
    /** The space between the label, the control and the message. */
    gap?: number;
    /** Puts the field into its error look and reads the message as the error rather than as help. */
    hasError?: boolean;
    /** The line shown under the control. Leave it empty and no line is rendered. */
    message?: string;
    /** Draws the field's label. */
    renderCaption?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the message under the control. */
    renderMessage?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the control itself. */
    renderControl: (getState: () => FormFieldState) => JSX.Element;
}>;
