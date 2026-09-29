import type { FormContextType } from "@thewaver/ss-components";

export type FormReactContextType = FormContextType & {
    reportChange: () => void;
};
