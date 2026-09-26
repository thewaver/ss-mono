import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { BreadcrumbContentProps } from "./BreadcrumbContent.types";

import * as styles from "./BreadcrumbContent.css";

export const PageBreadcrumbContent = (props: ParentProps<BreadcrumbContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.breadcrumbContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isCurrent]: access(props.flags).isCurrent,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageBreadcrumbSeparator = () => {
    const getLayerClass = useLayerClass();

    return <span class={[styles.breadcrumbSeparator, getLayerClass()].join(" ")}>/</span>;
};
