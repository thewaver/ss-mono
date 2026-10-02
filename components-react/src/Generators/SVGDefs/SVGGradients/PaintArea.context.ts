import { createContext, useContext } from "react";

import type { PaintAreaContextType } from "./PaintArea.context.types";

const PaintAreaContext = createContext<PaintAreaContextType | undefined>(undefined);

export const PaintAreaContextProvider = PaintAreaContext.Provider;

export const usePaintAreaContext = () => useContext(PaintAreaContext);
