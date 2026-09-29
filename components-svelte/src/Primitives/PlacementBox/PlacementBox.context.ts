import { createContext } from "svelte";

import { type PlacementBoxContextType, PlacementBoxUtils } from "@thewaver/ss-components";

const [getContext, setContext, hasContext] = createContext<PlacementBoxContextType>();

export const setPlacementBoxContext = (context: PlacementBoxContextType) => setContext(context);

/**
 * Reads the enclosing `PlacementBox`'s pointer tracking.
 *
 * Outside a box it answers with an inert context rather than throwing — no pointer, a resting arrangement, no effect
 * and no gliding — so an item rendered on its own degrades to standing still instead of crashing. A consumer building
 * their own item should treat that as the "no box above me" case. Must be called while a component is being set up.
 */
export const getPlacementBoxContext = (): PlacementBoxContextType =>
    hasContext() ? getContext() : PlacementBoxUtils.UNTRACKED_CONTEXT;
