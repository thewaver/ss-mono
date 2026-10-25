import { useState } from "react";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import {
    computeGroupPositionLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { PAIRED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { computePairs } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselBox, PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import { PageCarouselsBar } from "../../CarouselsBar";

const SLIDES = TITLES.slice(0, PAIRED_SLIDE_COUNT);

export const PairsDocsExample = () => {
    const [controls, setControls] = useState<CarouselControls>();

    return (
        <div className={styles.docsCarousel}>
            <PageCarouselBox>
                <Carousel
                    placement={CarouselPlacementUtils.track}
                    slides={SLIDES}
                    ariaLabel={"Pairs"}
                    computeSlideLabel={computePositionLabel}
                    computeGroups={computePairs}
                    computeGroupLabel={computeGroupPositionLabel}
                    renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
                    onMount={setControls}
                />

                {controls && <PageCarouselsBar controls={controls} hasPicks={true} />}
            </PageCarouselBox>
        </div>
    );
};
