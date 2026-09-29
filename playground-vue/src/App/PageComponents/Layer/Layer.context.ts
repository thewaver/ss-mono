import { type InjectionKey, inject, provide } from "vue";

import type { LayerContextType } from "./Layer.context.types";

const LAYER_CONTEXT_KEY: InjectionKey<LayerContextType> = Symbol("LayerContext");

export const provideLayerContext = (value: LayerContextType) => provide(LAYER_CONTEXT_KEY, value);

export const useLayerContext = () => inject(LAYER_CONTEXT_KEY, undefined);
