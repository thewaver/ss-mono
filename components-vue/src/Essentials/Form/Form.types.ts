import type { VNodeChild } from "vue";

import type { BaseFormProps, FormState } from "@thewaver/ss-components";

export type FormProps = BaseFormProps;

export type FormSlots = {
    /** Draws the form's contents, and is told whether the form validates and whether it has been submitted. */
    renderContent: (state: FormState) => VNodeChild;
};
