import { Menu } from "@thewaver/ss-components-solid";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { DESTINATIONS, renderDestinationItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuCascaderExampleProps } from "../MenuPage.types";

const PATH_SEPARATOR = " / ";
const NOTHING_CHOSEN = "Choose a destination";

type Props = MenuCascaderExampleProps;

export const CascaderExample = (props: Props) => {
    const getPathText = () => {
        const path = props.pathSignal[0]();

        return path.length > 0 ? path.join(PATH_SEPARATOR) : NOTHING_CHOSEN;
    };

    return (
        <Menu
            items={() => DESTINATIONS}
            ariaLabel={() => `Destination: ${getPathText()}`}
            submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
            renderContent={(getFlags) => (
                <PageMenuTriggerContent flags={getFlags}>{getPathText()}</PageMenuTriggerContent>
            )}
            renderItem={renderDestinationItem}
            renderPopup={renderMenuPopup}
            onActivate={(destination) => {
                if (destination.isLeaf) props.pathSignal[1](destination.path);
            }}
        />
    );
};
