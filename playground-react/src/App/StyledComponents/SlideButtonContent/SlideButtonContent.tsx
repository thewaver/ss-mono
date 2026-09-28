import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SlideButtonContentProps } from "./SlideButtonContent.types";

const DEFAULT_SLIDE_BUTTON_CONTENT_WIDTH = styles.SLIDE_BUTTON_WIDTH;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

const covered = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE / 2}px)`;

export const PageSlideButtonContent = (props: PropsWithChildren<SlideButtonContentProps>) => {
    const layerClass = useLayerClass();

    const width = props.width ?? DEFAULT_SLIDE_BUTTON_CONTENT_WIDTH;

    const ratio = props.renderProps.isPressed ? 1 : props.renderProps.progressRatio;

    const isTracking = props.renderProps.isDragging || props.renderProps.isHolding;

    return (
        <div
            className={[
                styles.slideButtonContent,
                layerClass,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ width: `${width}px` }}
        >
            <div
                className={[styles.slideButtonFill, isTracking && styles.isTracking].filter(Boolean).join(" ")}
                style={{ width: covered(ratio) }}
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
                style={{ left: travel(ratio) }}
            >
                <svg className={styles.slideButtonArrow} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
            </div>
        </div>
    );
};
