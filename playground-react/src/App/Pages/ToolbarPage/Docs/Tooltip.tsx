import { useState } from "react";

import { SharedTooltip, Toolbar } from "@thewaver/ss-components-react";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";
import type { ToolbarTooltipDocsExampleProps } from "../ToolbarPageReact.types";
import { ResizableBar } from "./ResizableBar";

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

type Props = ToolbarTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const [lastRun, setLastRun] = useState<string>();

    const actions: ToolbarAction<string>[] = [
        { value: "Cut", tooltipDefs: toHint("Moves the selection to the clipboard") },
        { value: "Copy", tooltipDefs: toHint("Copies the selection to the clipboard") },
        {
            value: "Clear",
            isDisabled: props.isDisabled,
            isReachableWhenDisabled: props.isReachableWhenDisabled,
            tooltipDefs: toHint(
                props.isDisabled ? "Nothing is selected, so there is nothing to clear" : "Deletes the selection",
            ),
        },
        { value: "Paste", tooltipDefs: toHint("Puts the clipboard where the caret is") },
        { value: "Undo", tooltipDefs: toHint("Takes back the last change") },
    ];

    return (
        <>
            <ResizableBar>
                <SharedTooltip>
                    <Toolbar
                        actions={actions}
                        ariaLabel={"Editing"}
                        overflowAriaLabel={"More editing actions"}
                        renderAction={(action, flags) => (
                            <PageButtonContent flags={flags}>{action.value}</PageButtonContent>
                        )}
                        renderOverflowTrigger={(flags) => (
                            <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>
                        )}
                        renderOverflowItem={renderToolbarOverflowItem}
                        renderOverflowPopup={renderToolbarPopup}
                        onActivate={setLastRun}
                    />
                </SharedTooltip>
            </ResizableBar>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
        </>
    );
};
