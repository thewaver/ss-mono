import { useCallback } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.css";

import type { ScrollerBarContentProps } from "./ScrollerBarContentReact.types";

export const PageScrollerBarContent = (props: ScrollerBarContentProps) => {
    const axis = props.renderProps.axis;
    const refs = props.refs;

    const setTrackRef = useCallback((element: HTMLDivElement | null) => refs.setTrackRef(element ?? undefined), [refs]);

    const setThumbRef = useCallback((element: HTMLDivElement | null) => refs.setThumbRef(element ?? undefined), [refs]);

    return (
        <div
            className={[
                styles.scrollerBar,
                styles.scrollerBarVariants[axis],
                !props.renderProps.isShown && styles.isHidden,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div
                ref={setTrackRef}
                className={[styles.scrollerBarTrack, styles.scrollerBarTrackVariants[axis]].join(" ")}
                style={{ flex: props.trackLength === undefined ? undefined : `0 0 ${props.trackLength}px` }}
            >
                <div
                    ref={setThumbRef}
                    className={[
                        styles.scrollerBarThumb,
                        styles.scrollerBarThumbVariants[axis],
                        props.renderProps.isDragging && styles.isDragging,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={
                        axis === "x"
                            ? {
                                  insetInlineStart: `${props.renderProps.thumbOffset}px`,
                                  width: `${props.renderProps.thumbLength}px`,
                              }
                            : {
                                  top: `${props.renderProps.thumbOffset}px`,
                                  height: `${props.renderProps.thumbLength}px`,
                              }
                    }
                />
            </div>
        </div>
    );
};
