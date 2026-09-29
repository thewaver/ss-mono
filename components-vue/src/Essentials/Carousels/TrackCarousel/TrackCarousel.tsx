import { type SlotsType, defineComponent } from "vue";

import { Carousel } from "../../../Primitives/Carousel/Carousel";
import type { CarouselSlots, TrackCarouselProps } from "../../../Primitives/Carousel/Carousel.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";

export const TrackCarousel = defineComponent(
    <T,>(props: TrackCarouselProps<T>, { slots }: SlotsContext<CarouselSlots<T>>) => {
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
                variant="track"
            >
                {
                    {
                        renderSlide: slots.renderSlide,
                        renderStep: slots.renderStep,
                        renderPick: slots.renderPick,
                        renderRotationControl: slots.renderRotationControl,
                        renderControls: slots.renderControls,
                    } satisfies Partial<CarouselSlots<T>>
                }
            </Carousel>
        );
    },
    {
        name: "TrackCarousel",
        slots: Object as SlotsType<CarouselSlots<any>>,
        props: declareProps<TrackCarouselProps<unknown>>({
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
            "orientation": null,
        }),
    },
);
