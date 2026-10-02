import { createContext, useContext } from "react";

import type { LetterDriverContextType } from "./LetterDriver.context.types";

const LetterDriverContext = createContext<LetterDriverContextType | undefined>(undefined);

export const LetterDriverContextProvider = LetterDriverContext.Provider;

export const useLetterDriverContext = () => useContext(LetterDriverContext);
