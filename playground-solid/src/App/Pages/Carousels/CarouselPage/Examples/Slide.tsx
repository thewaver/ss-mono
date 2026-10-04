import type { Accessor } from "solid-js";

import type { CarouselSlideState } from "@thewaver/ss-components-solid";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";

type Props = {
    title: string;
    state: Accessor<CarouselSlideState>;
    frameClass: Accessor<string>;
};

export const SlideFront = (props: Props) => (
    <div class={props.frameClass()}>
        <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
    </div>
);

export const SlideBack = (props: Omit<Props, "title" | "state">) => (
    <div class={props.frameClass()}>
        <PageCarouselSlideBack />
    </div>
);
