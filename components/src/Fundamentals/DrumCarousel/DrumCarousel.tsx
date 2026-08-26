import { Carousel } from "../Carousel/Carousel";
import type { DrumCarouselProps } from "../Carousel/Carousel.types";

export const DrumCarousel = <T,>(props: DrumCarouselProps<T>) => <Carousel<T> {...props} variant={"drum"} />;
