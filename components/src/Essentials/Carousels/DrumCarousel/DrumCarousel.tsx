import { Carousel } from "../../../Primitives/Carousel/Carousel";
import type { DrumCarouselProps } from "../../../Primitives/Carousel/Carousel.types";

export const DrumCarousel = <T,>(props: DrumCarouselProps<T>) => <Carousel<T> {...props} variant={"drum"} />;
