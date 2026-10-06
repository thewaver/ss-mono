import type { ParentProps } from "solid-js";

import type { CarouselStep } from "@thewaver/ss-components-solid";
import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../ControlButtonContent/ControlButtonContent";
import { useLayerClass } from "../Layer/Layer.context";
import type {
    CarouselPickProps,
    CarouselRotationProps,
    CarouselSlideProps,
    CarouselStepProps,
} from "./CarouselContent.types";

const STEP_GLYPHS: Record<CarouselStep, string> = {
    previous: CONTROL_GLYPHS.previous,
    next: CONTROL_GLYPHS.next,
};

export const PageCarouselSlide = (props: ParentProps<CarouselSlideProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.carouselSlide, getLayerClass()].join(" ")}>
            <div class={styles.carouselSlideTitle}>{props.children}</div>
            <div
                class={styles.carouselSlideBody}
            >{`slide ${access(props.state).index + 1} of ${access(props.state).count}`}</div>
        </div>
    );
};

export const PageCarouselSlideBack = () => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.carouselSlideBack, getLayerClass()].join(" ")} />;
};

export const PageCarouselBox = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.carouselBox, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCarouselBar = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.carouselBar, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCarouselStep = (props: CarouselStepProps) => (
    <PageControlButtonContent flags={props.renderProps} glyph={() => STEP_GLYPHS[access(props.renderProps).step]} />
);

export const PageCarouselRotation = (props: CarouselRotationProps) => (
    <PageControlButtonContent
        flags={props.flags}
        glyph={() => (access(props.flags).isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
    />
);

export const PageCarouselPick = (props: CarouselPickProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.carouselPick}
            classList={{
                [getLayerClass()]: true,
                [styles.isCurrent]: access(props.renderProps).isCurrent,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        />
    );
};
