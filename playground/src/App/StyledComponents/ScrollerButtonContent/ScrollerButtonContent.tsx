import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContent.types";

import * as styles from "./ScrollerButtonContent.css";

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
            {access(props.step) === "previous" ? "‹" : "›"}
        </div>
    );
};
