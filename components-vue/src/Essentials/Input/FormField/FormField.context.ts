import { type InjectionKey, inject, provide } from "vue";

import { type FormFieldContextType, UNDESCRIBED_CONTEXT } from "@thewaver/ss-components";

const FORM_FIELD_CONTEXT_KEY: InjectionKey<FormFieldContextType> = Symbol("FormFieldContext");

export const provideFormFieldContext = (context: FormFieldContextType) => provide(FORM_FIELD_CONTEXT_KEY, context);

export const useFormFieldContext = (): FormFieldContextType =>
    inject(FORM_FIELD_CONTEXT_KEY, undefined) ?? UNDESCRIBED_CONTEXT;
