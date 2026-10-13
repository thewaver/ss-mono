import { createContext, useContext } from "react";

import { type FormFieldContextType, UNDESCRIBED_CONTEXT } from "@thewaver/ss-components";

const FormFieldContext = createContext<FormFieldContextType | undefined>(undefined);

export const FormFieldContextProvider = FormFieldContext.Provider;

export const useFormFieldContext = (): FormFieldContextType => useContext(FormFieldContext) ?? UNDESCRIBED_CONTEXT;
