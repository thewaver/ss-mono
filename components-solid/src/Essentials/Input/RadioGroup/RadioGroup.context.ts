import { createContext, useContext } from "solid-js";

import { type RadioGroupContextType, RadioGroupUtils } from "@thewaver/ss-components";

const RadioGroupContext = createContext<RadioGroupContextType>();

export const RadioGroupContextProvider = RadioGroupContext.Provider;

const ORPHAN_RADIO_CONTEXT: RadioGroupContextType = {
    getName: () => "",
    getValue: () => undefined,
    setValue: () => undefined,
    computeIsTabbable: () => true,
    computePlacement: () => undefined,
    register: () => undefined,
};

export const useRadioGroupContext = (): RadioGroupContextType => {
    const context = useContext(RadioGroupContext);

    RadioGroupUtils.warnIfOrphaned(context !== undefined);

    return context ?? ORPHAN_RADIO_CONTEXT;
};
