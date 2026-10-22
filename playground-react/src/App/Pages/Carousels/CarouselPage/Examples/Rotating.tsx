import { useState } from "react";

import { Carousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import { PageCarouselsBar } from "../../CarouselsBar";
import { SlideBack, SlideFront } from "./Slide";

type Props = CarouselExampleProps;

export const RotatingExample = (props: Props) => {
    const [controls, setControls] = useState<CarouselControls>();

    return (
        <>
            <Carousel
                placement={props.placement}
                slides={props.slides}
                index={props.index}
                playback={props.playback}
                isDisabled={props.isDisabled}
                isLooping={props.isLooping}
                orientation={props.orientation}
                transitionDurationMs={props.transitionDurationMs}
                autoplayDelayMs={props.autoplayDelayMs}
                ariaLabel={"Rotating sampler"}
                computeSlideLabel={computePositionLabel}
                renderSlide={(slide, state) => (
                    <SlideFront title={slide} state={state} frameClass={props.frameClasses.front} />
                )}
                renderSlideBack={() => <SlideBack frameClass={props.frameClasses.back} />}
                onMount={setControls}
            />

            {controls && (
                <PageCarouselsBar
                    controls={controls}
                    isDisabled={props.isDisabled}
                    hasPicks={true}
                    hasRotation={true}
                />
            )}
        </>
    );
};
