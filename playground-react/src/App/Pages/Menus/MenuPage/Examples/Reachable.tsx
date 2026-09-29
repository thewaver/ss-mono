import { Menu } from "@thewaver/ss-components-react";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";

export const ReachableExample = () => (
    <Menu
        items={ACTIONS}
        isDisabled={true}
        isReachableWhenDisabled={true}
        ariaLabel={"Edit actions"}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Nothing is selected, so there is nothing to edit.
                </PageTooltipContent>
            ),
        }}
        renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
