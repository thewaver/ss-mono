import type { ParentProps } from "solid-js";
import { createMemo, createSignal, createUniqueId, on, untrack } from "solid-js";

import { PointerEffectsUtils, RGB_SPLITTER_DEFAULTS, RGBSplitterStyles as styles } from "@thewaver/ss-components";
import { RGBSplitterConst } from "@thewaver/ss-components/internal";

import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SmootherSolidUtils } from "../../../Abstracts/Smoother/SmootherSolid.utils";
import { SVGFilterDefsFactory } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import { access } from "../../../Utils/propUtils";
import type { RGBSplitterProps } from "./RGBSplitterSolid.types";

export const RGBSplitter = (props: ParentProps<RGBSplitterProps>) => {
    const filterId = createUniqueId();

    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRef, getIsDisabled, () =>
        access(props.pointSource),
    );

    const getIsResting = createMemo(() =>
        PointerEffectsUtils.getIsResting(
            getIsDisabled(),
            getIsPointerPresent(),
            getReading(),
            access(props.activeRangePx),
        ),
    );

    const getStrength = createMemo(() =>
        getIsResting()
            ? RGBSplitterConst.NO_STRENGTH
            : PointerEffectsUtils.computeCenterStrength(
                  getReading(),
                  access(props.splitRangePx) ?? RGB_SPLITTER_DEFAULTS.splitRangePx,
              ),
    );

    const getIsReached = createMemo(() => getStrength() > RGBSplitterConst.NO_STRENGTH);

    const getOpening = createMemo(
        on(getIsReached, (isReached, wasReached, previous?: ReturnType<typeof PointerEffectsUtils.openSplit>) =>
            (isReached && !wasReached) || !previous ? PointerEffectsUtils.openSplit(getRef()) : previous,
        ),
    );

    const getColorMixing = () => access(props.colorMixing) ?? getOpening().colorMixing;

    const getMaxOffsetPx = createMemo(() => access(props.maxOffsetPx) ?? RGB_SPLITTER_DEFAULTS.maxOffsetPx);

    const getSplit = SmootherSolidUtils.create(
        () => PointerEffectsUtils.computeSplitTargets(getOpening().targets, getStrength(), getMaxOffsetPx()),
        () => access(props.smoothingMs) ?? RGB_SPLITTER_DEFAULTS.smoothingMs,
    );

    const getFilterElement = createMemo(() => {
        const maxOffset = getMaxOffsetPx();

        return untrack(() =>
            new SVGFilterDefsFactory(filterId)
                .addRGBSplitFilter({
                    red: () => PointerEffectsUtils.getSplitShift(getSplit(), 0),
                    green: () => PointerEffectsUtils.getSplitShift(getSplit(), 1),
                    blue: () => PointerEffectsUtils.getSplitShift(getSplit(), 2),
                    colorMixing: getColorMixing,
                    maxOffset,
                })
                .computeFilterPrimitives({ method: "chain" }),
        );
    });

    const getFilter = () =>
        getFilterElement() && PointerEffectsUtils.getIsSplit(getSplit()) ? `url(#${filterId})` : undefined;

    return (
        <div ref={setRef} class={styles.rgbSplitterRoot} style={{ filter: getFilter() }}>
            <svg class={styles.rgbSplitterFilterHost} aria-hidden="true">
                <defs>{getFilterElement()}</defs>
            </svg>

            {props.children}
        </div>
    );
};
