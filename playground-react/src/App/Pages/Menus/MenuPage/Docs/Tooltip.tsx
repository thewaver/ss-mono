import { Menu } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";
import type { MenuTooltipDocsExampleProps } from "../MenuPageReact.types";

type Props = MenuTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => (
    <Menu
        renderHighlightFloater={renderPageHighlightFloater}
        items={ACTIONS}
        isDisabled={props.isDisabled}
        isReachableWhenDisabled={props.isReachableWhenDisabled}
        ariaLabel={"Edit actions"}
        tooltipDefs={{
            placement: { x: "center", y: "top_out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Cut, copy or paste what is selected.
                </PageTooltipContent>
            ),
        }}
        renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
        renderItem={renderMenuItem}
        renderPopup={renderMenuPopup}
        onActivate={() => undefined}
    />
);
