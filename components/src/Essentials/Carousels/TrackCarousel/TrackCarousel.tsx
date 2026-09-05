import { Carousel } from "../../../Primitives/Carousel/Carousel";
import type { TrackCarouselProps } from "../../../Primitives/Carousel/Carousel.types";

export const TrackCarousel = <T,>(props: TrackCarouselProps<T>) => <Carousel<T> {...props} variant={"track"} />;
