import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import { NOTHING_CHOSEN } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { DESTINATIONS, renderDestinationItem, renderMenuPopup } from "../MenuPageReact.const";

const PATH_SEPARATOR = " / ";
export const CascaderDocsExample = () => {
    const [path, setPath] = useState<string[]>([]);

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
            onActivate={(destination) => setPath(destination.path)}
        />
    );
};
