import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { PointerEffectsUtils, SHADOW_CASTER_DEFAULTS, ShadowCasterStyles as styles } from "@thewaver/ss-components";

import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SmootherSolidUtils } from "../../../Abstracts/Smoother/SmootherSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { ShadowCasterProps } from "./ShadowCasterSolid.types";

export const ShadowCaster = (props: ParentProps<ShadowCasterProps>) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRef, getIsDisabled);

    const getIsResting = createMemo(() =>
        PointerEffectsUtils.getIsResting(
            getIsDisabled(),
            getIsPointerPresent(),
            getReading(),
            access(props.activeRangePx),
        ),
    );

    const getShadow = SmootherSolidUtils.create(
        () =>
            PointerEffectsUtils.computeShadowTargets(getReading(), getIsResting(), {
                lightRangePx: access(props.lightRangePx),
                minThrowPx: access(props.minThrowPx),
                maxThrowPx: access(props.maxThrowPx),
                restingThrowPx: access(props.restingThrowPx),
                minBlurPx: access(props.minBlurPx),
                maxBlurPx: access(props.maxBlurPx),
                restingBlurPx: access(props.restingBlurPx),
                maxOpacity: access(props.maxOpacity),
                minOpacity: access(props.minOpacity),
                restingOpacity: access(props.restingOpacity),
            }),
        () => access(props.smoothingMs) ?? SHADOW_CASTER_DEFAULTS.smoothingMs,
    );

    const getFilter = createMemo(() => PointerEffectsUtils.computeShadowFilter(getShadow(), access(props.color)));

    return (
        <div ref={setRef} class={styles.shadowCasterRoot} style={{ filter: getFilter() }}>
            {props.children}
        </div>
    );
};
