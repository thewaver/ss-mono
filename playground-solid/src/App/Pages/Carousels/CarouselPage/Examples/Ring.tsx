import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import {
    Button,
    Carousel,
    CarouselPlacementUtils,
    MediaQueryMonitorSolidUtils,
    access,
} from "@thewaver/ss-components-solid";
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
    const [getProgress, setProgress] = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsTurning, setIsTurning] = createSignal(!getPrefersReducedMotion());

    const getFrameClasses = createMemo(() => styles.ringFrames[access(props.orientation)]);

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
                            <div class={getFrameClasses().front}>
                                <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>
                            </div>
                        )}
                        renderSlideBack={(getSlide, getState) => (
                            <div class={getFrameClasses().back}>
                                <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>
                            </div>
                        )}
                    />
                </div>
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
