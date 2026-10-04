import { type SlotsType, defineComponent, shallowRef } from "vue";

import { LIGHT_CATCHER_DEFAULTS, LightCatcherStyles, PointerEffectsUtils } from "@thewaver/ss-components";

import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SmootherVueUtils } from "../../../Abstracts/Smoother/SmootherVue.utils";
import { declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { LightCatcherProps, LightCatcherSlots } from "./LightCatcher.types";

const NO_STRENGTH = 0;

export const LightCatcher = defineComponent(
    (props: LightCatcherProps, { slots }: SlotsContext<LightCatcherSlots>) => {
        const ref = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled ?? false;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            ref,
            getIsDisabled,
            () => props.pointSource,
        );

        const eased = SmootherVueUtils.useSmoothed(
            () => {
                const isResting = PointerEffectsUtils.getIsResting(
                    getIsDisabled(),
                    isPointerPresent.value,
                    reading.value,
                    props.activeRangePx,
                );

                return [
                    isResting
                        ? NO_STRENGTH
                        : PointerEffectsUtils.computeEdgeStrength(
                              reading.value,
                              props.lightRangePx ?? LIGHT_CATCHER_DEFAULTS.lightRangePx,
                          ),
                ];
            },
            () => props.smoothingMs ?? LIGHT_CATCHER_DEFAULTS.smoothingMs,
        );

        return () => (
            <div
                ref={ref}
                class={LightCatcherStyles.lightCatcherRoot}
                style={{ filter: PointerEffectsUtils.computeLightFilter(eased.value[0], props) }}
            >
                {slots.default?.()}
            </div>
        );
    },
    {
        name: "LightCatcher",
        slots: Object as SlotsType<LightCatcherSlots>,
        props: declareProps<LightCatcherProps>({
            activeRangePx: null,
            lightRangePx: null,
            maxBrightness: null,
            restingBrightness: null,
            maxLightness: null,
            restingLightness: null,
            smoothingMs: null,
            isDisabled: Boolean,
            pointSource: null,
        }),
    },
);
