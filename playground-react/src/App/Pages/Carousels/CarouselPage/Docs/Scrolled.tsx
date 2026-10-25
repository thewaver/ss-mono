import { useRef } from "react";

import { Carousel, CarouselPlacementUtils, ElementObserverReactUtils } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

export const ScrolledDocsExample = () => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const runwayRef = useRef<HTMLDivElement | null>(null);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef);

    return (
        <div className={styles.docsCarousel}>
            <div ref={boxRef} className={styles.scrollBox}>
                <div className={styles.scrollPinned}>
                    <Carousel
                        placement={CarouselPlacementUtils.track}
                        slides={SLIDES}
                        progress={[progress, () => undefined]}
                        isLooping={false}
                        ariaLabel={"Scrolled"}
                        computeSlideLabel={computePositionLabel}
                        renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
                    />
                </div>

                <div ref={runwayRef} className={styles.scrollRunway} />
            </div>
        </div>
    );
};
