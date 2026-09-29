import { createContext } from "svelte";

import type { FormFieldContextType } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<FormFieldContextType>();

export const setFormFieldContext = (context: FormFieldContextType) => setContext(context);

const UNDESCRIBED_CONTEXT: FormFieldContextType = {
    getDescriptionId: () => undefined,
    registerControl: () => undefined,
    unregisterControl: () => undefined,
};

export const getFormFieldContext = (): FormFieldContextType => (hasContext() ? getContext() : UNDESCRIBED_CONTEXT);
