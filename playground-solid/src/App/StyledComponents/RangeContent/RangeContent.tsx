import { For } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { DEFAULT_RANGE_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContentSolid.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

export const PageRangeContent = (props: RangeContentProps) => {
    const getLayerClass = useLayerClass();

    const getOrientation = () => access(props.renderProps).orientation;

    const getLength = () => access(props.length) ?? DEFAULT_RANGE_CONTENT_LENGTH;

    const getFillSpan = () => {
        const fill = access(props.renderProps).fill;

        return travel(fill.end - fill.start);
    };

    return (
        <div
            class={styles.rangeContent}
            style={getOrientation() === "vertical" ? { height: `${getLength()}px` } : { width: `${getLength()}px` }}
            classList={{
                [styles.rangeContentVariants[getOrientation()]]: true,
                [getLayerClass()]: true,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
        >
            <div class={[styles.rangeTrack, styles.rangeTrackVariants[getOrientation()]].join(" ")} />

            <div
                class={styles.rangeFill}
                classList={{
                    [styles.rangeFillVariants[getOrientation()]]: true,
                    [styles.hasError]: access(props.renderProps).hasError,
                }}
                style={
                    getOrientation() === "vertical"
                        ? { bottom: center(access(props.renderProps).fill.start), height: getFillSpan() }
                        : { "inset-inline-start": center(access(props.renderProps).fill.start), "width": getFillSpan() }
                }
            />

            <For each={access(props.renderProps).ratios}>
                {(ratio, getIndex) => (
                    <div
                        class={styles.rangeThumb}
                        classList={{
                            [styles.rangeThumbVariants[getOrientation()]]: true,
                            [styles.isFocused]: access(props.renderProps).focusVisibleThumb === getIndex(),
                            [styles.hasError]: access(props.renderProps).hasError,
                        }}
                        style={
                            getOrientation() === "vertical"
                                ? { bottom: travel(ratio) }
                                : { "inset-inline-start": travel(ratio) }
                        }
                    />
                )}
            </For>
        </div>
    );
};
