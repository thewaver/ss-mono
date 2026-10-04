import type { ReactNode } from "react";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-react";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import { PageMenuItemContent } from "../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { Action, Destination } from "./MenuPage.types";

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
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    The clipboard is empty.
                </PageTooltipContent>
            ),
        },
    },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const renderMenuPopup = (
    renderItems: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
) => (
    <PageLayer level={2}>
        <PagePopoverSurface
            visibilityTarget={visibilityTarget}
            transitionDurationMs={transitionDurationMs}
            placement={placement}
        >
            {renderItems()}
        </PagePopoverSurface>
    </PageLayer>
);

export const renderMenuItem = (item: MenuItem<Action>, flags: InteractionFlags<MenuItemFlags>) => (
    <PageMenuItemContent isGliding flags={flags} kind={item.kind} shortcut={item.value.shortcut ?? ""}>
        {item.value.name}
    </PageMenuItemContent>
);

export const renderDestinationItem = (item: MenuItem<Destination>, flags: InteractionFlags<MenuItemFlags>) => (
    <PageMenuItemContent isGliding flags={flags} kind={item.kind} shortcut={""}>
        {item.value.name}
    </PageMenuItemContent>
);
