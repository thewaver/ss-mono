import type { Snippet } from "svelte";

import type { BaseFormFieldProps, FormFieldContextType, FormFieldState } from "@thewaver/ss-components";

export type FormFieldProps = BaseFormFieldProps & {
    /** Draws the field's label. */
    renderCaption?: Snippet<[state: FormFieldState]>;
    /** Draws the message under the control. Left out, the message is shown as it is. */
    renderMessage?: Snippet<[state: FormFieldState]>;
    /** Draws the control itself. */
    renderControl: Snippet<[state: FormFieldState]>;
};

export type FormFieldControlProps = {
    /** What the control is told about the field around it: the message it is described by, and where to register. */
    context: FormFieldContextType;
    /** The control, which is the only part of the field that reads the context. */
    children: Snippet;
};
