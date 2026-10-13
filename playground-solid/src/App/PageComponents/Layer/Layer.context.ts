import { createContext, useContext } from "solid-js";

import type { LayerContextType } from "./Layer.contextSolid.types";

const LayerContext = createContext<LayerContextType>();

export const LayerContextProvider = LayerContext.Provider;

export const useLayerContext = () => useContext(LayerContext);
