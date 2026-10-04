import type { CarouselSlideState } from "@thewaver/ss-components-react";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";

type Props = {
    title: string;
    state: CarouselSlideState;
    frameClass: string;
};

export const SlideFront = (props: Props) => (
    <div className={props.frameClass}>
        <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
    </div>
);

export const SlideBack = (props: Omit<Props, "title" | "state">) => (
    <div className={props.frameClass}>
        <PageCarouselSlideBack />
    </div>
);
