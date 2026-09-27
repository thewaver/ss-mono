import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/EraCycleContent/EraCycleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { EraCycleContentProps } from "./EraCycleContent.types";

export const PageEraCycleContent = (props: PropsWithChildren<EraCycleContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.eraCycle,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};
