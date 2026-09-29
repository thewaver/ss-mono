import { createContext, useContext } from "react";

import type { CheckboxGroupReactContextType } from "./CheckboxGroup.context.types";

const CheckboxGroupContext = createContext<CheckboxGroupReactContextType | undefined>(undefined);

export const CheckboxGroupContextProvider = CheckboxGroupContext.Provider;

export const useCheckboxGroupContext = (): CheckboxGroupReactContextType | undefined =>
    useContext(CheckboxGroupContext);
