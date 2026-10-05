import { createSignal } from "solid-js";

import { Carousel, CarouselPlacementUtils, ElementObserverSolidUtils } from "@thewaver/ss-components-solid";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";

const computeWordDrumPlacement = CarouselPlacementUtils.createDrum({
    faceCount: CarouselKnobs.WORD_DRUM_FACE_COUNT,
    faceRatio: CarouselKnobs.WORD_DRUM_FACE_RATIO,
    perspectivePx: CarouselKnobs.WORD_DRUM_PERSPECTIVE_PX,
});

type Props = Pick<CarouselExampleProps, "index" | "isDisabled">;

export const WordDrumExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRunwayRef, getBoxRef);

    return (
        <div ref={setBoxRef} id={"wordDrumScrollBox"} class={styles.scrollBox}>
            <div class={styles.scrollPinned}>
                <div class={styles.wordDrumSlot}>
                    <Carousel
                        computePlacement={computeWordDrumPlacement}
                        slides={CarouselKnobs.WORD_DRUM_WORDS}
                        index={props.index}
                        progress={[getProgress, () => undefined]}
                        isLooping={false}
                        isDisabled={props.isDisabled}
                        orientation={"vertical"}
                        ariaLabel={"Words on a drum"}
                        computeSlideLabel={computePositionLabel}
                        computeStepLabel={computeCarouselStepLabel}
                        computeRotationLabel={computeCarouselRotationLabel}
                        renderSlide={(getWord) => <div class={styles.wordDrumWord}>{getWord()}</div>}
                        renderSlideBack={() => null}
                    />
                </div>
            </div>

            <div ref={setRunwayRef} class={styles.scrollRunway} />
        </div>
    );
};
