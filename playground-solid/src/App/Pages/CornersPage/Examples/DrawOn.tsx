import { createMemo, createSignal, onCleanup } from "solid-js";

import { Button, Corners, MediaQueryMonitorSolidUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/CornersPage/CornersPage.css";
import { EasingUtils, MathUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const NOT_GROWN = 0;
const FULLY_GROWN = 1;

export const DrawOnExample = (props: Props) => {
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsShown, setIsShown] = createSignal(false);
    const [getGrowth, setGrowth] = createSignal(NOT_GROWN);

    let frame: number | undefined;

    const stopTween = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);

        frame = undefined;
    };

    onCleanup(stopTween);

    const drawOn = () => {
        stopTween();

        const durationMs = access(props.transitionDurationMs);

        if (getPrefersReducedMotion() || durationMs <= 0) {
            setGrowth(FULLY_GROWN);

            return;
        }

        const startedAt = performance.now();

        setGrowth(NOT_GROWN);

        const step = (now: number) => {
            const ratio = MathUtils.clamp01((now - startedAt) / durationMs);

            setGrowth(EasingUtils.easeOut(ratio));

            frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frame = requestAnimationFrame(step);
    };

    const getCornerLength = createMemo(() => {
        const full = access(props.cornerLength);
        const thickness = access(props.strokeThickness);

        return {
            width: Math.max(thickness, full.width * getGrowth()),
            height: Math.max(thickness, full.height * getGrowth()),
        };
    });

    return (
        <div class={styles.stage}>
            <div class={styles.frame}>
                <Corners
                    color={() => (getIsShown() ? access(props.color) : TRANSPARENT)}
                    cornerLength={getCornerLength}
                    strokeThickness={props.strokeThickness}
                    transitionDurationMs={props.transitionDurationMs}
                    visibleCorners={props.visibleCorners}
                >
                    <div class={styles.frameBody}>The arms grow out of each corner</div>
                </Corners>
            </div>

            <div class={styles.controlRow}>
                <Button
                    id={"cornersDrawOn"}
                    isPressed={getIsShown}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>{getIsShown() ? "Hide" : "Draw"}</PageButtonContent>
                    )}
                    onClick={() => {
                        if (!getIsShown()) drawOn();

                        setIsShown((previous) => !previous);
                    }}
                />
            </div>
        </div>
    );
};
