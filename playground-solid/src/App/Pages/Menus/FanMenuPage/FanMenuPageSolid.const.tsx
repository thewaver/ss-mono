import type { Accessor, JSX } from "solid-js";
import { Show } from "solid-js";

import type { InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import type { FanAction } from "./FanMenuPageSolid.types";

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

export const renderFanItem = (
    getItem: Accessor<MenuItem<FanAction>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <div
        class={styles.item}
        classList={{
            [styles.itemBack]: getFlags().isBack,
            [styles.itemHighlighted]: getFlags().isHighlighted,
            [styles.itemDisabled]: getFlags().isDisabled,
        }}
    >
        <Show when={getFlags().isBack}>
            <span aria-hidden={"true"}>{BACK_MARK}</span>
        </Show>

        <span>{getItem().value.name}</span>

        <Show when={!getFlags().isBack && getItem().value.shortcut}>
            {(getShortcut) => <span class={styles.shortcut}>{getShortcut()}</span>}
        </Show>

        <Show when={getFlags().hasSubmenu}>
            <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
        </Show>
    </div>
);

export const renderFanFloater = (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => (
    <div
        class={styles.itemFloater}
        classList={{ [styles.itemFloaterVisible]: getVisibilityTarget() === 1 }}
        style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
        data-floater={"highlight"}
    />
);

export const renderFanPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => (
    <div
        class={styles.layer}
        classList={{ [styles.layerVisible]: getVisibilityTarget() === 1 }}
        style={{
            transition: `opacity ${getTransitionDurationMs()}ms, transform ${getTransitionDurationMs()}ms`,
        }}
    >
        <PageLayer level={2}>{renderItems()}</PageLayer>
    </div>
);
