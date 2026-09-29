import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { PointerEffectsUtils, TILTER_DEFAULTS, TilterStyles } from "@thewaver/ss-components";

import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SmootherVueUtils } from "../../../Abstracts/Smoother/SmootherVue.utils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { TilterProps, TilterSlots } from "./Tilter.types";

const NO_LEAN = 0;

export const Tilter = defineComponent(
    (props: TilterProps, { slots }: SlotsContext<TilterSlots>) => {
        const ref = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled ?? false;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(ref, getIsDisabled);

        const isResting = computed(() =>
            PointerEffectsUtils.getIsResting(
                getIsDisabled(),
                isPointerPresent.value,
                reading.value,
                props.activeRangePx,
            ),
        );

        const boxRatio = computed(() => PointerEffectsUtils.getBoxRatio(reading.value));

        const lean = SmootherVueUtils.useSmoothed(
            () =>
                PointerEffectsUtils.computeLeanTargets(
                    boxRatio.value,
                    isResting.value
                        ? NO_LEAN
                        : PointerEffectsUtils.computeEdgeStrength(
                              reading.value,
                              props.tiltRangePx ?? TILTER_DEFAULTS.tiltRangePx,
                          ),
                ),
            () => props.smoothingMs ?? TILTER_DEFAULTS.smoothingMs,
        );

        return () => {
            const state = PointerEffectsUtils.computeTilterState(
                lean.value,
                boxRatio.value,
                props.maxTiltDegrees ?? TILTER_DEFAULTS.maxTiltDegrees,
                isResting.value,
            );

            return (
                <div
                    ref={ref}
                    class={TilterStyles.tilterRoot}
                    style={{ perspective: `${props.perspectivePx ?? TILTER_DEFAULTS.perspectivePx}px` }}
                >
                    <div
                        class={TilterStyles.tilterSurface}
                        style={{ transform: PointerEffectsUtils.getTiltTransform(state.tilt) }}
                    >
                        {slots.default?.()}

                        {slots.renderSheen && (
                            <div class={TilterStyles.tilterSheen}>{callSlot(slots.renderSheen, state)}</div>
                        )}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Tilter",
        slots: Object as SlotsType<TilterSlots>,
        props: declareProps<TilterProps>({
            activeRangePx: null,
            tiltRangePx: null,
            maxTiltDegrees: null,
            perspectivePx: null,
            smoothingMs: null,
            isDisabled: Boolean,
        }),
    },
);
