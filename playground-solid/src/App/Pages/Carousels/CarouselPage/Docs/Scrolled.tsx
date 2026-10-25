import { createSignal } from "solid-js";

import { Carousel, CarouselPlacementUtils, ElementObserverSolidUtils } from "@thewaver/ss-components-solid";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

export const ScrolledDocsExample = () => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRunwayRef, getBoxRef);

    return (
        <div class={styles.docsCarousel}>
            <div ref={setBoxRef} class={styles.scrollBox}>
                <div class={styles.scrollPinned}>
                    <Carousel
                        placement={CarouselPlacementUtils.track}
                        slides={SLIDES}
                        progress={[getProgress, () => undefined]}
                        isLooping={false}
                        ariaLabel={"Scrolled"}
                        computeSlideLabel={computePositionLabel}
                        renderSlide={(getSlide, getState) => (
                            <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>
                        )}
                    />
                </div>

                <div ref={setRunwayRef} class={styles.scrollRunway} />
            </div>
        </div>
    );
};
