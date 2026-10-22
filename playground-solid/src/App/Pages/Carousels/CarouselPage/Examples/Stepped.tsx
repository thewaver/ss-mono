import { Show, createSignal } from "solid-js";

import { Carousel, access } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import { PageCarouselsBar } from "../../CarouselsBar";
import { SlideBack, SlideFront } from "./Slide";

type Props = CarouselExampleProps;

export const SteppedExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CarouselControls>();

    return (
        <>
            <Carousel
                placement={props.placement}
                slides={props.slides}
                index={props.index}
                isDisabled={props.isDisabled}
                isLooping={props.isLooping}
                orientation={props.orientation}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Sampler"}
                computeSlideLabel={computePositionLabel}
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
