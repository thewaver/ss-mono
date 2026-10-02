import { createContext } from "svelte";

import type { LetterDriverContextType } from "./LetterDriver.context.types.js";

const [getContext, setContext, hasContext] = createContext<LetterDriverContextType>();

export const setLetterDriverContext = (context: LetterDriverContextType) => setContext(context);

export const getLetterDriverContext = (): LetterDriverContextType | undefined =>
    hasContext() ? getContext() : undefined;
