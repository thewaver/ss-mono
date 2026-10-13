import type { FormFieldState, FormSectionState } from "@thewaver/ss-components";

export type BaseFormFieldMessageValues = {
    state: FormFieldState | FormSectionState;
};

export type BaseFormFieldMessageProps = BaseFormFieldMessageValues;
