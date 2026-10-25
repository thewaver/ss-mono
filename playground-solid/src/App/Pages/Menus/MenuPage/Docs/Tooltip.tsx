import { Menu } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuTooltipDocsExampleProps } from "../MenuPageSolid.types";

type Props = MenuTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={ACTIONS}
        isDisabled={props.isDisabled}
        isReachableWhenDisabled={props.isReachableWhenDisabled}
        ariaLabel={"Edit actions"}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top_out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Cut, copy or paste what is selected.
                </PageTooltipContent>
            ),
        })}
        renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
