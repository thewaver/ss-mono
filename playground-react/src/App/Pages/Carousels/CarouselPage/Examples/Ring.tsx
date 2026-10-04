import { useEffect, useState } from "react";

import { Button, Carousel, MediaQueryMonitorReactUtils, Tilter } from "@thewaver/ss-components-react";
import type { CarouselPlacementFn } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

const TILT_DEGREES = 18;
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
const PERCENT = 100;

type Props = Pick<CarouselExampleProps, "slides" | "index" | "isDisabled" | "orientation">;

const computeRingPlacement: CarouselPlacementFn = (defs) => {
    const along = defs.orientation === "horizontal" ? defs.size.width : defs.size.height;
    const angle = (defs.distance * FULL_TURN_DEGREES) / Math.max(defs.count, 1);
    const radians = (angle * Math.PI) / HALF_TURN_DEGREES;
    const radius = along * CarouselKnobs.RING_RADIUS_RATIO;
    const alongPercent = along > 0 ? ((radius * Math.sin(radians)) / along) * PERCENT : 0;
    const depth = radius * (Math.cos(radians) - 1);

    return {
        effect: {
            perspective: CarouselKnobs.RING_PERSPECTIVE_PX,
            translate3d: defs.orientation === "horizontal" ? [alongPercent, 0, depth] : [0, alongPercent, depth],
            ...(defs.orientation === "horizontal" ? { rotateY: angle } : { rotateX: -angle }),
        },
        layer: Math.cos(radians),
    };
};

export const RingExample = (props: Props) => {
    const [progress, setProgress] = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isTurning, setIsTurning] = useState(!prefersReducedMotion);

    useEffect(() => {
        if (!isTurning) return;

        let frameId: number;
        let lastMs = performance.now();

        const turn = () => {
            const nowMs = performance.now();
            const elapsedMs = nowMs - lastMs;

            setProgress((previous) => (previous + elapsedMs / CarouselKnobs.RING_LAP_MS) % 1);
            lastMs = nowMs;
            frameId = requestAnimationFrame(turn);
        };

        frameId = requestAnimationFrame(turn);

        return () => cancelAnimationFrame(frameId);
    }, [isTurning]);

    return (
        <div className={styles.ringStack}>
            <Tilter maxTiltDegrees={TILT_DEGREES}>
                <div
                    className={[styles.ringFrame, props.orientation === "vertical" && styles.ringFrameVertical]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <div className={styles.ringSlot}>
                        <Carousel
                            computePlacement={computeRingPlacement}
                            slides={props.slides}
                            index={props.index}
                            progress={[progress, setProgress]}
                            isDisabled={props.isDisabled}
                            orientation={props.orientation}
                            ariaLabel={"Turning ring"}
                            computeSlideLabel={computePositionLabel}
                            computeStepLabel={computeCarouselStepLabel}
                            computeRotationLabel={computeCarouselRotationLabel}
                            renderSlide={(slide, state) => <SlideFront title={slide} state={state} isNarrow={false} />}
                            renderSlideBack={() => <SlideBack isNarrow={false} />}
                        />
                    </div>
                </div>
            </Tilter>

            <Button
                id={"ringTurn"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isTurning ? "Stop" : "Turn"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsTurning(!isTurning);
                }}
            />
        </div>
    );
};
