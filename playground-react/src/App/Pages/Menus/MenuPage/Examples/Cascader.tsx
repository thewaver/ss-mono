import { Menu } from "@thewaver/ss-components-react";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { DESTINATIONS, renderDestinationItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuCascaderExampleProps } from "../MenuPage.types";

const PATH_SEPARATOR = " / ";
const NOTHING_CHOSEN = "Choose a destination";

type Props = MenuCascaderExampleProps;

export const CascaderExample = (props: Props) => {
    const path = props.path[0];

    const pathText = path.length > 0 ? path.join(PATH_SEPARATOR) : NOTHING_CHOSEN;

    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={DESTINATIONS}
            ariaLabel={`Destination: ${pathText}`}
            submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
            renderContent={(flags) => <PageMenuTriggerContent flags={flags}>{pathText}</PageMenuTriggerContent>}
            renderItem={renderDestinationItem}
            renderPopup={renderMenuPopup}
            onActivate={(destination) => {
                if (destination.isLeaf) props.path[1](destination.path);
            }}
        />
    );
};
