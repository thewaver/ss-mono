import { type InjectionKey, inject, provide } from "vue";

import type { CheckboxGroupVueContextType } from "./CheckboxGroup.context.types";

const CHECKBOX_GROUP_CONTEXT_KEY: InjectionKey<CheckboxGroupVueContextType> = Symbol("CheckboxGroupContext");

export const provideCheckboxGroupContext = (context: CheckboxGroupVueContextType) =>
    provide(CHECKBOX_GROUP_CONTEXT_KEY, context);

export const useCheckboxGroupContext = (): CheckboxGroupVueContextType | undefined =>
    inject(CHECKBOX_GROUP_CONTEXT_KEY, undefined);
