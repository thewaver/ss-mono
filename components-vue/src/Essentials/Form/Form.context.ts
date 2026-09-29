import { type InjectionKey, inject, provide } from "vue";

import type { FormContextType } from "@thewaver/ss-components";

const FORM_CONTEXT_KEY: InjectionKey<FormContextType> = Symbol("FormContext");

export const provideFormContext = (context: FormContextType) => provide(FORM_CONTEXT_KEY, context);

export const useFormContext = (): FormContextType | undefined => inject(FORM_CONTEXT_KEY, undefined);
