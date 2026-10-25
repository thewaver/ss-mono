import type { FormFieldOrientation } from "@thewaver/ss-components";

export type BaseFormFieldBasicDocsExampleValues = {
    orientation: FormFieldOrientation;
    gap: number;
    message: string;
    isRequired: boolean;
    hasError: boolean;
};

export type BaseFormFieldInFormDocsExampleValues = {
    hasError: boolean;
};
