import { createContext } from "svelte";
import { RadioGroupUtils } from "@thewaver/ss-components";
const [getContext, setContext, hasContext] = createContext();
export const setRadioGroupContext = (context) => setContext(context);
const ORPHAN_RADIO_CONTEXT = {
    getName: () => "",
    getValue: () => undefined,
    setValue: () => undefined,
    computeIsTabbable: () => true,
    computePlacement: () => undefined,
    register: () => () => undefined,
};
export const getRadioGroupContext = () => {
    const hasGroup = hasContext();
    RadioGroupUtils.warnIfOrphaned(hasGroup);
    return hasGroup ? getContext() : ORPHAN_RADIO_CONTEXT;
};
