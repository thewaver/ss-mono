import { type ComponentProps, useEffect, useState } from "react";

import { Carousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import { PageCarouselsBar } from "../../CarouselsBar";
import { SlideBack, SlideFront } from "./Slide";

const BUILT = 1;

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

type Props = Omit<CarouselExampleProps, "slides"> & {
    onBuiltChange: (change: number) => void;
};

const CountedSlideFront = (props: ComponentProps<typeof SlideFront> & { onBuiltChange: (change: number) => void }) => {
    const { onBuiltChange, ...slideProps } = props;

    useEffect(() => {
        onBuiltChange(BUILT);

        return () => onBuiltChange(-BUILT);
    }, []);

    return <SlideFront {...slideProps} />;
};

export const WindowedExample = (props: Props) => {
    const [controls, setControls] = useState<CarouselControls>();

    return (
        <>
            <Carousel
                placement={props.placement}
                slides={SLIDES}
                index={props.index}
                isDisabled={props.isDisabled}
                isLooping={props.isLooping}
                isWindowed={true}
                orientation={props.orientation}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"A hundred slides"}
                computeSlideLabel={computePositionLabel}
                renderSlide={(slide, state) => (
                    <CountedSlideFront
                        title={slide}
                        state={state}
                        frameClass={props.frameClasses.front}
                        onBuiltChange={props.onBuiltChange}
                    />
                )}
                renderSlideBack={() => <SlideBack frameClass={props.frameClasses.back} />}
                onMount={setControls}
            />

            {controls && <PageCarouselsBar controls={controls} isDisabled={props.isDisabled} />}
        </>
    );
};
