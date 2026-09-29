import { createContext } from "svelte";

import type { LayerContextType } from "./Layer.context.types";

const [getContext, setContext, hasContext] = createContext<LayerContextType>();

export const setLayerContext = (context: LayerContextType) => setContext(context);

export const getLayerContext = (): LayerContextType | undefined => (hasContext() ? getContext() : undefined);
