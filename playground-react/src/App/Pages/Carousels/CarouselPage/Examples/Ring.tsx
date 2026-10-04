import { useEffect, useState } from "react";

import {
    Button,
    Carousel,
    CarouselPlacementUtils,
    MediaQueryMonitorReactUtils,
    Tilter,
} from "@thewaver/ss-components-react";
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

type Props = Pick<CarouselExampleProps, "slides" | "index">;

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
            <div className={styles.ringFrame}>
                <Tilter maxTiltDegrees={TILT_DEGREES}>
                    <Carousel
                        computePlacement={CarouselPlacementUtils.drum}
                        slides={props.slides}
                        index={props.index}
                        progress={[progress, setProgress]}
                        ariaLabel={"Turning ring"}
                        computeSlideLabel={computePositionLabel}
                        computeStepLabel={computeCarouselStepLabel}
                        computeRotationLabel={computeCarouselRotationLabel}
                        renderSlide={(slide, state) => <SlideFront title={slide} state={state} isNarrow={false} />}
                        renderSlideBack={() => <SlideBack isNarrow={false} />}
                    />
                </Tilter>
            </div>

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
