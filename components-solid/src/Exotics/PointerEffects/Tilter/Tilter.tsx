import type { ParentProps } from "solid-js";
import { Show, createMemo, createSignal } from "solid-js";

import { PointerEffectsUtils, TILTER_DEFAULTS, TilterStyles as styles } from "@thewaver/ss-components";

import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SmootherSolidUtils } from "../../../Abstracts/Smoother/SmootherSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { TilterProps } from "./TilterSolid.types";

const NO_LEAN = 0;

export const Tilter = (props: ParentProps<TilterProps>) => {
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

    const getBoxRatio = createMemo(() => PointerEffectsUtils.getBoxRatio(getReading()));

    const getStrength = createMemo(() =>
        getIsResting()
            ? NO_LEAN
            : PointerEffectsUtils.computeEdgeStrength(
                  getReading(),
                  access(props.tiltRangePx) ?? TILTER_DEFAULTS.tiltRangePx,
              ),
    );

    const getLean = SmootherSolidUtils.create(
        () => PointerEffectsUtils.computeLeanTargets(getBoxRatio(), getStrength()),
        () => access(props.smoothingMs) ?? TILTER_DEFAULTS.smoothingMs,
    );

    const getState = createMemo(() =>
        PointerEffectsUtils.computeTilterState(
            getLean(),
            getBoxRatio(),
            access(props.maxTiltDegrees) ?? TILTER_DEFAULTS.maxTiltDegrees,
            getIsResting(),
        ),
    );

    return (
        <div
            ref={setRef}
            class={styles.tilterRoot}
            style={{ perspective: `${access(props.perspectivePx) ?? TILTER_DEFAULTS.perspectivePx}px` }}
        >
            <div
                class={styles.tilterSurface}
                style={{ transform: PointerEffectsUtils.getTiltTransform(getState().tilt) }}
            >
                {props.children}

                <Show when={props.renderSheen}>
                    {(getRenderSheen) => <div class={styles.tilterSheen}>{getRenderSheen()(getState)}</div>}
                </Show>
            </div>
        </div>
    );
};
