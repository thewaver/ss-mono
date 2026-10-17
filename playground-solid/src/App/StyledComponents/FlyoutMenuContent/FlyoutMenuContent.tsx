import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { FLYOUT_MENU_CHEVRON } from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlyoutMenuLinkProps, FlyoutMenuToggleProps } from "./FlyoutMenuContentSolid.types";

export const PageFlyoutMenuLink = (props: ParentProps<FlyoutMenuLinkProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <span
            class={styles.flyoutMenuLink}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isCurrent]: access(props.flags).isCurrent,
            }}
        >
            {props.children}
        </span>
    );
};

export const PageFlyoutMenuToggle = (props: FlyoutMenuToggleProps) => {
    const getLayerClass = useLayerClass();

    return (
        <span
            class={styles.flyoutMenuToggle}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
            }}
        >
            <span class={styles.flyoutMenuChevron} aria-hidden="true">
                {FLYOUT_MENU_CHEVRON}
            </span>
        </span>
    );
};

export const PageFlyoutMenuOverflowToggle = (props: ParentProps<FlyoutMenuToggleProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <span
            class={styles.flyoutMenuOverflowToggle}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
            }}
        >
            {props.children}

            <span class={styles.flyoutMenuChevron} aria-hidden="true">
                {FLYOUT_MENU_CHEVRON}
            </span>
        </span>
    );
};
