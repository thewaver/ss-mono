import type { PropsWithChildren, Ref } from "react";

import type {
    BaseCarouselPickProps,
    BaseCarouselRotationProps,
    BaseCarouselSlideProps,
    BaseCarouselStepProps,
} from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.types";

export type CarouselSlideProps = BaseCarouselSlideProps;

export type CarouselBarProps = PropsWithChildren<{ ref?: Ref<HTMLDivElement> }>;

export type CarouselStepProps = BaseCarouselStepProps;

export type CarouselPickProps = BaseCarouselPickProps;

export type CarouselRotationProps = BaseCarouselRotationProps;
