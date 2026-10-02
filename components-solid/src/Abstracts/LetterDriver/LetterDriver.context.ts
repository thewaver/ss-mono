import { createContext, useContext } from "solid-js";

import type { LetterDriverContextType } from "./LetterDriverSolid.context.types";

const LetterDriverContext = createContext<LetterDriverContextType>();

export const LetterDriverContextProvider = LetterDriverContext.Provider;

export const useLetterDriverContext = () => useContext(LetterDriverContext);
