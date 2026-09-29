import { type SlotsType, defineComponent } from "vue";

import { Carousel } from "../../../Primitives/Carousel/Carousel";
import type { DrumCarouselProps, DrumCarouselSlots } from "../../../Primitives/Carousel/Carousel.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";

export const DrumCarousel = defineComponent(
    <T,>(props: DrumCarouselProps<T>, { slots }: SlotsContext<DrumCarouselSlots<T>>) => {
        const index = useTwoWay(props, "index", 0);
        const playback = useTwoWay(props, "playback", true);

        return () => (
            <Carousel
                {...{
                    ...forwardProps(props, Carousel),
                    "index": index.value,
                    "onUpdate:index": (value: number) => {
                        index.value = value;
                    },
                    "playback": playback.value,
                    "onUpdate:playback": (isPlaying: boolean) => {
                        playback.value = isPlaying;
                    },
                }}
                variant="drum"
            >
                {
                    {
                        renderSlide: slots.renderSlide,
                        renderSlideBack: slots.renderSlideBack,
                        renderStep: slots.renderStep,
                        renderPick: slots.renderPick,
                        renderRotationControl: slots.renderRotationControl,
                        renderControls: slots.renderControls,
                    } satisfies Partial<DrumCarouselSlots<T>>
                }
            </Carousel>
        );
    },
    {
        name: "DrumCarousel",
        slots: Object as SlotsType<DrumCarouselSlots<any>>,
        props: declareProps<DrumCarouselProps<unknown>>({
            "autoplayDelayMs": null,
            "transitionDurationMs": null,
            "gap": null,
            "isDisabled": Boolean,
            "isLooping": Boolean,
            "ariaLabel": null,
            "computeSlideLabel": null,
            "computeStepLabel": null,
            "computeRotationLabel": null,
            "roleDescription": null,
            "slideRoleDescription": null,
            "slides": null,
            "index": null,
            "onUpdate:index": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onIndexChange": null,
            "axis": null,
            "slideSize": null,
        }),
    },
);
