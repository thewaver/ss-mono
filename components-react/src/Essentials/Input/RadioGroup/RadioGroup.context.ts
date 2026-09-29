import { createContext, useContext, useEffect } from "react";

import { RadioGroupUtils } from "@thewaver/ss-components";

import type { RadioGroupReactContextType } from "./RadioGroup.context.types";

const RadioGroupContext = createContext<RadioGroupReactContextType | undefined>(undefined);

export const RadioGroupContextProvider = RadioGroupContext.Provider;

const ORPHAN_RADIO_CONTEXT: RadioGroupReactContextType = {
    name: "",
    value: undefined,
    setValue: () => undefined,
    computeIsTabbable: () => true,
    computePlacement: () => undefined,
    register: () => () => undefined,
};

export const useRadioGroupContext = (): RadioGroupReactContextType => {
    const context = useContext(RadioGroupContext);
    const hasGroup = context !== undefined;

    useEffect(() => RadioGroupUtils.warnIfOrphaned(hasGroup), [hasGroup]);

    return context ?? ORPHAN_RADIO_CONTEXT;
};
