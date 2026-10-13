import { access } from "@thewaver/ss-components-solid";
import { BADGE_GLYPH } from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PropHintBadgeProps } from "./PropHintBadgeSolid.types";

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
