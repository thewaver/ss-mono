import { createContext } from "svelte";

import { type FormFieldContextType, UNDESCRIBED_CONTEXT } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<FormFieldContextType>();

export const setFormFieldContext = (context: FormFieldContextType) => setContext(context);

export const getFormFieldContext = (): FormFieldContextType => (hasContext() ? getContext() : UNDESCRIBED_CONTEXT);
