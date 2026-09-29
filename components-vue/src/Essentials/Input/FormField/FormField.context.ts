import { type InjectionKey, inject, provide } from "vue";

import type { FormFieldContextType } from "@thewaver/ss-components";

const FORM_FIELD_CONTEXT_KEY: InjectionKey<FormFieldContextType> = Symbol("FormFieldContext");

export const provideFormFieldContext = (context: FormFieldContextType) => provide(FORM_FIELD_CONTEXT_KEY, context);

const UNDESCRIBED_CONTEXT: FormFieldContextType = {
    getDescriptionId: () => undefined,
    registerControl: () => undefined,
    unregisterControl: () => undefined,
};

export const useFormFieldContext = (): FormFieldContextType =>
    inject(FORM_FIELD_CONTEXT_KEY, undefined) ?? UNDESCRIBED_CONTEXT;
