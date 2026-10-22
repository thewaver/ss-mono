import type { PropsWithChildren } from "react";

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
} from "./CarouselContentReact.types";

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

export const PageCarouselBar = (props: CarouselBarProps) => {
    const layerClass = useLayerClass();

    return (
        <div ref={props.ref} className={[styles.carouselBar, layerClass].join(" ")}>
            {props.children}
        </div>
    );
};

export const PageCarouselStep = (props: CarouselStepProps) => (
    <PageControlButtonContent flags={props.flags} glyph={STEP_GLYPHS[props.step]} />
);

export const PageCarouselRotation = (props: CarouselRotationProps) => (
    <PageControlButtonContent
        flags={props.flags}
        glyph={props.isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
    />
);

export const PageCarouselPick = (props: CarouselPickProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.carouselPick,
                layerClass,
                props.isCurrent && styles.isCurrent,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        />
    );
};
