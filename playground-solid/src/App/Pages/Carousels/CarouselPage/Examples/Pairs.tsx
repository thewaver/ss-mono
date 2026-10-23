import { Show, createMemo, createSignal } from "solid-js";

import { Carousel, access } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
import {
    computeGroupPositionLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    computePairs,
    toPairableSlides,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";

import type { CarouselExampleProps } from "../../Carousels.types";
import { PageCarouselsBar } from "../../CarouselsBar";
import { SlideBack, SlideFront } from "./Slide";

type Props = CarouselExampleProps;

export const PairsExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CarouselControls>();

    const getSlides = createMemo(() => toPairableSlides(access(props.slides)));

    return (
        <>
            <Carousel
                placement={props.placement}
                slides={getSlides}
                index={props.index}
                isDisabled={props.isDisabled}
                isLooping={props.isLooping}
                orientation={props.orientation}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Pairs"}
                computeSlideLabel={computePositionLabel}
                computeGroups={computePairs}
                computeGroupLabel={computeGroupPositionLabel}
                renderSlide={(getSlide, getState) => (
                    <SlideFront
                        title={getSlide()}
                        state={getState}
                        frameClass={() => access(props.frameClasses).front}
                    />
                )}
                renderSlideBack={() => <SlideBack frameClass={() => access(props.frameClasses).back} />}
                onMount={setControls}
            />

            <Show when={getControls()}>
                {(getCarouselControls) => (
                    <PageCarouselsBar controls={getCarouselControls()} isDisabled={props.isDisabled} hasPicks={true} />
                )}
            </Show>
        </>
    );
};
