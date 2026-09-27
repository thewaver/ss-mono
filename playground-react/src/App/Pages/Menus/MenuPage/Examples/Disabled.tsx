import { Menu } from "@thewaver/ss-components-react";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";

export const DisabledExample = () => (
    <Menu
        items={ACTIONS}
        isDisabled={true}
        ariaLabel={"Edit actions"}
        renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
