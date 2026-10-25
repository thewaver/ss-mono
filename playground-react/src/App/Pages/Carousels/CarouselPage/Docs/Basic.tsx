import { useState } from "react";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselBox, PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import { PageCarouselsBar } from "../../CarouselsBar";
import type { CarouselBasicDocsExampleProps } from "../CarouselPageReact.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [controls, setControls] = useState<CarouselControls>();

    return (
        <div className={styles.docsCarousel}>
            <PageCarouselBox>
                <Carousel
                    placement={CarouselPlacementUtils.track}
                    slides={SLIDES}
                    orientation={props.orientation}
                    transitionDurationMs={props.transitionDurationMs}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Sampler"}
                    computeSlideLabel={computePositionLabel}
                    renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
                    onMount={setControls}
                />

                {controls && <PageCarouselsBar controls={controls} isDisabled={props.isDisabled} hasPicks={true} />}
            </PageCarouselBox>
        </div>
    );
};
