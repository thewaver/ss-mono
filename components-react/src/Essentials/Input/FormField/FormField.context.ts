import { createContext, useContext } from "react";

import type { FormFieldContextType } from "@thewaver/ss-components";

const FormFieldContext = createContext<FormFieldContextType | undefined>(undefined);

export const FormFieldContextProvider = FormFieldContext.Provider;

const UNDESCRIBED_CONTEXT: FormFieldContextType = {
    getDescriptionId: () => undefined,
    registerControl: () => undefined,
    unregisterControl: () => undefined,
};

export const useFormFieldContext = (): FormFieldContextType => useContext(FormFieldContext) ?? UNDESCRIBED_CONTEXT;
