import type { ReactNode } from "react";

import type { FormFieldOrientation, FormFieldState } from "@thewaver/ss-components";

export type FormFieldProps = {
    /** Whether the label sits above the control or beside it. */
    orientation?: FormFieldOrientation;
    /** The space between the label, the control and the message. */
    gap?: number;
    /** Puts the field into its error look and reads the message as the error rather than as help. */
    hasError?: boolean;
    /**
     * Whether a value has to be given. It is announced and not enforced, because the library validates nothing. The
     * caption and the control both read it from the state they are handed.
     */
    isRequired?: boolean;
    /** The line shown under the control. Leave it empty and no line is rendered. */
    message?: string;
    /** Draws the field's label. */
    renderCaption?: (state: FormFieldState) => ReactNode;
    /** Draws the message under the control. */
    renderMessage?: (state: FormFieldState) => ReactNode;
    /** Draws the control itself. */
    renderControl: (state: FormFieldState) => ReactNode;
};
