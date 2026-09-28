import type { Accessor, JSX } from "solid-js";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-solid";

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
            placement: () => ({ x: "right-out", y: "center" }),
            offset: () => ({ x: 10, y: 0 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    The clipboard is empty.
                </PageTooltipContent>
            ),
        },
    },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

export const renderMenuPopup = (
    renderItems: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
) => (
    <PageLayer level={2}>
        <PagePopoverSurface
            visibilityTarget={getVisibilityTarget}
            transitionDurationMs={getTransitionDurationMs}
            placement={getPlacement}
        >
            {renderItems()}
        </PagePopoverSurface>
    </PageLayer>
);

export const renderMenuItem = (
    getItem: Accessor<MenuItem<Action>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={() => getItem().value.shortcut ?? ""}>
        {getItem().value.name}
    </PageMenuItemContent>
);

export const renderDestinationItem = (
    getItem: Accessor<MenuItem<Destination>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={""}>
        {getItem().value.name}
    </PageMenuItemContent>
);
