import { useRef } from "react";

import { PointerEffectsUtils, SHADOW_CASTER_DEFAULTS, ShadowCasterStyles } from "@thewaver/ss-components";

import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SmootherReactUtils } from "../../../Abstracts/Smoother/SmootherReact.utils";
import type { ShadowCasterProps } from "./ShadowCaster.types";

export const ShadowCaster = (props: ShadowCasterProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const isDisabled = props.isDisabled ?? false;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(ref, isDisabled);

    const isResting = PointerEffectsUtils.getIsResting(isDisabled, isPointerPresent, reading, props.activeRangePx);

    const shadow = SmootherReactUtils.useSmoothed(
        PointerEffectsUtils.computeShadowTargets(reading, isResting, props),
        props.smoothingMs ?? SHADOW_CASTER_DEFAULTS.smoothingMs,
    );

    return (
        <div
            ref={ref}
            className={ShadowCasterStyles.shadowCasterRoot}
            style={{ filter: PointerEffectsUtils.computeShadowFilter(shadow, props.color) }}
        >
            {props.children}
        </div>
    );
};
