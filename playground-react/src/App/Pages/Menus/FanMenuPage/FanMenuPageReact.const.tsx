import type { ReactNode } from "react";

import type { InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import type { FanAction } from "./FanMenuPageReact.types";

export {
    FAN_LAYOUT_DEFS,
    FAN_LAYOUT_SIZE,
} from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

const BACK_MARK = "‹";
const SUBMENU_MARK = "›";

export const ACTIONS: MenuItem<FanAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const NESTED_ACTIONS: MenuItem<FanAction>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Dashboard" } }, { value: { name: "Report" } }],
            },
            { value: { name: "Import" } },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    {
        value: { name: "Share" },
        items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const renderFanItem = (item: MenuItem<FanAction>, flags: InteractionFlags<MenuItemFlags>) => {
    const shortcut = !flags.isBack && item.value.shortcut;

    return (
        <div
            className={[
                styles.item,
                flags.isBack && styles.itemBack,
                flags.isHighlighted && styles.itemHighlighted,
                flags.isDisabled && styles.itemDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {flags.isBack && <span aria-hidden={"true"}>{BACK_MARK}</span>}

            <span>{item.value.name}</span>

            {shortcut && <span className={styles.shortcut}>{shortcut}</span>}

            {flags.hasSubmenu && <span aria-hidden={"true"}>{SUBMENU_MARK}</span>}
        </div>
    );
};

export const renderFanFloater = (visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <div
        className={[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible].filter(Boolean).join(" ")}
        style={{ transitionDuration: `${transitionDurationMs}ms` }}
        data-floater={"highlight"}
    />
);

export const renderFanPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <div
        className={[styles.layer, visibilityTarget === 1 && styles.layerVisible].filter(Boolean).join(" ")}
        style={{
            transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`,
        }}
    >
        <PageLayer level={2}>{renderItems()}</PageLayer>
    </div>
);
