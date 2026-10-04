import { createSignal } from "solid-js";

import { Carousel, ElementObserverSolidUtils, access } from "@thewaver/ss-components-solid";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

type Props = Omit<CarouselExampleProps, "isLooping">;

export const ScrolledExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRunwayRef, getBoxRef);

    return (
        <div ref={setBoxRef} id={"carouselScrollBox"} class={styles.scrollBox}>
            <div class={styles.scrollPinned}>
                <Carousel
                    computePlacement={props.computePlacement}
                    slides={props.slides}
                    index={props.index}
                    progress={[getProgress, () => undefined]}
                    isLooping={false}
                    isDisabled={props.isDisabled}
                    orientation={props.orientation}
                    ariaLabel={"Scrolled sampler"}
                    computeSlideLabel={computePositionLabel}
                    computeStepLabel={computeCarouselStepLabel}
                    computeRotationLabel={computeCarouselRotationLabel}
                    renderSlide={(getSlide, getState) => (
                        <SlideFront title={getSlide()} state={getState} isNarrow={() => access(props.isNarrow)} />
                    )}
                    renderSlideBack={() => <SlideBack isNarrow={() => access(props.isNarrow)} />}
                />
            </div>

            <div ref={setRunwayRef} class={styles.scrollRunway} />
        </div>
    );
};
