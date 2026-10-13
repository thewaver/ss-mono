import type { VNodeChild } from "vue";

import type { BaseFormFieldProps, FormFieldContextType, FormFieldState } from "@thewaver/ss-components";

export type FormFieldProps = BaseFormFieldProps;

export type FormFieldSlots = {
    /** Draws the field's label. */
    renderCaption?: (state: FormFieldState) => VNodeChild;
    /** Draws the message under the control. */
    renderMessage?: (state: FormFieldState) => VNodeChild;
    /** Draws the control itself. */
    renderControl: (state: FormFieldState) => VNodeChild;
};

export type FormFieldControlProps = {
    /** What the control, and only the control, reads as its field. */
    context: FormFieldContextType;
};
