import { useRef } from "react";

import { Carousel, CarouselPlacementUtils, ElementObserverReactUtils } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";

const IGNORE = () => undefined;

type Props = Pick<CarouselExampleProps, "index" | "isDisabled">;

export const WordDrumExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const runwayRef = useRef<HTMLDivElement | null>(null);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef);

    return (
        <div ref={boxRef} id={"wordDrumScrollBox"} className={styles.scrollBox}>
            <div className={styles.scrollPinned}>
                <div className={styles.wordDrumSlot}>
                    <Carousel
                        computePlacement={CarouselPlacementUtils.drum}
                        slides={CarouselKnobs.WORD_DRUM_WORDS}
                        index={props.index}
                        progress={[progress, IGNORE]}
                        isLooping={false}
                        isDisabled={props.isDisabled}
                        orientation={"vertical"}
                        ariaLabel={"Words on a drum"}
                        computeSlideLabel={computePositionLabel}
                        computeStepLabel={computeCarouselStepLabel}
                        computeRotationLabel={computeCarouselRotationLabel}
                        renderSlide={(word) => <div className={styles.wordDrumWord}>{word}</div>}
                        renderSlideBack={() => null}
                    />
                </div>
            </div>

            <div ref={runwayRef} className={styles.scrollRunway} />
        </div>
    );
};
