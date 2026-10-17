import { SharedTooltip, Toolbar } from "@thewaver/ss-components-solid";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-solid";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import type { ToolbarExampleProps } from "../ToolbarPageSolid.types";

const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

const OFFSET = { x: 0, y: 8 };

const toHint = (text: string): InteractionTooltipDefs => ({
    placement: PLACEMENT,
    offset: OFFSET,
    hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
    renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
        <PageTooltipContent visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
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
            renderAction={(getAction, getFlags) => (
                <PageButtonContent flags={getFlags}>{getAction().value}</PageButtonContent>
            )}
            renderOverflowTrigger={(getFlags) => <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    </SharedTooltip>
);
