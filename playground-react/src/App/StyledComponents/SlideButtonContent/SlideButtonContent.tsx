import type { PropsWithChildren } from "react";

import { DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SlideButtonContentProps } from "./SlideButtonContentReact.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

const covered = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE / 2}px)`;

export const PageSlideButtonContent = (props: PropsWithChildren<SlideButtonContentProps>) => {
    const layerClass = useLayerClass();

    const length = props.length ?? DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH;

    const isVertical = props.renderProps.orientation === "vertical";

    const isRightToLeft = !isVertical && props.renderProps.direction === "rtl";

    const ratio = props.renderProps.isPressed ? 1 : props.renderProps.progressRatio;

    const isTracking = props.renderProps.isDragging || props.renderProps.isHolding;

    const offset = travel(ratio);

    const thumbStyle = isVertical ? { bottom: offset } : isRightToLeft ? { right: offset } : { left: offset };

    return (
        <div
            className={[
                styles.slideButtonContent,
                layerClass,
                isVertical && styles.isVertical,
                isRightToLeft && styles.isRightToLeft,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            style={isVertical ? { height: `${length}px` } : { width: `${length}px` }}
        >
            <div
                className={[styles.slideButtonFill, isTracking && styles.isTracking].filter(Boolean).join(" ")}
                style={isVertical ? { height: covered(ratio) } : { width: covered(ratio) }}
            />

            <div className={styles.slideButtonHint} style={{ opacity: 1 - ratio }}>
                {props.children}
            </div>

            <div
                className={[
                    styles.slideButtonThumb,
                    isTracking && styles.isTracking,
                    props.renderProps.isFocusVisible && styles.isFocused,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={thumbStyle}
            >
                <svg className={styles.slideButtonArrow} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
            </div>
        </div>
    );
};
