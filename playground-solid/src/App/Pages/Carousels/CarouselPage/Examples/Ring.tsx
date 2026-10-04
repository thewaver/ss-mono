import { createEffect, createSignal, onCleanup } from "solid-js";

import {
    Button,
    Carousel,
    CarouselPlacementUtils,
    MediaQueryMonitorSolidUtils,
    Tilter,
} from "@thewaver/ss-components-solid";
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
            <div class={styles.ringFrame}>
                <Tilter maxTiltDegrees={() => TILT_DEGREES}>
                    <Carousel
                        computePlacement={CarouselPlacementUtils.drum}
                        slides={props.slides}
                        index={props.index}
                        progress={[getProgress, setProgress]}
                        ariaLabel={"Turning ring"}
                        computeSlideLabel={computePositionLabel}
                        computeStepLabel={computeCarouselStepLabel}
                        computeRotationLabel={computeCarouselRotationLabel}
                        renderSlide={(getSlide, getState) => (
                            <SlideFront title={getSlide()} state={getState} isNarrow={() => false} />
                        )}
                        renderSlideBack={() => <SlideBack isNarrow={() => false} />}
                    />
                </Tilter>
            </div>

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
