import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import { ElevationUtils } from "@thewaver/ss-components";

/** The registered layers as a signal, shared by every Solid reader for as long as the module is loaded. */
const [getRegisteredLayers, setRegisteredLayers] = createSignal(ElevationUtils.registeredLayers.get());

ElevationUtils.registeredLayers.subscribe(() => setRegisteredLayers(ElevationUtils.registeredLayers.get()));

/** The Solid side of {@link ElevationUtils}: layers registered from accessors, and a base that re-reads itself. */
export namespace ElevationSolidUtils {
    /**
     * Registers an element as a stacking layer for as long as the owning component lives.
     *
     * {@link ElevationUtils.addElevation} following accessors: the layer is added when it becomes active, moved
     * when its element or index changes, and removed on cleanup.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getElement The element whose subtree the layer covers. Nothing is registered until it
     * exists.
     * @param getIsActive Whether the layer currently applies; a closed popup should report `false`.
     * @param getZIndex The `z-index` actually being applied to that element.
     */
    export const createElevation = (
        getElement: Accessor<HTMLElement | undefined>,
        getIsActive: Accessor<boolean>,
        getZIndex: Accessor<number>,
    ) => {
        createEffect(() => {
            const element = getElement();
            const zIndex = getZIndex();

            if (!getIsActive() || !element) return;

            onCleanup(ElevationUtils.addElevation(element, zIndex));
        });
    };

    /**
     * Reports the `z-index` an element has to clear to sit above everything containing it.
     *
     * {@link ElevationUtils.getBase}, re-run whenever a layer is added or removed when read inside a reactive
     * context, so a popup that opens while a modal is already up gets the modal's index rather than a stale zero.
     *
     * @param element The element about to be raised.
     * @returns The highest registered index among the layers containing it, or `0` when it is inside
     * none of them. Add the caller's own step to it rather than using it directly.
     */
    export const getBase = (element: HTMLElement | undefined) => {
        getRegisteredLayers();

        return ElevationUtils.getBase(element);
    };
}
