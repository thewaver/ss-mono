import type { FormFieldOrientation } from "@thewaver/ss-components-svelte";

export type FormFieldExampleProps = {
    value: string;
    orientation: FormFieldOrientation;
    gap: number;
    message: string;
    hasError: boolean;
};
