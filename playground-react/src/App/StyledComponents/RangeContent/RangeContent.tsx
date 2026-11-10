import type { CSSProperties } from "react";

import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
import { DEFAULT_RANGE_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContentReact.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

const HALF_DRAWN_THUMB = `${styles.RANGE_DRAWN_THUMB_WIDTH} * 0.5`;

export const PageRangeContent = (props: RangeContentProps) => {
    const layerClass = useLayerClass();

    const orientation = props.renderProps.orientation;

    const isPair = props.renderProps.ratios.length > 1;

    const length = props.length ?? DEFAULT_RANGE_CONTENT_LENGTH;

    const fill = props.renderProps.fill;

    const fillStart = isPair ? `calc(${center(fill.start)} - ${HALF_DRAWN_THUMB})` : "0px";

    const fillSpan = `calc(${center(fill.end)} + ${HALF_DRAWN_THUMB} - ${fillStart})`;

    return (
        <div
            className={[
                styles.rangeContent,
                styles.rangeContentVariants[orientation],
                layerClass,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                ...(orientation === "vertical" ? { height: `${length}px` } : { width: `${length}px` }),
                ...(assignInlineVars({
                    [skinVars.startValue]: `${fill.start}`,
                    [skinVars.endValue]: `${fill.end}`,
                }) as CSSProperties),
            }}
        >
            <div
                className={[
                    styles.rangeTrack,
                    styles.rangeTrackVariants[orientation],
                    props.renderProps.hasError && styles.hasError,
                ]
                    .filter(Boolean)
                    .join(" ")}
            />

            <div
                className={[
                    styles.rangeFill,
                    styles.rangeFillVariants[orientation],
                    props.renderProps.hasError && styles.hasError,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={
                    orientation === "vertical"
                        ? { bottom: fillStart, height: fillSpan }
                        : { insetInlineStart: fillStart, width: fillSpan }
                }
            />

            {props.renderProps.ratios.map((ratio, index) => (
                <div
                    key={index}
                    className={[
                        styles.rangeThumb,
                        styles.rangeThumbVariants[orientation],
                        props.renderProps.focusVisibleThumb === index && styles.isFocused,
                        props.renderProps.hasError && styles.hasError,
                        isPair && index === 0 && styles.isStart,
                        isPair && index === 1 && styles.isEnd,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={orientation === "vertical" ? { bottom: travel(ratio) } : { insetInlineStart: travel(ratio) }}
                />
            ))}
        </div>
    );
};
