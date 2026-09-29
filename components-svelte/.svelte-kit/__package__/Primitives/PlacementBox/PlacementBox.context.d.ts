import { type PlacementBoxContextType } from "@thewaver/ss-components";
export declare const setPlacementBoxContext: (context: PlacementBoxContextType) => PlacementBoxContextType;
/**
 * Reads the enclosing `PlacementBox`'s pointer tracking.
 *
 * Outside a box it answers with an inert context rather than throwing — no pointer, a resting arrangement, no effect
 * and no gliding — so an item rendered on its own degrades to standing still instead of crashing. A consumer building
 * their own item should treat that as the "no box above me" case. Must be called while a component is being set up.
 */
export declare const getPlacementBoxContext: () => PlacementBoxContextType;
