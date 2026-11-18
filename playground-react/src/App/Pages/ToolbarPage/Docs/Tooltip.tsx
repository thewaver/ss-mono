import { useState } from "react";

import { SharedTooltip, Toolbar } from "@thewaver/ss-components-react";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    COPIES_SELECTION_CLIPBOARD_TEXT,
    DELETES_SELECTION_TEXT,
    MORE_EDITING_ACTIONS_LABEL,
    MOVES_SELECTION_CLIPBOARD_TEXT,
    NOTHING_SELECTED_SO_THERE_TEXT,
    PUTS_CLIPBOARD_WHERE_CARET_TEXT,
    TAKES_BACK_LAST_CHANGE_TEXT,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
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
    renderContent: (visibilityTarget, transitionDurationMs, _placement, _flags, arrowAim) => (
        <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
            {text}
        </PageTooltipContent>
    ),
});

type Props = ToolbarTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const [lastRun, setLastRun] = useState<string>();

    const actions: ToolbarAction<string>[] = [
        { value: "Cut", tooltipDefs: toHint(MOVES_SELECTION_CLIPBOARD_TEXT) },
        { value: "Copy", tooltipDefs: toHint(COPIES_SELECTION_CLIPBOARD_TEXT) },
        {
            value: "Clear",
            isDisabled: props.isDisabled,
            isReachableWhenDisabled: props.isReachableWhenDisabled,
            tooltipDefs: toHint(props.isDisabled ? NOTHING_SELECTED_SO_THERE_TEXT : DELETES_SELECTION_TEXT),
        },
        { value: "Paste", tooltipDefs: toHint(PUTS_CLIPBOARD_WHERE_CARET_TEXT) },
        { value: "Undo", tooltipDefs: toHint(TAKES_BACK_LAST_CHANGE_TEXT) },
    ];

    return (
        <>
            <ResizableBar>
                <SharedTooltip>
                    <Toolbar
                        actions={actions}
                        ariaLabel={"Editing"}
                        overflowAriaLabel={MORE_EDITING_ACTIONS_LABEL}
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
