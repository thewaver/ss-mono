import { access } from "@thewaver/ss-components-solid";
import {
    SCROLLER_GLYPH_POINTS,
    SCROLLER_GLYPH_VIEW_BOX,
} from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContentSolid.types";

export const PageScrollerButtonContent = (props: ScrollerButtonContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.scrollerButton}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            <svg
                class={[
                    styles.scrollerButtonGlyph,
                    styles.scrollerButtonGlyphVariants[access(props.axis) ?? "x"][access(props.step)],
                ].join(" ")}
                viewBox={SCROLLER_GLYPH_VIEW_BOX}
            >
                <polyline points={SCROLLER_GLYPH_POINTS} />
            </svg>
        </div>
    );
};
