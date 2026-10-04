import { createEffect, createSignal, onCleanup } from "solid-js";

import { Button, Carousel, MediaQueryMonitorSolidUtils, Tilter, access } from "@thewaver/ss-components-solid";
import type { CarouselPlacementFn } from "@thewaver/ss-components-solid";
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
    const [getProgress, setProgress] = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsTurning, setIsTurning] = createSignal(!getPrefersReducedMotion());

    createEffect(() => {
        if (!getIsTurning()) return;

        let frameId: number;
        let lastMs = performance.now();

        const turn = () => {
            const nowMs = performance.now();

            setProgress((progress) => (progress + (nowMs - lastMs) / CarouselKnobs.RING_LAP_MS) % 1);
            lastMs = nowMs;
            frameId = requestAnimationFrame(turn);
        };

        frameId = requestAnimationFrame(turn);

        onCleanup(() => cancelAnimationFrame(frameId));
    });

    return (
        <div class={styles.ringStack}>
            <Tilter maxTiltDegrees={() => TILT_DEGREES}>
                <div
                    class={styles.ringFrame}
                    classList={{ [styles.ringFrameVertical]: access(props.orientation) === "vertical" }}
                >
                    <div class={styles.ringSlot}>
                        <Carousel
                            computePlacement={computeRingPlacement}
                            slides={props.slides}
                            index={props.index}
                            progress={[getProgress, setProgress]}
                            isDisabled={props.isDisabled}
                            orientation={props.orientation}
                            ariaLabel={"Turning ring"}
                            computeSlideLabel={computePositionLabel}
                            computeStepLabel={computeCarouselStepLabel}
                            computeRotationLabel={computeCarouselRotationLabel}
                            renderSlide={(getSlide, getState) => (
                                <SlideFront title={getSlide()} state={getState} isNarrow={() => false} />
                            )}
                            renderSlideBack={() => <SlideBack isNarrow={() => false} />}
                        />
                    </div>
                </div>
            </Tilter>

            <Button
                id={"ringTurn"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsTurning() ? "Stop" : "Turn"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsTurning((isTurning) => !isTurning);
                }}
            />
        </div>
    );
};
