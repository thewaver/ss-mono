import { Carousel } from "../Carousel/Carousel";
import type { TrackCarouselProps } from "../Carousel/Carousel.types";

export const TrackCarousel = <T,>(props: TrackCarouselProps<T>) => <Carousel<T> {...props} variant={"track"} />;
