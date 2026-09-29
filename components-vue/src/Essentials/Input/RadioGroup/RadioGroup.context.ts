import { type InjectionKey, inject, provide } from "vue";

import { RadioGroupUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import type { RadioGroupVueContextType } from "./RadioGroup.context.types";

const RADIO_GROUP_CONTEXT_KEY: InjectionKey<RadioGroupVueContextType> = Symbol("RadioGroupContext");

export const provideRadioGroupContext = (context: RadioGroupVueContextType) =>
    provide(RADIO_GROUP_CONTEXT_KEY, context);

const ORPHAN_RADIO_CONTEXT: RadioGroupVueContextType = {
    getName: () => "",
    getValue: () => undefined,
    setValue: () => undefined,
    computeIsTabbable: () => true,
    computePlacement: () => undefined,
    register: () => () => undefined,
};

export const useRadioGroupContext = (): RadioGroupVueContextType => {
    const context = inject(RADIO_GROUP_CONTEXT_KEY, undefined);
    const hasGroup = context !== undefined;

    watchAfterRender([], () => RadioGroupUtils.warnIfOrphaned(hasGroup));

    return context ?? ORPHAN_RADIO_CONTEXT;
};
