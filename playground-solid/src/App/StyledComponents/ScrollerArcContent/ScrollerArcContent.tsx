import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";

import type { ScrollerArcContentProps } from "./ScrollerArcContentSolid.types";

export const PageScrollerArcContent = (props: ScrollerArcContentProps) => {
    const getThumbCenter = () => ScrollerArcContentUtils.computeThumbCenter(access(props.renderProps).ratio);

    return (
        <div class={styles.scrollerArc} classList={{ [styles.isHidden]: !access(props.renderProps).isShown }}>
            <div
                ref={(element) => props.refs.setTrackRef(element)}
                class={styles.scrollerArcTrack}
                style={{ width: `${ScrollerArcContentUtils.WIDTH}px`, height: `${ScrollerArcContentUtils.HEIGHT}px` }}
            >
                <svg class={styles.scrollerArcSvg} aria-hidden="true">
                    <path class={styles.scrollerArcPath} d={ScrollerArcContentUtils.PATH} />
                </svg>

                <div
                    ref={(element) => props.refs.setThumbRef(element)}
                    class={styles.scrollerArcThumb}
                    classList={{ [styles.isDragging]: access(props.renderProps).isDragging }}
                    style={{ left: `${getThumbCenter().x}px`, top: `${getThumbCenter().y}px` }}
                />
            </div>
        </div>
    );
};
