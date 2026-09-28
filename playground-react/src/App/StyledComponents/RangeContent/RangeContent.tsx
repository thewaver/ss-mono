import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContent.types";

const DEFAULT_RANGE_CONTENT_LENGTH = styles.RANGE_LENGTH;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE / 2}px)`;

export const PageRangeContent = (props: RangeContentProps) => {
    const layerClass = useLayerClass();

    const orientation = props.renderProps.orientation;

    const length = props.length ?? DEFAULT_RANGE_CONTENT_LENGTH;

    const fill = props.renderProps.fill;

    const fillSpan = travel(fill.end - fill.start);

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
            style={orientation === "vertical" ? { height: `${length}px` } : { width: `${length}px` }}
        >
            <div className={[styles.rangeTrack, styles.rangeTrackVariants[orientation]].join(" ")} />

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
                        ? { bottom: center(fill.start), height: fillSpan }
                        : { left: center(fill.start), width: fillSpan }
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
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={orientation === "vertical" ? { bottom: travel(ratio) } : { left: travel(ratio) }}
                />
            ))}
        </div>
    );
};
