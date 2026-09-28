import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContent.types";

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
            {props.step === "previous" ? "‹" : "›"}
        </div>
    );
};
