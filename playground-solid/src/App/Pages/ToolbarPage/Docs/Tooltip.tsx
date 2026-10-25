import { createSignal } from "solid-js";

import { SharedTooltip, Toolbar, access } from "@thewaver/ss-components-solid";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import type { ToolbarTooltipDocsExampleProps } from "../ToolbarPageSolid.types";
import { ResizableBar } from "./ResizableBar";

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

type Props = ToolbarTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal<string>();

    const getActions = (): ToolbarAction<string>[] => [
        { value: "Cut", tooltipDefs: toHint("Moves the selection to the clipboard") },
        { value: "Copy", tooltipDefs: toHint("Copies the selection to the clipboard") },
        {
            value: "Clear",
            isDisabled: access(props.isDisabled),
            isReachableWhenDisabled: access(props.isReachableWhenDisabled),
            tooltipDefs: toHint(
                access(props.isDisabled)
                    ? "Nothing is selected, so there is nothing to clear"
                    : "Deletes the selection",
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
                        actions={getActions}
                        ariaLabel={"Editing"}
                        overflowAriaLabel={"More editing actions"}
                        renderAction={(getAction, getFlags) => (
                            <PageButtonContent flags={getFlags}>{getAction().value}</PageButtonContent>
                        )}
                        renderOverflowTrigger={(getFlags) => (
                            <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>
                        )}
                        renderOverflowItem={renderToolbarOverflowItem}
                        renderOverflowPopup={renderToolbarPopup}
                        onActivate={setLastRun}
                    />
                </SharedTooltip>
            </ResizableBar>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun() ?? "nothing yet"}`}</div>
        </>
    );
};
