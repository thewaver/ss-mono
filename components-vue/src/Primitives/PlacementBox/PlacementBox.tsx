import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { PLACEMENT_BOX_DEFAULTS, PlacementBoxStyles, PlacementBoxUtils, PlacementUtils } from "@thewaver/ss-components";

import { MediaQueryMonitorVueUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { PointerTrackerVueUtils } from "../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { providePlacementBoxContext } from "./PlacementBox.context";
import type { PlacementBoxProps, PlacementBoxSlots } from "./PlacementBox.types";

export const PlacementBox = defineComponent(
    (props: PlacementBoxProps, { slots }: SlotsContext<PlacementBoxSlots>) => {
        const boxRef = shallowRef<HTMLDivElement>();

        const getHasEffect = () => props.computeEffect !== undefined;
        const getTransitionDurationMs = () => props.transitionDurationMs ?? PLACEMENT_BOX_DEFAULTS.transitionDurationMs;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(boxRef, () => !getHasEffect());

        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion(
            () => !PlacementBoxUtils.getIsMotionQueryNeeded(getHasEffect(), getTransitionDurationMs()),
        );

        const pointerPoint = computed(() =>
            PlacementBoxUtils.computePointerPoint(
                props.layout,
                reading.value.boxRatio,
                isPointerPresent.value,
                getHasEffect(),
            ),
        );

        const arrangement = computed(() => PlacementBoxUtils.computeArrangement(props.layout, getHasEffect()));

        const overreach = computed(() => PlacementBoxUtils.computeOverreach(props.layout, pointerPoint.value));

        const effectiveDurationMs = computed(() =>
            PlacementBoxUtils.computeTransitionDurationMs(getTransitionDurationMs(), prefersReducedMotion.value),
        );

        providePlacementBoxContext({
            getPointerPoint: () => pointerPoint.value,
            getArrangement: () => arrangement.value,
            getOverreach: () => overreach.value,
            getPrefersReducedMotion: () => prefersReducedMotion.value,
            getComputeEffect: () => props.computeEffect,
            getTransitionDurationMs: () => effectiveDurationMs.value,
        });

        return () => (
            <div ref={boxRef} class={PlacementBoxStyles.placementBox} role="presentation">
                <div
                    class={PlacementBoxStyles.placementSpacer}
                    style={{ height: PlacementUtils.toContainerWidth(props.layout.heightRatio) }}
                    aria-hidden="true"
                />

                {slots.default?.()}
            </div>
        );
    },
    {
        name: "PlacementBox",
        slots: Object as SlotsType<PlacementBoxSlots>,
        props: declareProps<PlacementBoxProps>({ layout: null, transitionDurationMs: null, computeEffect: null }),
    },
);
