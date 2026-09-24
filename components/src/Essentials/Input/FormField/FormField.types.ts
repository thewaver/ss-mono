import type { JSX } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type FormFieldOrientation = "horizontal" | "vertical";

export type FormFieldState = {
    hasError: boolean;
    hasMessage: boolean;
    isRequired: boolean;
};

export type FormFieldProps = AccessorProps<{
    /** Whether the label sits above the control or beside it. */
    orientation?: FormFieldOrientation;
    /** The space between the label, the control and the message. */
    gap?: number;
    /** Puts the field into its error look and reads the message as the error rather than as help. */
    hasError?: boolean;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. The caption and the control both read it from the state they are handed. */
    isRequired?: boolean;
    /** The line shown under the control. Leave it empty and no line is rendered. */
    message?: string;
    /** Draws the field's label. */
    renderCaption?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the message under the control. */
    renderMessage?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the control itself. */
    renderControl: (getState: () => FormFieldState) => JSX.Element;
}>;
