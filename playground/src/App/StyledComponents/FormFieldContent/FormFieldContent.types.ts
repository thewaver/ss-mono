import type { AccessorProps, FormFieldState, FormSectionState } from "@thewaver/ss-components";

export type FormFieldMessageProps = AccessorProps<{
    state: FormFieldState | FormSectionState;
}>;
