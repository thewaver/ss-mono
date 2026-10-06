import type { PropsWithChildren } from "react";

import type { CarouselStep } from "@thewaver/ss-components-react";
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

export const PageCarouselSlide = (props: PropsWithChildren<CarouselSlideProps>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.carouselSlide, layerClass].join(" ")}>
            <div className={styles.carouselSlideTitle}>{props.children}</div>
            <div className={styles.carouselSlideBody}>{`slide ${props.state.index + 1} of ${props.state.count}`}</div>
        </div>
    );
};

export const PageCarouselSlideBack = () => {
    const layerClass = useLayerClass();

    return <div className={[styles.carouselSlideBack, layerClass].join(" ")} />;
};

export const PageCarouselBox = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.carouselBox, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCarouselBar = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.carouselBar, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCarouselStep = (props: CarouselStepProps) => (
    <PageControlButtonContent flags={props.renderProps} glyph={STEP_GLYPHS[props.renderProps.step]} />
);

export const PageCarouselRotation = (props: CarouselRotationProps) => (
    <PageControlButtonContent
        flags={props.flags}
        glyph={props.flags.isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
    />
);

export const PageCarouselPick = (props: CarouselPickProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.carouselPick,
                layerClass,
                props.renderProps.isCurrent && styles.isCurrent,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isActive && styles.isActive,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        />
    );
};
