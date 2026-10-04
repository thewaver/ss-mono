import { useRef } from "react";

import { LIGHT_CATCHER_DEFAULTS, LightCatcherStyles, PointerEffectsUtils } from "@thewaver/ss-components";

import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SmootherReactUtils } from "../../../Abstracts/Smoother/SmootherReact.utils";
import type { LightCatcherProps } from "./LightCatcher.types";

const NO_STRENGTH = 0;

export const LightCatcher = (props: LightCatcherProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const isDisabled = props.isDisabled ?? false;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        isDisabled,
        props.pointSource,
    );

    const isResting = PointerEffectsUtils.getIsResting(isDisabled, isPointerPresent, reading, props.activeRangePx);

    const strength = isResting
        ? NO_STRENGTH
        : PointerEffectsUtils.computeEdgeStrength(reading, props.lightRangePx ?? LIGHT_CATCHER_DEFAULTS.lightRangePx);

    const [eased] = SmootherReactUtils.useSmoothed([strength], props.smoothingMs ?? LIGHT_CATCHER_DEFAULTS.smoothingMs);

    return (
        <div
            ref={ref}
            className={LightCatcherStyles.lightCatcherRoot}
            style={{ filter: PointerEffectsUtils.computeLightFilter(eased, props) }}
        >
            {props.children}
        </div>
    );
};
