import { type PropsWithChildren, useCallback, useEffect, useState } from "react";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-react";
import type { CarouselControls, CarouselSlideState } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselBox, PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import { PageCarouselsBar } from "../../CarouselsBar";

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

type CountedSlideProps = PropsWithChildren<{
    state: CarouselSlideState;
    onBuiltChange: (change: number) => void;
}>;

const CountedSlide = (props: CountedSlideProps) => {
    const { onBuiltChange } = props;

    useEffect(() => {
        onBuiltChange(1);

        return () => onBuiltChange(-1);
    }, [onBuiltChange]);

    return <PageCarouselSlide state={props.state}>{props.children}</PageCarouselSlide>;
};

export const WindowedDocsExample = () => {
    const [controls, setControls] = useState<CarouselControls>();
    const [builtCount, setBuiltCount] = useState(0);

    const handleBuiltChange = useCallback((change: number) => setBuiltCount((count) => count + change), []);

    return (
        <>
            <div className={styles.docsCarousel}>
                <PageCarouselBox>
                    <Carousel
                        placement={CarouselPlacementUtils.track}
                        slides={SLIDES}
                        isWindowed={true}
                        ariaLabel={"A hundred slides"}
                        computeSlideLabel={computePositionLabel}
                        renderSlide={(slide, state) => (
                            <CountedSlide state={state} onBuiltChange={handleBuiltChange}>
                                {slide}
                            </CountedSlide>
                        )}
                        onMount={setControls}
                    />

                    {controls && <PageCarouselsBar controls={controls} />}
                </PageCarouselBox>
            </div>

            <div
                className={exampleStyles.exampleReadout}
                data-readout
            >{`Built: ${builtCount} of ${WINDOWED_SLIDE_COUNT}`}</div>
        </>
    );
};
