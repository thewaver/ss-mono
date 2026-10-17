import type { PropsWithChildren } from "react";

import { FLYOUT_MENU_CHEVRON } from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlyoutMenuLinkProps, FlyoutMenuToggleProps } from "./FlyoutMenuContentReact.types";

export const PageFlyoutMenuLink = (props: PropsWithChildren<FlyoutMenuLinkProps>) => {
    const layerClass = useLayerClass();

    return (
        <span
            className={[
                styles.flyoutMenuLink,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isCurrent && styles.isCurrent,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </span>
    );
};

export const PageFlyoutMenuToggle = (props: FlyoutMenuToggleProps) => {
    const layerClass = useLayerClass();

    return (
        <span
            className={[
                styles.flyoutMenuToggle,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.flyoutMenuChevron} aria-hidden="true">
                {FLYOUT_MENU_CHEVRON}
            </span>
        </span>
    );
};

export const PageFlyoutMenuOverflowToggle = (props: PropsWithChildren<FlyoutMenuToggleProps>) => {
    const layerClass = useLayerClass();

    return (
        <span
            className={[
                styles.flyoutMenuOverflowToggle,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}

            <span className={styles.flyoutMenuChevron} aria-hidden="true">
                {FLYOUT_MENU_CHEVRON}
            </span>
        </span>
    );
};
