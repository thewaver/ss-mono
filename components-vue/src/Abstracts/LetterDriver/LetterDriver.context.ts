import { type InjectionKey, inject, provide } from "vue";

import type { LetterDriverContextType } from "./LetterDriver.context.types";

const LETTER_DRIVER_CONTEXT_KEY: InjectionKey<LetterDriverContextType> = Symbol("LetterDriverContext");

export const provideLetterDriverContext = (context: LetterDriverContextType) =>
    provide(LETTER_DRIVER_CONTEXT_KEY, context);

export const useLetterDriverContext = (): LetterDriverContextType | undefined =>
    inject(LETTER_DRIVER_CONTEXT_KEY, undefined);
