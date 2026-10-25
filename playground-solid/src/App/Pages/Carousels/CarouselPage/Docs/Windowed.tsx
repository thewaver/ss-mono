import { Show, createSignal, onCleanup } from "solid-js";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
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

export const WindowedDocsExample = () => {
    const [getControls, setControls] = createSignal<CarouselControls>();
    const [getBuiltCount, setBuiltCount] = createSignal(0);

    return (
        <>
            <div class={styles.docsCarousel}>
                <PageCarouselBox>
                    <Carousel
                        placement={CarouselPlacementUtils.track}
                        slides={SLIDES}
                        isWindowed={true}
                        ariaLabel={"A hundred slides"}
                        computeSlideLabel={computePositionLabel}
                        renderSlide={(getSlide, getState) => {
                            setBuiltCount((count) => count + 1);

                            onCleanup(() => setBuiltCount((count) => count - 1));

                            return <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>;
                        }}
                        onMount={setControls}
                    />

                    <Show when={getControls()}>
                        {(getCarouselControls) => <PageCarouselsBar controls={getCarouselControls()} />}
                    </Show>
                </PageCarouselBox>
            </div>

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Built: ${getBuiltCount()} of ${WINDOWED_SLIDE_COUNT}`}</div>
        </>
    );
};
