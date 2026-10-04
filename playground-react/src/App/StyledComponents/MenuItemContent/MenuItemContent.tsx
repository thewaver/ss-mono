import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { MenuItemContentProps } from "./MenuItemContent.types";

const SUBMENU_MARK = "›";
const CHECKED_MARK = "✓";
const PICKED_MARK = "●";

export const PageMenuItemContent = (props: PropsWithChildren<MenuItemContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.menuItemContent,
                layerClass,
                !props.isGliding && props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                !props.isGliding && props.flags.isHighlighted && styles.isHighlighted,
                props.flags.isOpen && styles.isOpen,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.kind !== undefined && props.kind !== "command" && (
                <div className={styles.menuItemMark} aria-hidden="true">
                    {props.flags.isChecked ? (props.kind === "radio" ? PICKED_MARK : CHECKED_MARK) : ""}
                </div>
            )}

            <div>{props.children}</div>

            {props.shortcut ? <div className={styles.menuItemShortcut}>{props.shortcut}</div> : null}

            {props.flags.hasSubmenu && (
                <div className={styles.menuItemSubmenuMark} aria-hidden="true">
                    {SUBMENU_MARK}
                </div>
            )}
        </div>
    );
};
