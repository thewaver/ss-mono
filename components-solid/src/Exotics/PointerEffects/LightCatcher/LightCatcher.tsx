import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { LIGHT_CATCHER_DEFAULTS, PointerEffectsUtils, LightCatcherStyles as styles } from "@thewaver/ss-components";

import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SmootherSolidUtils } from "../../../Abstracts/Smoother/SmootherSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { LightCatcherProps } from "./LightCatcherSolid.types";

const NO_STRENGTH = 0;

export const LightCatcher = (props: ParentProps<LightCatcherProps>) => {
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

    const getStrength = createMemo(() =>
        getIsResting()
            ? NO_STRENGTH
            : PointerEffectsUtils.computeEdgeStrength(
                  getReading(),
                  access(props.lightRangePx) ?? LIGHT_CATCHER_DEFAULTS.lightRangePx,
              ),
    );

    const getEased = SmootherSolidUtils.create(
        () => [getStrength()],
        () => access(props.smoothingMs) ?? LIGHT_CATCHER_DEFAULTS.smoothingMs,
    );

    const getFilter = createMemo(() => {
        const [strength] = getEased();

        return PointerEffectsUtils.computeLightFilter(strength, {
            restingBrightness: access(props.restingBrightness),
            maxBrightness: access(props.maxBrightness),
            restingLightness: access(props.restingLightness),
            maxLightness: access(props.maxLightness),
        });
    });

    return (
        <div ref={setRef} class={styles.lightCatcherRoot} style={{ filter: getFilter() }}>
            {props.children}
        </div>
    );
};
