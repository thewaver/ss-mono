import type { FormFieldOrientation } from "@thewaver/ss-components-vue";

export type FormFieldExampleProps = {
    "value": string;
    "onUpdate:value"?: (value: string) => void;
    "orientation": FormFieldOrientation;
    "gap": number;
    "message": string;
    "hasError": boolean;
};
