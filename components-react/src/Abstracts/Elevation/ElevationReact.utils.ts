import { type RefObject, useEffect, useMemo } from "react";

import { ElevationUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/** The React side of `ElevationUtils`: layers registered while mounted, and a base that re-reads itself. */
export namespace ElevationReactUtils {
    /**
     * Registers an element as a stacking layer while it is active.
     *
     * `ElevationUtils.addElevation` following its arguments: added when the layer becomes active and its element
     * exists, moved when either changes, removed on unmount.
     *
     * @param ref The element whose subtree the layer covers.
     * @param isActive Whether the layer currently applies; a closed popup should pass `false`.
     * @param zIndex The `z-index` actually being applied to that element.
     */
    export const useElevation = (ref: RefObject<HTMLElement | null>, isActive: boolean, zIndex: number) => {
        const element = useElement(ref);

        useEffect(
            () => (isActive && element ? ElevationUtils.addElevation(element, zIndex) : undefined),
            [element, isActive, zIndex],
        );
    };

    /**
     * The `z-index` an element has to clear to sit above everything containing it.
     *
     * `ElevationUtils.getBase`, worked out again whenever a layer is added or removed anywhere on the page.
     *
     * @param element The element about to be raised.
     * @returns The highest registered index among the layers containing it, or `0` when it is inside none of
     * them. Add the caller's own step to it rather than using it directly.
     */
    export const useBase = (element: HTMLElement | undefined) => {
        const layers = useStore(ElevationUtils.registeredLayers);

        return useMemo(() => ElevationUtils.getBase(element), [element, layers]);
    };
}
