import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PropHintBadgeProps } from "./PropHintBadge.types";

const BADGE_GLYPH = "?";

export const PagePropHintBadge = (props: PropHintBadgeProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.propHintBadge,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {BADGE_GLYPH}
        </div>
    );
};
