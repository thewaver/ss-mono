import { createContext, useContext } from "solid-js";

import type { CheckboxGroupContextType } from "./CheckboxGroup.context.types";

const CheckboxGroupContext = createContext<CheckboxGroupContextType>();

export const CheckboxGroupContextProvider = CheckboxGroupContext.Provider;

export const useCheckboxGroupContext = (): CheckboxGroupContextType | undefined => useContext(CheckboxGroupContext);
