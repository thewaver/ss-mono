import { computed } from "vue";

import { CarrierUtils, type CarrierZone } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * The Vue side of `CarrierUtils`: the carry in flight read as a ref, and zones registered while mounted.
 *
 * Starting, aiming and ending a carry are framework-free and called on `CarrierUtils` directly. Vue applies the two
 * writes of a move between zones in one update on its own, so `CarrierUtils.end` needs no `batch` here.
 */
export namespace CarrierVueUtils {
    /**
     * The carry in flight, as a ref that changes whenever it moves.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @returns A ref of the item, its source and target zones and places, and how it was begun, or `undefined` while
     * nothing is being carried.
     */
    export const useCarry = () => useStore(CarrierUtils.carry);

    /**
     * Whether dropping right now would be accepted.
     *
     * `CarrierUtils.getIsTargetAllowed`, worked out again whenever the carry moves. `true` when nothing is being
     * carried.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @returns A computed ref of the answer.
     */
    export const useIsTargetAllowed = () => {
        const carry = useCarry();

        return computed(() => {
            void carry.value;

            return CarrierUtils.getIsTargetAllowed();
        });
    };

    /**
     * Makes a zone visible to carries from the moment the component has rendered until it unmounts.
     *
     * The zone is asked its questions when a carry needs the answers, so its functions should read the component's
     * current props and state rather than copies of them; build it once, in `setup`.
     *
     * Must run inside a component's `setup`.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     * @returns The zone as registered, which is the object a carry started from this component must name.
     */
    export const useZone = (zone: CarrierZone) => {
        watchAfterRender([], () => CarrierUtils.addZone(zone));

        return zone;
    };
}
