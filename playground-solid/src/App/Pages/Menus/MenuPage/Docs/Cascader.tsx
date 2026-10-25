import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { DESTINATIONS, renderDestinationItem, renderMenuPopup } from "../MenuPageSolid.const";

const PATH_SEPARATOR = " / ";
const NOTHING_CHOSEN = "Choose a destination";

export const CascaderDocsExample = () => {
    const [getPath, setPath] = createSignal<string[]>([]);

    const getPathText = () => (getPath().length > 0 ? getPath().join(PATH_SEPARATOR) : NOTHING_CHOSEN);

    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={DESTINATIONS}
            ariaLabel={() => `Destination: ${getPathText()}`}
            submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
            renderContent={(getFlags) => (
                <PageMenuTriggerContent flags={getFlags}>{getPathText()}</PageMenuTriggerContent>
            )}
            renderItem={renderDestinationItem}
            renderPopup={renderMenuPopup}
            onActivate={(destination) => setPath(destination.path)}
        />
    );
};
