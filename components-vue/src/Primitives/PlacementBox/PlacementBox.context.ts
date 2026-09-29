import { type InjectionKey, inject, provide } from "vue";

import { type PlacementBoxContextType, PlacementBoxUtils } from "@thewaver/ss-components";

const PLACEMENT_BOX_CONTEXT_KEY: InjectionKey<PlacementBoxContextType> = Symbol("PlacementBoxContext");

export const providePlacementBoxContext = (context: PlacementBoxContextType) =>
    provide(PLACEMENT_BOX_CONTEXT_KEY, context);

export const usePlacementBoxContext = (): PlacementBoxContextType =>
    inject(PLACEMENT_BOX_CONTEXT_KEY, undefined) ?? PlacementBoxUtils.UNTRACKED_CONTEXT;
