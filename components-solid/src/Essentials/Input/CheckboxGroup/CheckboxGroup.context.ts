import { createContext, useContext } from "solid-js";

import type { CheckboxGroupContextType } from "@thewaver/ss-components";

const CheckboxGroupContext = createContext<CheckboxGroupContextType>();

export const CheckboxGroupContextProvider = CheckboxGroupContext.Provider;

export const useCheckboxGroupContext = (): CheckboxGroupContextType | undefined => useContext(CheckboxGroupContext);
