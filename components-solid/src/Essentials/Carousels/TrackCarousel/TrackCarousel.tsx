import { Carousel } from "../../../Primitives/Carousel/Carousel";
import type { TrackCarouselProps } from "../../../Primitives/Carousel/CarouselSolid.types";

export const TrackCarousel = <T,>(props: TrackCarouselProps<T>) => <Carousel<T> {...props} variant={"track"} />;
