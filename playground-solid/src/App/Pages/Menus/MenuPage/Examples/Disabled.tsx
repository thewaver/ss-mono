import { Menu } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";

export const DisabledExample = () => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={() => ACTIONS}
        isDisabled={true}
        ariaLabel={"Edit actions"}
        renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
