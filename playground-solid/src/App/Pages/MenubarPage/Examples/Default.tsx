import { Menubar } from "@thewaver/ss-components-solid";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { MenubarExampleProps } from "../MenubarPage.types";
import { WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPageSolid.const";

type Props = MenubarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Menubar
            actions={() => WORDS}
            ariaLabel={"Editor"}
            overflowAriaLabel={"More menus"}
            checked={props.checked}
            submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
            renderAction={(getAction, getFlags) => (
                <PageMenuTriggerContent flags={getFlags}>{getAction().value.name}</PageMenuTriggerContent>
            )}
            renderOverflowTrigger={(getFlags) => <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>}
            renderItem={renderMenubarItem}
            renderPopup={renderMenubarPopup}
            onActivate={props.onActivate}
        />
    );
};
