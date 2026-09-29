import { type MaybeRefOrGetter, computed, toValue } from "vue";

import { ElevationUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";

/** The Vue side of `ElevationUtils`: layers registered while mounted, and a base that re-reads itself. */
export namespace ElevationVueUtils {
    /**
     * Registers an element as a stacking layer while it is active.
     *
     * `ElevationUtils.addElevation` following its arguments: added when the layer becomes active and its element
     * exists, moved when either changes, removed on unmount.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element whose subtree the layer covers.
     * @param isActive Whether the layer currently applies; a closed popup should pass `false`.
     * @param zIndex The `z-index` actually being applied to that element.
     */
    export const useElevation = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isActive: MaybeRefOrGetter<boolean>,
        zIndex: MaybeRefOrGetter<number>,
    ) => {
        watchAfterRender(
            [() => toValue(ref), () => toValue(isActive), () => toValue(zIndex)],
            ([element, isOn, index]) => (isOn && element ? ElevationUtils.addElevation(element, index) : undefined),
        );
    };

    /**
     * The `z-index` an element has to clear to sit above everything containing it.
     *
     * `ElevationUtils.getBase`, worked out again whenever a layer is added or removed anywhere on the page.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param element The element about to be raised.
     * @returns A computed ref of the highest registered index among the layers containing it, or `0` when it is
     * inside none of them. Add the caller's own step to it rather than using it directly.
     */
    export const useBase = (element: MaybeRefOrGetter<HTMLElement | null | undefined>) => {
        const layers = useStore(ElevationUtils.registeredLayers);

        return computed(() => {
            void layers.value;

            return ElevationUtils.getBase(toValue(element) ?? undefined);
        });
    };
}
