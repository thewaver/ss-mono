import type { ReactNode } from "react";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-react";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PageMenuItemContent } from "../../StyledComponents/MenuItemContent/MenuItemContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";

export const NOTHING_RUN = "nothing run yet";

export const renderToolbarPopup = (
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

export const renderToolbarOverflowItem = (item: MenuItem<string>, flags: InteractionFlags<MenuItemFlags>) => (
    <PageMenuItemContent flags={flags} kind={item.kind}>
        {item.value}
    </PageMenuItemContent>
);
