import { type SlotsType, defineComponent, shallowRef } from "vue";

import { PointerEffectsUtils, SHADOW_CASTER_DEFAULTS, ShadowCasterStyles } from "@thewaver/ss-components";

import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SmootherVueUtils } from "../../../Abstracts/Smoother/SmootherVue.utils";
import { declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ShadowCasterProps, ShadowCasterSlots } from "./ShadowCaster.types";

export const ShadowCaster = defineComponent(
    (props: ShadowCasterProps, { slots }: SlotsContext<ShadowCasterSlots>) => {
        const ref = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled ?? false;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            ref,
            getIsDisabled,
            () => props.pointSource,
        );

        const shadow = SmootherVueUtils.useSmoothed(
            () =>
                PointerEffectsUtils.computeShadowTargets(
                    reading.value,
                    PointerEffectsUtils.getIsResting(
                        getIsDisabled(),
                        isPointerPresent.value,
                        reading.value,
                        props.activeRangePx,
                    ),
                    props,
                ),
            () => props.smoothingMs ?? SHADOW_CASTER_DEFAULTS.smoothingMs,
        );

        return () => (
            <div
                ref={ref}
                class={ShadowCasterStyles.shadowCasterRoot}
                style={{ filter: PointerEffectsUtils.computeShadowFilter(shadow.value, props.color) }}
            >
                {slots.default?.()}
            </div>
        );
    },
    {
        name: "ShadowCaster",
        slots: Object as SlotsType<ShadowCasterSlots>,
        props: declareProps<ShadowCasterProps>({
            activeRangePx: null,
            lightRangePx: null,
            minThrowPx: null,
            maxThrowPx: null,
            restingThrowPx: null,
            minBlurPx: null,
            maxBlurPx: null,
            restingBlurPx: null,
            maxOpacity: null,
            minOpacity: null,
            restingOpacity: null,
            color: null,
            smoothingMs: null,
            isDisabled: Boolean,
            pointSource: null,
        }),
    },
);
