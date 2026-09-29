import { useRef } from "react";

import { PointerEffectsUtils, TILTER_DEFAULTS, TilterStyles } from "@thewaver/ss-components";

import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SmootherReactUtils } from "../../../Abstracts/Smoother/SmootherReact.utils";
import type { TilterProps } from "./Tilter.types";

const NO_LEAN = 0;

export const Tilter = (props: TilterProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const isDisabled = props.isDisabled ?? false;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(ref, isDisabled);

    const isResting = PointerEffectsUtils.getIsResting(isDisabled, isPointerPresent, reading, props.activeRangePx);

    const boxRatio = PointerEffectsUtils.getBoxRatio(reading);

    const strength = isResting
        ? NO_LEAN
        : PointerEffectsUtils.computeEdgeStrength(reading, props.tiltRangePx ?? TILTER_DEFAULTS.tiltRangePx);

    const lean = SmootherReactUtils.useSmoothed(
        PointerEffectsUtils.computeLeanTargets(boxRatio, strength),
        props.smoothingMs ?? TILTER_DEFAULTS.smoothingMs,
    );

    const state = PointerEffectsUtils.computeTilterState(
        lean,
        boxRatio,
        props.maxTiltDegrees ?? TILTER_DEFAULTS.maxTiltDegrees,
        isResting,
    );

    return (
        <div
            ref={ref}
            className={TilterStyles.tilterRoot}
            style={{ perspective: `${props.perspectivePx ?? TILTER_DEFAULTS.perspectivePx}px` }}
        >
            <div
                className={TilterStyles.tilterSurface}
                style={{ transform: PointerEffectsUtils.getTiltTransform(state.tilt) }}
            >
                {props.children}

                {props.renderSheen && <div className={TilterStyles.tilterSheen}>{props.renderSheen(state)}</div>}
            </div>
        </div>
    );
};
