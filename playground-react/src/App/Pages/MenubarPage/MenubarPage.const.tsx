import type { ReactNode } from "react";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-react";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PageMenuItemContent } from "../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import type { MenubarEntry } from "./MenubarPage.types";

export * from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarWords.const";

export const renderMenubarPopup = (
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

export const renderMenubarItem = (item: MenuItem<MenubarEntry>, flags: InteractionFlags<MenuItemFlags>) => (
    <PageMenuItemContent flags={flags} kind={item.kind} shortcut={item.value.shortcut ?? ""}>
        {item.value.name}
    </PageMenuItemContent>
);
