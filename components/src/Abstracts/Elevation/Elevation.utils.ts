import { type Store, StoreUtils } from "@thewaver/ss-utils";

import type { ElevationLayer } from "./Elevation.types";

/** The floor a popup is raised from when nothing above it has claimed a z-index. */
const NO_ELEVATION = 0;

/** Every registered stacking context, in registration order. Shared, because nesting is a page-wide fact. */
const layers = StoreUtils.create<readonly ElevationLayer[]>([]);

/**
 * Tracks the stacking contexts an element is nested inside, so a popup can be raised above them.
 *
 * A popup rendered into a portal loses whatever `z-index` its opener sat under, and a popup
 * rendered in place cannot escape an ancestor that has one. Both cases need the same answer: what
 * is the highest `z-index` already applied to something containing me. Registrations live in one
 * module-wide list, so any component can ask without knowing who else is on screen.
 */
export namespace ElevationUtils {
    /**
     * Every stacking layer registered on the page, as a store.
     *
     * The list is replaced rather than edited on each change, so a reader following it hears about every layer
     * added or removed. Read {@link getBase} for the question most callers are asking.
     */
    export const registeredLayers: Store<readonly ElevationLayer[]> = { get: layers.get, subscribe: layers.subscribe };

    /**
     * Registers an element as a stacking layer until the returned function is called.
     *
     * Call this from a component that raises itself — a modal, a drawer, a popover — so that anything
     * opening inside it can find out how high it must go. Removing the same layer twice is harmless.
     *
     * @param element The element whose subtree the layer covers.
     * @param zIndex The `z-index` actually being applied to that element.
     * @returns The function that removes the layer again.
     */
    export const addElevation = (element: HTMLElement, zIndex: number) => {
        const layer: ElevationLayer = { element, zIndex };

        layers.update((current) => [...current, layer]);

        return () => {
            layers.update((current) =>
                current.includes(layer) ? current.filter((entry) => entry !== layer) : current,
            );
        };
    };

    /**
     * Reports the `z-index` an element has to clear to sit above everything containing it.
     *
     * @param element The element about to be raised.
     * @returns The highest registered index among the layers containing it, or `0` when it is inside
     * none of them. Add the caller's own step to it rather than using it directly.
     */
    export const getBase = (element: HTMLElement | undefined) => {
        if (!element) return NO_ELEVATION;

        let base = NO_ELEVATION;

        for (const layer of layers.get()) {
            if (layer.element.contains(element)) base = Math.max(base, layer.zIndex);
        }

        return base;
    };
}
