import { createContext, useContext } from "react";

import type { FormReactContextType } from "./Form.context.types";

const FormContext = createContext<FormReactContextType | undefined>(undefined);

export const FormContextProvider = FormContext.Provider;

export const useFormContext = () => useContext(FormContext);
