import { untrack } from "svelte";

import { type DismisserLayerDefs, DismisserUtils } from "@thewaver/ss-components";

/** The Svelte side of {@link DismisserUtils}: a layer registered for as long as a getter says it is open. */
export namespace DismisserSvelteUtils {
    /**
     * Registers a layer to be dismissed for as long as it is open.
     *
     * {@link DismisserUtils.addLayer} following a getter: added when the layer opens, removed when it closes or when
     * the component is destroyed. The layer takes its place on the stack when it opens, so layers opened later sit
     * above it.
     *
     * Must run while a component is being set up.
     *
     * @param getIsOpen Whether the layer is currently open. Registration follows it, so nothing is listened for
     * while the layer is closed.
     * @param defs The layer's own elements, and what to do when it is dismissed. Read when a press, a focus move or
     * Escape arrives, so functions reading the component's state always see the current one. The reason is passed
     * on, since a layer often wants to return focus to its trigger after Escape but not after a press elsewhere.
     */
    export const createLayer = (getIsOpen: () => boolean, defs: DismisserLayerDefs) => {
        $effect(() => {
            if (!getIsOpen()) return;

            return untrack(() => DismisserUtils.addLayer(defs));
        });
    };
}
