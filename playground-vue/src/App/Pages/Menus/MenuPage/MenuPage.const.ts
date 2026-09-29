import { h } from "vue";

import type { MenuItem } from "@thewaver/ss-components-vue";

import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { Action } from "./MenuPage.types";

export * from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.const";

export const ACTIONS_WITH_REACHABLE: MenuItem<Action>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    {
        value: { name: "Paste", shortcut: "Ctrl+V" },
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: {
            placement: { x: "right-out", y: "center" },
            offset: { x: 10, y: 0 },
            renderContent: ({ visibilityTarget, transitionDurationMs }) =>
                h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "The clipboard is empty."),
        },
    },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];
