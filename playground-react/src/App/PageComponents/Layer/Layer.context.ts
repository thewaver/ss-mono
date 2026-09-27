import { createContext, useContext } from "react";

import type { LayerContextType } from "./Layer.context.types";

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const LayerContextProvider = LayerContext.Provider;

export const useLayerContext = () => useContext(LayerContext);
