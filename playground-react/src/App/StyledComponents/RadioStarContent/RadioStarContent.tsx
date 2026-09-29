import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioStarContent/RadioStarContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioStarContentProps } from "./RadioStarContent.types";

export const PageRadioStarContent = (props: RadioStarContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.starContent,
                layerClass,
                props.isFilled && styles.isFilled,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span aria-hidden="true">★</span>
        </div>
    );
};

export const PageRadioStarCell = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.starCell, layerClass].join(" ")}>{props.children}</div>;
};
