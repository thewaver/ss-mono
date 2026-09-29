import { useEffect } from "react";

import { type DismisserLayerDefs, DismisserUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";

/** The React side of `DismisserUtils`: a layer registered for as long as it is open. */
export namespace DismisserReactUtils {
    /**
     * Registers a layer to be dismissed for as long as it is open.
     *
     * `DismisserUtils.addLayer` following `isOpen`: added when the layer opens, removed when it closes or unmounts.
     * The layer takes its place on the stack when it opens, so layers opened later sit above it.
     *
     * @param isOpen Whether the layer is currently open. Nothing is listened for while it is closed.
     * @param defs The layer's own elements, and what to do when it is dismissed. Read when a press, a focus move
     * or Escape arrives, so this render's are always the ones used.
     */
    export const useLayer = (isOpen: boolean, defs: DismisserLayerDefs) => {
        const latest = useLatest(defs);

        useEffect(() => {
            if (!isOpen) return;

            return DismisserUtils.addLayer({
                getRoots: () => latest.current.getRoots(),
                onDismiss: (reason) => latest.current.onDismiss(reason),
            });
        }, [isOpen, latest]);
    };
}
