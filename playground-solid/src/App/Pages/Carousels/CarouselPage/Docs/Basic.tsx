import { Show, createSignal } from "solid-js";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselBox, PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import { PageCarouselsBar } from "../../CarouselsBar";
import type { CarouselBasicDocsExampleProps } from "../CarouselPageSolid.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CarouselControls>();

    return (
        <div class={styles.docsCarousel}>
            <PageCarouselBox>
                <Carousel
                    placement={CarouselPlacementUtils.track}
                    slides={SLIDES}
                    orientation={props.orientation}
                    transitionDurationMs={props.transitionDurationMs}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Sampler"}
                    computeSlideLabel={computePositionLabel}
                    renderSlide={(getSlide, getState) => (
                        <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>
                    )}
                    onMount={setControls}
                />

                <Show when={getControls()}>
                    {(getCarouselControls) => (
                        <PageCarouselsBar
                            controls={getCarouselControls()}
                            isDisabled={props.isDisabled}
                            hasPicks={true}
                        />
                    )}
                </Show>
            </PageCarouselBox>
        </div>
    );
};
