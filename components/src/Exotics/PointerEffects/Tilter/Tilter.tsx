import type { ParentProps } from "solid-js";
import { Show, createMemo, createSignal } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { access } from "../../../Utils/propUtils";
import { TILTER_DEFAULTS } from "./Tilter.const";
import type { TilterProps, TilterState } from "./Tilter.types";

import * as styles from "./Tilter.css";

const CENTER = 0.5;
const FULL_SWING = 2;
const PERCENT = 100;
const FULL_LEAN = 1;
const NO_LEAN = 0;
const SHEEN_OVERTRAVEL = 1.6;

export const Tilter = (props: ParentProps<TilterProps>) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef, getIsDisabled);

    const getIsInRange = createMemo(() => {
        const activeRangePx = access(props.activeRangePx);

        return activeRangePx === undefined || getReading().distance <= activeRangePx;
    });

    const getIsResting = createMemo(() => getIsDisabled() || !getIsPointerPresent() || !getIsInRange());

    const getMaxTiltDegrees = createMemo(() => access(props.maxTiltDegrees) ?? TILTER_DEFAULTS.maxTiltDegrees);

    const getBoxRatio = createMemo(() => ({
        x: MathUtils.clamp01(getReading().boxRatio.x),
        y: MathUtils.clamp01(getReading().boxRatio.y),
    }));

    const getStrength = createMemo(() => {
        if (getIsResting()) return NO_LEAN;

        const rangePx = access(props.tiltRangePx) ?? TILTER_DEFAULTS.tiltRangePx;
        const { distance, edgeDistance } = getReading();

        if (distance <= edgeDistance) return FULL_LEAN;
        if (rangePx <= edgeDistance) return NO_LEAN;

        return MathUtils.clamp01((rangePx - distance) / (rangePx - edgeDistance));
    });

    const getLeanedOffset = createMemo(() => {
        const ratio = getBoxRatio();
        const strength = getStrength();

        return { x: (ratio.x - CENTER) * strength, y: (ratio.y - CENTER) * strength };
    });

    const getTilt = createMemo(() => {
        const offset = getLeanedOffset();

        return {
            x: offset.y * FULL_SWING * -getMaxTiltDegrees(),
            y: offset.x * FULL_SWING * getMaxTiltDegrees(),
        };
    });

    const getSheenPosition = createMemo(() => {
        const offset = getLeanedOffset();

        return MathUtils.clamp01(CENTER - (offset.x + offset.y) * CENTER * SHEEN_OVERTRAVEL) * PERCENT;
    });

    const getState = createMemo((): TilterState => ({
        tilt: getTilt(),
        boxRatio: getBoxRatio(),
        sheenPosition: getSheenPosition(),
        strength: getStrength(),
        isResting: getIsResting(),
    }));

    return (
        <div
            ref={setRef}
            class={styles.tilterRoot}
            style={{ perspective: `${access(props.perspectivePx) ?? TILTER_DEFAULTS.perspectivePx}px` }}
        >
            <div
                class={styles.tilterSurface}
                style={{ transform: `rotateX(${getTilt().x}deg) rotateY(${getTilt().y}deg)` }}
            >
                {props.children}

                <Show when={props.renderSheen}>
                    {(getRenderSheen) => <div class={styles.tilterSheen}>{getRenderSheen()(getState)}</div>}
                </Show>
            </div>
        </div>
    );
};
