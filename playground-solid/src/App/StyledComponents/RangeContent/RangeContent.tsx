import { For } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { DEFAULT_RANGE_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContentSolid.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

const HALF_DRAWN_THUMB = `${styles.RANGE_DRAWN_THUMB_WIDTH} * 0.5`;

export const PageRangeContent = (props: RangeContentProps) => {
    const getLayerClass = useLayerClass();

    const getOrientation = () => access(props.renderProps).orientation;

    const getIsPair = () => access(props.renderProps).ratios.length > 1;

    const getLength = () => access(props.length) ?? DEFAULT_RANGE_CONTENT_LENGTH;

    const getFillStart = () =>
        getIsPair() ? `calc(${center(access(props.renderProps).fill.start)} - ${HALF_DRAWN_THUMB})` : "0px";

    const getFillSpan = () =>
        `calc(${center(access(props.renderProps).fill.end)} + ${HALF_DRAWN_THUMB} - ${getFillStart()})`;

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
            <div
                class={styles.rangeTrack}
                classList={{
                    [styles.rangeTrackVariants[getOrientation()]]: true,
                    [styles.hasError]: access(props.renderProps).hasError,
                }}
            />

            <div
                class={styles.rangeFill}
                classList={{
                    [styles.rangeFillVariants[getOrientation()]]: true,
                    [styles.hasError]: access(props.renderProps).hasError,
                }}
                style={
                    getOrientation() === "vertical"
                        ? { bottom: getFillStart(), height: getFillSpan() }
                        : { "inset-inline-start": getFillStart(), "width": getFillSpan() }
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
                            [styles.isStart]: getIsPair() && getIndex() === 0,
                            [styles.isEnd]: getIsPair() && getIndex() === 1,
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
