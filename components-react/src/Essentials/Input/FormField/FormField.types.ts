import type { ReactNode } from "react";

import type { BaseFormFieldProps, FormFieldState } from "@thewaver/ss-components";

export type FormFieldProps = BaseFormFieldProps & {
    /** Draws the field's label. */
    renderCaption?: (state: FormFieldState) => ReactNode;
    /** Draws the message under the control. */
    renderMessage?: (state: FormFieldState) => ReactNode;
    /** Draws the control itself. */
    renderControl: (state: FormFieldState) => ReactNode;
};
