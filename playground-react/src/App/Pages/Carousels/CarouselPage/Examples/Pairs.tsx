import { useMemo, useState } from "react";

import { Carousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
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
    const [controls, setControls] = useState<CarouselControls>();

    const slides = useMemo(() => toPairableSlides(props.slides), [props.slides]);

    return (
        <>
            <Carousel
                placement={props.placement}
                slides={slides}
                index={props.index}
                isDisabled={props.isDisabled}
                isLooping={props.isLooping}
                orientation={props.orientation}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Pairs"}
                computeSlideLabel={computePositionLabel}
                computeGroups={computePairs}
                computeGroupLabel={computeGroupPositionLabel}
                renderSlide={(slide, state) => (
                    <SlideFront title={slide} state={state} frameClass={props.frameClasses.front} />
                )}
                renderSlideBack={() => <SlideBack frameClass={props.frameClasses.back} />}
                onMount={setControls}
            />

            {controls && <PageCarouselsBar controls={controls} isDisabled={props.isDisabled} hasPicks={true} />}
        </>
    );
};
