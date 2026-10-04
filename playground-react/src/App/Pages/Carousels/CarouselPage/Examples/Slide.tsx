import type { CarouselSlideState } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";

type Props = {
    title: string;
    state: CarouselSlideState;
    isNarrow: boolean;
};

const getFrameClass = (isNarrow: boolean) =>
    [styles.slideFrame, isNarrow && styles.slideFrameNarrow].filter(Boolean).join(" ");

export const SlideFront = (props: Props) => (
    <div className={getFrameClass(props.isNarrow)}>
        <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
    </div>
);

export const SlideBack = (props: Omit<Props, "title" | "state">) => (
    <div className={getFrameClass(props.isNarrow)}>
        <PageCarouselSlideBack />
    </div>
);
