import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseCarouselPickValues,
    BaseCarouselRotationValues,
    BaseCarouselSlideValues,
    BaseCarouselStepValues,
} from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.types";

export type CarouselSlideProps = AccessorValues<BaseCarouselSlideValues>;

export type CarouselBarProps = { ref?: (element: HTMLDivElement) => void };

export type CarouselStepProps = AccessorValues<BaseCarouselStepValues>;

export type CarouselPickProps = AccessorValues<BaseCarouselPickValues>;

export type CarouselRotationProps = AccessorValues<BaseCarouselRotationValues>;
