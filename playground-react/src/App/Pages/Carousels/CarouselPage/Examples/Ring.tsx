import { useEffect, useState } from "react";

import { Button, Carousel, CarouselPlacementUtils, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";

const computeRingPlacement = CarouselPlacementUtils.createPaddleWheel({
    perspectivePx: CarouselKnobs.RING_PERSPECTIVE_PX,
});

type Props = Pick<CarouselExampleProps, "slides" | "index" | "isDisabled" | "orientation">;

export const RingExample = (props: Props) => {
    const [progress, setProgress] = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isTurning, setIsTurning] = useState(!prefersReducedMotion);

    const frameClasses = styles.ringFrames[props.orientation];

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
                        renderSlide={(slide, state) => (
                            <div className={frameClasses.front}>
                                <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>
                            </div>
                        )}
                        renderSlideBack={(slide, state) => (
                            <div className={frameClasses.back}>
                                <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>
                            </div>
                        )}
                    />
                </div>
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
