import { Menu } from "@thewaver/ss-components-react";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NESTED_ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const SubmenusExample = (props: Props) => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={NESTED_ACTIONS}
        ariaLabel={"File actions"}
        submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
        renderContent={(flags) => <PageMenuTriggerContent flags={flags}>File</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={props.onActivate}
    />
);
