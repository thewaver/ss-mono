import { useId, useRef, useState } from "react";

import { PointerEffectsUtils, RGB_SPLITTER_DEFAULTS, RGBSplitterStyles as styles } from "@thewaver/ss-components";
import { RGBSplitterConst } from "@thewaver/ss-components/internal";

import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SmootherReactUtils } from "../../../Abstracts/Smoother/SmootherReact.utils";
import { SVGFilterDefsFactory } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import type { RGBSplitterProps } from "./RGBSplitter.types";

export const RGBSplitter = (props: RGBSplitterProps) => {
    const filterId = useId();

    const ref = useRef<HTMLDivElement | null>(null);

    const isDisabled = props.isDisabled ?? false;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        isDisabled,
        props.pointSource,
    );

    const isResting = PointerEffectsUtils.getIsResting(isDisabled, isPointerPresent, reading, props.activeRangePx);

    const strength = isResting
        ? RGBSplitterConst.NO_STRENGTH
        : PointerEffectsUtils.computeCenterStrength(reading, props.splitRangePx ?? RGB_SPLITTER_DEFAULTS.splitRangePx);

    const isReached = strength > RGBSplitterConst.NO_STRENGTH;

    const [wasReached, setWasReached] = useState(false);
    const [opening, setOpening] = useState(() => PointerEffectsUtils.openSplit(undefined));

    if (isReached !== wasReached) {
        setWasReached(isReached);

        if (isReached) setOpening(PointerEffectsUtils.openSplit(ref.current ?? undefined));
    }

    const colorMixing = props.colorMixing ?? opening.colorMixing;

    const maxOffsetPx = props.maxOffsetPx ?? RGB_SPLITTER_DEFAULTS.maxOffsetPx;

    const split = SmootherReactUtils.useSmoothed(
        PointerEffectsUtils.computeSplitTargets(opening.targets, strength, maxOffsetPx),
        props.smoothingMs ?? RGB_SPLITTER_DEFAULTS.smoothingMs,
    );

    const filterElement = new SVGFilterDefsFactory(filterId)
        .addRGBSplitFilter({
            red: PointerEffectsUtils.getSplitShift(split, 0),
            green: PointerEffectsUtils.getSplitShift(split, 1),
            blue: PointerEffectsUtils.getSplitShift(split, 2),
            colorMixing,
            maxOffset: maxOffsetPx,
        })
        .computeFilterPrimitives({ method: "chain" });

    return (
        <div
            ref={ref}
            className={styles.rgbSplitterRoot}
            style={{
                filter: filterElement && PointerEffectsUtils.getIsSplit(split) ? `url(#${filterId})` : undefined,
            }}
        >
            <svg className={styles.rgbSplitterFilterHost} aria-hidden="true">
                <defs>{filterElement}</defs>
            </svg>

            {props.children}
        </div>
    );
};
