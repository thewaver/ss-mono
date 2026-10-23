import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SlideButtonContentProps } from "./SlideButtonContentSolid.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

const covered = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE / 2}px)`;

export const PageSlideButtonContent = (props: ParentProps<SlideButtonContentProps>) => {
    const getLayerClass = useLayerClass();

    const getLength = () => access(props.length) ?? DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH;

    const getIsVertical = () => access(props.renderProps).orientation === "vertical";

    const getIsRightToLeft = () => !getIsVertical() && access(props.renderProps).direction === "rtl";

    const getRatio = () => (access(props.renderProps).isPressed ? 1 : access(props.renderProps).progressRatio);

    const getIsTracking = () => access(props.renderProps).isDragging || access(props.renderProps).isHolding;

    const getThumbStyle = () => {
        const offset = travel(getRatio());

        if (getIsVertical()) return { bottom: offset };

        return getIsRightToLeft() ? { right: offset } : { left: offset };
    };

    return (
        <div
            class={styles.slideButtonContent}
            style={getIsVertical() ? { height: `${getLength()}px` } : { width: `${getLength()}px` }}
            classList={{
                [getLayerClass()]: true,
                [styles.isVertical]: getIsVertical(),
                [styles.isRightToLeft]: getIsRightToLeft(),
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.hasError]: access(props.renderProps).hasError,
            }}
        >
            <div
                class={styles.slideButtonFill}
                classList={{ [styles.isTracking]: getIsTracking() }}
                style={getIsVertical() ? { height: covered(getRatio()) } : { width: covered(getRatio()) }}
            />

            <div class={styles.slideButtonHint} style={{ opacity: 1 - getRatio() }}>
                {props.children}
            </div>

            <div
                class={styles.slideButtonThumb}
                classList={{
                    [styles.isTracking]: getIsTracking(),
                    [styles.isFocused]: access(props.renderProps).isFocusVisible,
                }}
                style={getThumbStyle()}
            >
                <svg class={styles.slideButtonArrow} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
            </div>
        </div>
    );
};
