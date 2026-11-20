import { type InjectionKey, inject, provide } from "vue";

import { type PlacementBoxContextType, PlacementBoxUtils } from "@thewaver/ss-components";

const PLACEMENT_BOX_CONTEXT_KEY: InjectionKey<PlacementBoxContextType> = Symbol("PlacementBoxContext");

export const providePlacementBoxContext = (context: PlacementBoxContextType) =>
    provide(PLACEMENT_BOX_CONTEXT_KEY, context);

/**
 * Reads the enclosing `PlacementBox`'s pointer tracking.
 *
 * Outside a box it answers with an inert context rather than throwing — no pointer, a resting arrangement, no effect
 * and no gliding — so an item rendered on its own degrades to standing still instead of crashing. A consumer building
 * their own item should treat that as the "no box above me" case.
 */
export const usePlacementBoxContext = (): PlacementBoxContextType =>
    inject(PLACEMENT_BOX_CONTEXT_KEY, undefined) ?? PlacementBoxUtils.UNTRACKED_CONTEXT;
