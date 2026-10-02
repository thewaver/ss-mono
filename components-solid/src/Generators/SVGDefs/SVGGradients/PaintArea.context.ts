import { createContext, useContext } from "solid-js";

import type { PaintAreaContextType } from "./PaintAreaSolid.context.types";

const PaintAreaContext = createContext<PaintAreaContextType>();

export const PaintAreaContextProvider = PaintAreaContext.Provider;

export const usePaintAreaContext = () => useContext(PaintAreaContext);
