import { Menu } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";

export const ReachableExample = () => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={() => ACTIONS}
        isDisabled={true}
        isReachableWhenDisabled={true}
        ariaLabel={"Edit actions"}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top-out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Nothing is selected, so there is nothing to edit.
                </PageTooltipContent>
            ),
        })}
        renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
