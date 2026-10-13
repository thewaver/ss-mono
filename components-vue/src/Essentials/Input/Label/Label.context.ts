import { type InjectionKey, inject, provide } from "vue";

import { type LabelContextType, UNLABELED_CONTEXT } from "@thewaver/ss-components";

const LABEL_CONTEXT_KEY: InjectionKey<LabelContextType> = Symbol("LabelContext");

export const provideLabelContext = (context: LabelContextType) => provide(LABEL_CONTEXT_KEY, context);

export const useLabelContext = (): LabelContextType => inject(LABEL_CONTEXT_KEY, undefined) ?? UNLABELED_CONTEXT;
