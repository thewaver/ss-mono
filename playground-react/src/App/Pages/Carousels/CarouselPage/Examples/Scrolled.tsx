import { useRef } from "react";

import { Carousel, ElementObserverReactUtils } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

const IGNORE = () => undefined;

type Props = Omit<CarouselExampleProps, "isLooping">;

export const ScrolledExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const runwayRef = useRef<HTMLDivElement | null>(null);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef);

    return (
        <div ref={boxRef} id={"carouselScrollBox"} className={styles.scrollBox}>
            <div className={styles.scrollPinned}>
                <Carousel
                    computePlacement={props.computePlacement}
                    slides={props.slides}
                    index={props.index}
                    progress={[progress, IGNORE]}
                    isLooping={false}
                    isDisabled={props.isDisabled}
                    orientation={props.orientation}
                    ariaLabel={"Scrolled sampler"}
                    computeSlideLabel={computePositionLabel}
                    computeStepLabel={computeCarouselStepLabel}
                    computeRotationLabel={computeCarouselRotationLabel}
                    renderSlide={(slide, state) => (
                        <SlideFront title={slide} state={state} frameClass={props.frameClasses.front} />
                    )}
                    renderSlideBack={() => <SlideBack frameClass={props.frameClasses.back} />}
                />
            </div>

            <div ref={runwayRef} className={styles.scrollRunway} />
        </div>
    );
};
