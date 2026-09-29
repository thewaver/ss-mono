import { type Accessor, createEffect, onCleanup } from "solid-js";

import { type DismisserLayerDefs, DismisserUtils } from "@thewaver/ss-components";

/** The Solid side of {@link DismisserUtils}: a layer registered for as long as a signal says it is open. */
export namespace DismisserSolidUtils {
    /**
     * Registers a layer to be dismissed for as long as it is open.
     *
     * {@link DismisserUtils.addLayer} following an accessor: added when the layer opens, removed when it closes or
     * when the owner is disposed.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsOpen Whether the layer is currently open. Registration follows it, so nothing is
     * listened for while the layer is closed.
     * @param defs The layer's own elements, and what to do when it is dismissed. The reason is passed
     * on, since a layer often wants to return focus to its trigger after Escape but not after a press
     * elsewhere.
     */
    export const createLayer = (getIsOpen: Accessor<boolean>, defs: DismisserLayerDefs) => {
        createEffect(() => {
            if (!getIsOpen()) return;

            onCleanup(DismisserUtils.addLayer(defs));
        });
    };
}
