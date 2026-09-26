import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PropHintBadgeProps } from "./PropHintBadge.types";

import * as styles from "./PropHintBadge.css";

const BADGE_GLYPH = "?";

export const PagePropHintBadge = (props: PropHintBadgeProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.propHintBadge}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
            }}
        >
            {BADGE_GLYPH}
        </div>
    );
};
