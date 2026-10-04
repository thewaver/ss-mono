import type { Accessor } from "solid-js";

import type { CarouselSlideState } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";

type Props = {
    title: string;
    state: Accessor<CarouselSlideState>;
    isNarrow: Accessor<boolean>;
};

export const SlideFront = (props: Props) => (
    <div class={styles.slideFrame} classList={{ [styles.slideFrameNarrow]: props.isNarrow() }}>
        <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
    </div>
);

export const SlideBack = (props: Omit<Props, "title" | "state">) => (
    <div class={styles.slideFrame} classList={{ [styles.slideFrameNarrow]: props.isNarrow() }}>
        <PageCarouselSlideBack />
    </div>
);
