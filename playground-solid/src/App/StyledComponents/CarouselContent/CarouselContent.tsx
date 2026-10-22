import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { STEP_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../ControlButtonContent/ControlButtonContent";
import { useLayerClass } from "../Layer/Layer.context";
import type {
    CarouselBarProps,
    CarouselPickProps,
    CarouselRotationProps,
    CarouselSlideProps,
    CarouselStepProps,
} from "./CarouselContentSolid.types";

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

export const PageCarouselBar = (props: ParentProps<CarouselBarProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div ref={props.ref} class={[styles.carouselBar, getLayerClass()].join(" ")}>
            {props.children}
        </div>
    );
};

export const PageCarouselStep = (props: CarouselStepProps) => (
    <PageControlButtonContent flags={props.flags} glyph={() => STEP_GLYPHS[access(props.step)]} />
);

export const PageCarouselRotation = (props: CarouselRotationProps) => (
    <PageControlButtonContent
        flags={props.flags}
        glyph={() => (access(props.isPlaying) ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
    />
);

export const PageCarouselPick = (props: CarouselPickProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.carouselPick}
            classList={{
                [getLayerClass()]: true,
                [styles.isCurrent]: access(props.isCurrent),
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        />
    );
};
