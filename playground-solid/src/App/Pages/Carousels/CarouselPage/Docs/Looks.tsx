import { Show, createMemo, createSignal } from "solid-js";

import { Carousel, CarouselPlacementUtils, access } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
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
import type { CarouselLooksDocsExampleProps } from "../CarouselPageSolid.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselLooksDocsExampleProps;

export const LooksDocsExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CarouselControls>();

    const getPlacement = createMemo(() =>
        CarouselPlacementUtils.toPlacementRule(toFramedPlacement(access(props.placement), access(props.orientation))),
    );

    const getFrames = () =>
        styles.slideFrames[PLACEMENT_FRAMES[access(props.placement)] ?? "whole"][access(props.orientation)];

    return (
        <div class={styles.docsCarousel}>
            <PageCarouselBox>
                <Carousel
                    placement={getPlacement()}
                    slides={SLIDES}
                    orientation={props.orientation}
                    ariaLabel={"Looks"}
                    computeSlideLabel={computePositionLabel}
                    renderSlide={(getSlide, getState) => (
                        <div class={getFrames().front}>
                            <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>
                        </div>
                    )}
                    renderSlideBack={() => (
                        <div class={getFrames().back}>
                            <PageCarouselSlideBack />
                        </div>
                    )}
                    onMount={setControls}
                />

                <Show when={getControls()}>
                    {(getCarouselControls) => <PageCarouselsBar controls={getCarouselControls()} hasPicks={true} />}
                </Show>
            </PageCarouselBox>
        </div>
    );
};
