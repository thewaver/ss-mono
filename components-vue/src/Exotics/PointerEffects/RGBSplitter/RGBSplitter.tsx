import { type SlotsType, computed, defineComponent, shallowRef, useId } from "vue";

import { PointerEffectsUtils, RGBSplitterStyles, RGB_SPLITTER_DEFAULTS } from "@thewaver/ss-components";
import { RGBSplitterConst } from "@thewaver/ss-components/internal";

import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SmootherVueUtils } from "../../../Abstracts/Smoother/SmootherVue.utils";
import { SVGFilterDefsFactory } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import { declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { RGBSplitterProps, RGBSplitterSlots } from "./RGBSplitter.types";

export const RGBSplitter = defineComponent(
    (props: RGBSplitterProps, { slots }: SlotsContext<RGBSplitterSlots>) => {
        const filterId = useId();

        const ref = shallowRef<HTMLDivElement>();

        const getIsDisabled = () => props.isDisabled ?? false;

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            ref,
            getIsDisabled,
            () => props.pointSource,
        );

        const strength = computed(() =>
            PointerEffectsUtils.getIsResting(
                getIsDisabled(),
                isPointerPresent.value,
                reading.value,
                props.activeRangePx,
            )
                ? RGBSplitterConst.NO_STRENGTH
                : PointerEffectsUtils.computeCenterStrength(
                      reading.value,
                      props.splitRangePx ?? RGB_SPLITTER_DEFAULTS.splitRangePx,
                  ),
        );

        const isReached = computed(() => strength.value > RGBSplitterConst.NO_STRENGTH);

        const opening = computed((previous?: ReturnType<typeof PointerEffectsUtils.openSplit>) =>
            isReached.value || !previous ? PointerEffectsUtils.openSplit(ref.value) : previous,
        );

        const maxOffsetPx = computed(() => props.maxOffsetPx ?? RGB_SPLITTER_DEFAULTS.maxOffsetPx);

        const split = SmootherVueUtils.useSmoothed(
            () => PointerEffectsUtils.computeSplitTargets(opening.value.targets, strength.value, maxOffsetPx.value),
            () => props.smoothingMs ?? RGB_SPLITTER_DEFAULTS.smoothingMs,
        );

        return () => {
            const filterElement = new SVGFilterDefsFactory(filterId)
                .addRGBSplitFilter({
                    red: PointerEffectsUtils.getSplitShift(split.value, 0),
                    green: PointerEffectsUtils.getSplitShift(split.value, 1),
                    blue: PointerEffectsUtils.getSplitShift(split.value, 2),
                    colorMixing: props.colorMixing ?? opening.value.colorMixing,
                    maxOffset: maxOffsetPx.value,
                })
                .computeFilterPrimitives({ method: "chain" });

            return (
                <div
                    ref={ref}
                    class={RGBSplitterStyles.rgbSplitterRoot}
                    style={{
                        filter:
                            filterElement && PointerEffectsUtils.getIsSplit(split.value)
                                ? `url(#${filterId})`
                                : undefined,
                    }}
                >
                    <svg class={RGBSplitterStyles.rgbSplitterFilterHost} aria-hidden="true">
                        <defs>{filterElement}</defs>
                    </svg>

                    {slots.default?.()}
                </div>
            );
        };
    },
    {
        name: "RGBSplitter",
        slots: Object as SlotsType<RGBSplitterSlots>,
        props: declareProps<RGBSplitterProps>({
            activeRangePx: null,
            splitRangePx: null,
            maxOffsetPx: null,
            colorMixing: null,
            smoothingMs: null,
            isDisabled: Boolean,
            pointSource: null,
        }),
    },
);
