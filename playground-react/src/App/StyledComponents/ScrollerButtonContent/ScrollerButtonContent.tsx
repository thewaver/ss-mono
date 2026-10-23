import {
    SCROLLER_GLYPH_POINTS,
    SCROLLER_GLYPH_VIEW_BOX,
} from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContentReact.types";

export const PageScrollerButtonContent = (props: ScrollerButtonContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.scrollerButton,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            <svg
                className={[
                    styles.scrollerButtonGlyph,
                    styles.scrollerButtonGlyphVariants[props.axis ?? "x"][props.step],
                ].join(" ")}
                viewBox={SCROLLER_GLYPH_VIEW_BOX}
            >
                <polyline points={SCROLLER_GLYPH_POINTS} />
            </svg>
        </div>
    );
};
