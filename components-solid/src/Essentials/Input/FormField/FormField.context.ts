import { createContext, useContext } from "solid-js";

import { type FormFieldContextType, UNDESCRIBED_CONTEXT } from "@thewaver/ss-components";

const FormFieldContext = createContext<FormFieldContextType>();

export const FormFieldContextProvider = FormFieldContext.Provider;

export const useFormFieldContext = (): FormFieldContextType => useContext(FormFieldContext) ?? UNDESCRIBED_CONTEXT;
