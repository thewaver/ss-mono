import type { AccessorProps, FormFieldState, FormSectionState } from "@thewaver/ss-components-solid";

export type FormFieldMessageProps = AccessorProps<{
    state: FormFieldState | FormSectionState;
}>;
