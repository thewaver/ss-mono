import { createContext, useContext } from "solid-js";

import type { LayerContextType } from "./Layer.context.types";

const LayerContext = createContext<LayerContextType>();

export const LayerContextProvider = LayerContext.Provider;

export const useLayerContext = () => useContext(LayerContext);
