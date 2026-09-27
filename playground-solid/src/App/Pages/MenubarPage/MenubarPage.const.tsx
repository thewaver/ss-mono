import type { Accessor, JSX } from "solid-js";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-solid";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PageMenuItemContent } from "../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import type { MenubarEntry } from "./MenubarPage.types";

export * from "@thewaver/ss-playground-core/App/Pages/MenubarPage/MenubarWords.const";

export const renderMenubarPopup = (
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

export const renderMenubarItem = (
    getItem: Accessor<MenuItem<MenubarEntry>>,
    getFlags: () => InteractionFlags<MenuItemFlags>,
) => (
    <PageMenuItemContent flags={getFlags} kind={() => getItem().kind} shortcut={() => getItem().value.shortcut ?? ""}>
        {getItem().value.name}
    </PageMenuItemContent>
);
