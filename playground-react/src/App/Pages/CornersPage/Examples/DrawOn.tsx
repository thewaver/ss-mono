import { useEffect, useRef, useState } from "react";

import { Button, Corners, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
import { EasingUtils, MathUtils } from "@thewaver/ss-utils";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const NOT_GROWN = 0;
const FULLY_GROWN = 1;

export const DrawOnExample = (props: Props) => {
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isShown, setIsShown] = useState(false);
    const [growth, setGrowth] = useState(NOT_GROWN);

    const frameRef = useRef<number>(undefined);

    const stopTween = () => {
        if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);

        frameRef.current = undefined;
    };

    useEffect(() => stopTween, []);

    const drawOn = () => {
        stopTween();

        const durationMs = props.transitionDurationMs;

        if (prefersReducedMotion || durationMs <= 0) {
            setGrowth(FULLY_GROWN);

            return;
        }

        const startedAt = performance.now();

        setGrowth(NOT_GROWN);

        const step = (now: number) => {
            const ratio = MathUtils.clamp01((now - startedAt) / durationMs);

            setGrowth(EasingUtils.easeOut(ratio));

            frameRef.current = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frameRef.current = requestAnimationFrame(step);
    };

    const cornerLength = {
        width: Math.max(props.strokeThickness, props.cornerLength.width * growth),
        height: Math.max(props.strokeThickness, props.cornerLength.height * growth),
    };

    return (
        <div className={styles.stage}>
            <div className={styles.frame}>
                <Corners
                    color={isShown ? props.color : TRANSPARENT}
                    cornerLength={cornerLength}
                    strokeThickness={props.strokeThickness}
                    transitionDurationMs={props.transitionDurationMs}
                    visibleCorners={props.visibleCorners}
                >
                    <div className={styles.frameBody}>The arms grow out of each corner</div>
                </Corners>
            </div>

            <div className={styles.controlRow}>
                <Button
                    id={"cornersDrawOn"}
                    isPressed={isShown}
                    renderContent={(flags) => (
                        <PageControlButtonContent flags={flags}>{isShown ? "Hide" : "Draw"}</PageControlButtonContent>
                    )}
                    onClick={() => {
                        if (!isShown) drawOn();

                        setIsShown((previous) => !previous);
                    }}
                />
            </div>
        </div>
    );
};
