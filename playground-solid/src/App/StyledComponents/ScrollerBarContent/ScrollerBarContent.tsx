import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.css";

import type { ScrollerBarContentProps } from "./ScrollerBarContentSolid.types";

export const PageScrollerBarContent = (props: ScrollerBarContentProps) => {
    const getAxis = () => access(props.renderProps).axis;

    const getTrackLength = () => access(props.trackLength);

    return (
        <div
            class={[styles.scrollerBar, styles.scrollerBarVariants[getAxis()]].join(" ")}
            classList={{ [styles.isHidden]: !access(props.renderProps).isShown }}
        >
            <div
                ref={(element) => props.refs.setTrackRef(element)}
                class={[styles.scrollerBarTrack, styles.scrollerBarTrackVariants[getAxis()]].join(" ")}
                style={{ flex: getTrackLength() === undefined ? undefined : `0 0 ${getTrackLength()}px` }}
            >
                <div
                    ref={(element) => props.refs.setThumbRef(element)}
                    class={[styles.scrollerBarThumb, styles.scrollerBarThumbVariants[getAxis()]].join(" ")}
                    classList={{ [styles.isDragging]: access(props.renderProps).isDragging }}
                    style={
                        getAxis() === "x"
                            ? {
                                  "inset-inline-start": `${access(props.renderProps).thumbOffset}px`,
                                  "width": `${access(props.renderProps).thumbLength}px`,
                              }
                            : {
                                  top: `${access(props.renderProps).thumbOffset}px`,
                                  height: `${access(props.renderProps).thumbLength}px`,
                              }
                    }
                />
            </div>
        </div>
    );
};
