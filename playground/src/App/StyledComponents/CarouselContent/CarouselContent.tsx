import type { ParentProps } from "solid-js";

import type { CarouselStep } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    CarouselPickProps,
    CarouselRotationProps,
    CarouselSlideProps,
    CarouselStepProps,
} from "./CarouselContent.types";

import * as styles from "./CarouselContent.css";

const STEP_GLYPHS: Record<CarouselStep, string> = {
    previous: "‹",
    next: "›",
};

const ROTATION_GLYPHS = {
    playing: "❙❙",
    stopped: "▶",
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

export const PageCarouselStep = (props: CarouselStepProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.carouselButton}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {STEP_GLYPHS[access(props.renderProps).step]}
        </div>
    );
};

export const PageCarouselRotation = (props: CarouselRotationProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.carouselButton}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.flags).isPlaying ? ROTATION_GLYPHS.playing : ROTATION_GLYPHS.stopped}
        </div>
    );
};

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
