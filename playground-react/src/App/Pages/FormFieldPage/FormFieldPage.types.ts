import type { FormFieldOrientation } from "@thewaver/ss-components-react";

export type FormFieldExampleProps = {
    valueState: readonly [string, (value: string) => void];
    orientation: FormFieldOrientation;
    gap: number;
    message: string;
    hasError: boolean;
};
