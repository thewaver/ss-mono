import { Menubar } from "@thewaver/ss-components-react";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { MenubarExampleProps } from "../MenubarPage.types";
import { WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPageReact.const";

type Props = MenubarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Menubar
            actions={WORDS}
            ariaLabel={"Editor"}
            overflowAriaLabel={"More menus"}
            checked={props.checked}
            submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
            renderAction={(action, flags) => (
                <PageMenuTriggerContent flags={flags}>{action.value.name}</PageMenuTriggerContent>
            )}
            renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
            renderItem={renderMenubarItem}
            renderPopup={renderMenubarPopup}
            onActivate={props.onActivate}
        />
    );
};
