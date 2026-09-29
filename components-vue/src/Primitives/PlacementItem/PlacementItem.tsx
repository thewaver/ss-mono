import { type SlotsType, defineComponent, shallowRef, watch } from "vue";

import { PLACEMENT_ITEM_DEFAULTS, PlacementItemStyles, PlacementItemUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { usePlacementBoxContext } from "../PlacementBox/PlacementBox.context";
import type { PlacementItemProps, PlacementItemSlots } from "./PlacementItem.types";

const NO_TRANSITION_MS = 0;

export const PlacementItem = defineComponent(
    (props: PlacementItemProps, { slots }: SlotsContext<PlacementItemSlots>) => {
        const context = usePlacementBoxContext();

        const itemRef = shallowRef<HTMLDivElement>();
        const glideWatcher = PlacementItemUtils.createGlideWatcher();
        const isGliding = shallowRef(false);

        watch(
            () => props.placement,
            () => {
                isGliding.value = context.getTransitionDurationMs() > NO_TRANSITION_MS;
            },
        );

        watchAfterRender([itemRef, isGliding, () => props.placement], ([element, isMoving]) => {
            if (!element || !isMoving) return;

            glideWatcher.watch(element, () => {
                isGliding.value = false;
            });
        });

        return () => {
            const placement = props.placement;
            const transitionDelayMs = props.transitionDelayMs ?? PLACEMENT_ITEM_DEFAULTS.transitionDelayMs;
            const effect = PlacementItemUtils.computeEffectStyle(placement, context);

            const transition = isGliding.value
                ? PlacementItemUtils.toTransition(context.getTransitionDurationMs(), transitionDelayMs)
                : undefined;

            return (
                <div
                    ref={itemRef}
                    class={PlacementItemStyles.placementItem}
                    style={PlacementItemUtils.computeStyleValues(placement, props.stackAt, effect, transition)}
                    role="presentation"
                >
                    {slots.default?.()}
                </div>
            );
        };
    },
    {
        name: "PlacementItem",
        slots: Object as SlotsType<PlacementItemSlots>,
        props: declareProps<PlacementItemProps>({ placement: null, stackAt: null, transitionDelayMs: null }),
    },
);
