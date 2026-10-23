import { useCallback } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";

import type { ScrollerArcContentProps } from "./ScrollerArcContentReact.types";

export const PageScrollerArcContent = (props: ScrollerArcContentProps) => {
    const refs = props.refs;
    const thumbCenter = ScrollerArcContentUtils.computeThumbCenter(props.renderProps.ratio);

    const setTrackRef = useCallback((element: HTMLDivElement | null) => refs.setTrackRef(element ?? undefined), [refs]);

    const setThumbRef = useCallback((element: HTMLDivElement | null) => refs.setThumbRef(element ?? undefined), [refs]);

    return (
        <div className={[styles.scrollerArc, !props.renderProps.isShown && styles.isHidden].filter(Boolean).join(" ")}>
            <div
                ref={setTrackRef}
                className={styles.scrollerArcTrack}
                style={{ width: `${ScrollerArcContentUtils.WIDTH}px`, height: `${ScrollerArcContentUtils.HEIGHT}px` }}
            >
                <svg className={styles.scrollerArcSvg} aria-hidden="true">
                    <path className={styles.scrollerArcPath} d={ScrollerArcContentUtils.PATH} />
                </svg>

                <div
                    ref={setThumbRef}
                    className={[styles.scrollerArcThumb, props.renderProps.isDragging && styles.isDragging]
                        .filter(Boolean)
                        .join(" ")}
                    style={{ left: `${thumbCenter.x}px`, top: `${thumbCenter.y}px` }}
                />
            </div>
        </div>
    );
};
