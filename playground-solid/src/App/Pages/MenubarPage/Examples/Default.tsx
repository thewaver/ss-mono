import { Menubar } from "@thewaver/ss-components-solid";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground-core/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPage.const";
import type { MenubarExampleProps } from "../MenubarPage.types";

type Props = MenubarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Menubar
            actions={() => WORDS}
            ariaLabel={"Editor"}
            overflowAriaLabel={"More menus"}
            checkedSignal={props.checkedSignal}
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
