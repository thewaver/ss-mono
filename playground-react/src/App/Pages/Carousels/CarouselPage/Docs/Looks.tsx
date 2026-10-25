import { useMemo, useState } from "react";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
import { toFramedPlacement } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.utils";

import {
    PageCarouselBox,
    PageCarouselSlide,
    PageCarouselSlideBack,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import { PageCarouselsBar } from "../../CarouselsBar";
import type { CarouselLooksDocsExampleProps } from "../CarouselPageReact.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselLooksDocsExampleProps;

export const LooksDocsExample = (props: Props) => {
    const [controls, setControls] = useState<CarouselControls>();

    const placement = useMemo(
        () => CarouselPlacementUtils.toPlacementRule(toFramedPlacement(props.placement, props.orientation)),
        [props.placement, props.orientation],
    );

    const frames = styles.slideFrames[PLACEMENT_FRAMES[props.placement] ?? "whole"][props.orientation];

    return (
        <div className={styles.docsCarousel}>
            <PageCarouselBox>
                <Carousel
                    placement={placement}
                    slides={SLIDES}
                    orientation={props.orientation}
                    ariaLabel={"Looks"}
                    computeSlideLabel={computePositionLabel}
                    renderSlide={(slide, state) => (
                        <div className={frames.front}>
                            <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>
                        </div>
                    )}
                    renderSlideBack={() => (
                        <div className={frames.back}>
                            <PageCarouselSlideBack />
                        </div>
                    )}
                    onMount={setControls}
                />

                {controls && <PageCarouselsBar controls={controls} hasPicks={true} />}
            </PageCarouselBox>
        </div>
    );
};
