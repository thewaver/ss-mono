import { createEffect, createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { MathUtils, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerTrackerReadingExampleProps } from "../PointerTrackerPage.types";

import * as styles from "../PointerTrackerPage.css";

const LIGHT_RANGE_PX = 420;
const MAX_THROW_PX = 46;
const RESTING_THROW_PX = 12;
const NEAR_BLUR_PX = 6;
const FAR_BLUR_PX = 22;
const RESTING_BLUR_PX = 12;
const NEAR_OPACITY = 0.85;
const FAR_OPACITY = 0.25;

type Props = PointerTrackerReadingExampleProps;

export const CastShadowExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getReach = createMemo(() =>
        getIsPointerPresent() ? MathUtils.clamp01(getReading().distance / LIGHT_RANGE_PX) : 1,
    );

    const getThrow = createMemo(() => {
        if (getPrefersReducedMotion()) return { x: 0, y: RESTING_THROW_PX };

        const away = Point2dUtils.getNormal(getReading().offset);
        const length = MAX_THROW_PX * getReach();

        return { x: -away.x * length, y: -away.y * length };
    });

    createEffect(() => {
        props.onReadingChange(getReading());
    });

    return (
        <div class={styles.stage}>
            <div
                ref={setRef}
                class={styles.card}
                style={{
                    "box-shadow": `${getThrow().x}px ${getThrow().y}px ${getPrefersReducedMotion() ? RESTING_BLUR_PX : MathUtils.lerp(NEAR_BLUR_PX, FAR_BLUR_PX, getReach())}px rgb(0 0 0 / ${MathUtils.lerp(NEAR_OPACITY, FAR_OPACITY, getReach())})`,
                }}
            >
                Move the pointer around me
            </div>
        </div>
    );
};
