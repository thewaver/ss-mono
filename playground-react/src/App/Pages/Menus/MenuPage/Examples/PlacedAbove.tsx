import { Menu } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const PlacedAboveExample = (props: Props) => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={ACTIONS}
        ariaLabel={"Edit actions"}
        placement={{ x: "left-in", y: "top-out" }}
        renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={props.onActivate}
    />
);
