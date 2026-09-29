import { type MaybeRefOrGetter, toValue } from "vue";

import { type DismisserLayerDefs, DismisserUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `DismisserUtils`: a layer registered for as long as it is open. */
export namespace DismisserVueUtils {
    /**
     * Registers a layer to be dismissed for as long as it is open.
     *
     * `DismisserUtils.addLayer` following `isOpen`: added when the layer opens, removed when it closes or unmounts.
     * The layer takes its place on the stack when it opens, so layers opened later sit above it.
     *
     * Must run inside a component's `setup`.
     *
     * @param isOpen Whether the layer is currently open. Nothing is listened for while it is closed.
     * @param defs The layer's own elements, and what to do when it is dismissed. Read when a press, a focus move or
     * Escape arrives, so they should read the component's current state rather than a copy of it.
     */
    export const useLayer = (isOpen: MaybeRefOrGetter<boolean>, defs: DismisserLayerDefs) => {
        watchAfterRender([() => toValue(isOpen)], ([isShown]) => {
            if (!isShown) return;

            return DismisserUtils.addLayer({
                getRoots: () => defs.getRoots(),
                onDismiss: (reason) => defs.onDismiss(reason),
            });
        });
    };
}
