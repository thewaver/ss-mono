import { createContext } from "svelte";

import { RadioGroupUtils } from "@thewaver/ss-components";

import type { RadioGroupSvelteContextType } from "./RadioGroup.context.types.js";

const [getContext, setContext, hasContext] = createContext<RadioGroupSvelteContextType>();

export const setRadioGroupContext = (context: RadioGroupSvelteContextType) => setContext(context);

const ORPHAN_RADIO_CONTEXT: RadioGroupSvelteContextType = {
    getName: () => "",
    getValue: () => undefined,
    setValue: () => undefined,
    computeIsTabbable: () => true,
    computePlacement: () => undefined,
    register: () => () => undefined,
};

export const getRadioGroupContext = (): RadioGroupSvelteContextType => {
    const hasGroup = hasContext();

    RadioGroupUtils.warnIfOrphaned(hasGroup);

    return hasGroup ? getContext() : ORPHAN_RADIO_CONTEXT;
};
