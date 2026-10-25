import type { MenuItem } from "@thewaver/ss-components-vue";

import type { FanAction } from "./FanMenuPageVue.types";

export {
    FAN_LAYOUT_DEFS,
    FAN_LAYOUT_SIZE,
} from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

export const BACK_MARK = "‹";
export const SUBMENU_MARK = "›";

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
