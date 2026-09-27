import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { BreadcrumbContentProps } from "./BreadcrumbContent.types";

export const PageBreadcrumbContent = (props: PropsWithChildren<BreadcrumbContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.breadcrumbContent,
                layerClass,
                props.flags.isCurrent && styles.isCurrent,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageBreadcrumbSeparator = () => {
    const layerClass = useLayerClass();

    return <span className={[styles.breadcrumbSeparator, layerClass].join(" ")}>/</span>;
};
