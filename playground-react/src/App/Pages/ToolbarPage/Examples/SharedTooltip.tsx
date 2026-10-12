import { SharedTooltip, Toolbar } from "@thewaver/ss-components-react";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-react";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

const OFFSET = { x: 0, y: 8 };

const toHint = (text: string): InteractionTooltipDefs => ({
    placement: PLACEMENT,
    offset: OFFSET,
    hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
    renderContent: (visibilityTarget, transitionDurationMs) => (
        <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
            {text}
        </PageTooltipContent>
    ),
});

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Cut", tooltipDefs: toHint("Moves the selection to the clipboard") },
    { value: "Copy", tooltipDefs: toHint("Copies the selection to the clipboard") },
    { value: "Clear", isDisabled: true },
    { value: "Paste", tooltipDefs: toHint("Puts the clipboard where the caret is") },
    { value: "Undo", tooltipDefs: toHint("Takes back the last change") },
];

type Props = ToolbarExampleProps;

export const SharedTooltipExample = (props: Props) => (
    <SharedTooltip>
        <Toolbar
            actions={ACTIONS}
            gap={props.gap}
            ariaLabel={"Editing"}
            overflowAriaLabel={"More editing actions"}
            renderAction={(action, flags) => <PageButtonContent flags={flags}>{action.value}</PageButtonContent>}
            renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    </SharedTooltip>
);
