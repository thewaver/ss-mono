import { createMemo, createSignal } from "solid-js";

import { ElementObserver, MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { EasingUtils, MathUtils, Point2dUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const REACH_PX = 700;
const FOLLOW_RATIO = 0.5;
const NEAR_BRIGHTNESS = 1.4;
const HALF = 0.5;
const NO_ROOM = 0;

export const MagnetExample = () => {
    const [getStageRef, setStageRef] = createSignal<HTMLElement>();
    const [getButtonRef, setButtonRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getStageRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getStageSize = ElementObserver.createBorderBoxSizeObserver(getStageRef);
    const getButtonSize = ElementObserver.createBorderBoxSizeObserver(getButtonRef);

    const getRoom = createMemo(() => ({
        x: Math.max((getStageSize().width - getButtonSize().width) * HALF, NO_ROOM),
        y: Math.max((getStageSize().height - getButtonSize().height) * HALF, NO_ROOM),
    }));

    const getPull = createMemo(() => {
        if (!getIsPointerPresent()) return 0;

        return EasingUtils.easeOutQuad(MathUtils.clamp01(1 - getReading().distance / REACH_PX));
    });

    const getLean = createMemo(() => {
        if (getPrefersReducedMotion()) return { x: 0, y: 0 };

        const reading = getReading();
        const towards = Point2dUtils.getNormal(reading.offset);
        const length = reading.distance * FOLLOW_RATIO * getPull();
        const room = getRoom();

        return {
            x: MathUtils.clamp(towards.x * length, -room.x, room.x),
            y: MathUtils.clamp(towards.y * length, -room.y, room.y),
        };
    });

    return (
        <div ref={setStageRef} class={styles.magnetStage}>
            <button
                ref={setButtonRef}
                type="button"
                class={styles.magnetButton}
                style={{
                    transform: `translate(${getLean().x}px, ${getLean().y}px)`,
                    filter: `brightness(${MathUtils.lerp(1, NEAR_BRIGHTNESS, getPull())})`,
                }}
            >
                Come closer
            </button>
        </div>
    );
};
