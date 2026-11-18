import { createSignal } from "solid-js";

import { SharedTooltip, Toolbar, access } from "@thewaver/ss-components-solid";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-solid";
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
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import type { ToolbarTooltipDocsExampleProps } from "../ToolbarPageSolid.types";
import { ResizableBar } from "./ResizableBar";

const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

const OFFSET = { x: 0, y: 8 };

const toHint = (text: string): InteractionTooltipDefs => ({
    placement: PLACEMENT,
    offset: OFFSET,
    hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
    renderContent: (getVisibilityTarget, getTransitionDurationMs, _getPlacement, _getFlags, getArrowAim) => (
        <PageTooltipContent visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
            {text}
        </PageTooltipContent>
    ),
});

type Props = ToolbarTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal<string>();

    const getActions = (): ToolbarAction<string>[] => [
        { value: "Cut", tooltipDefs: toHint(MOVES_SELECTION_CLIPBOARD_TEXT) },
        { value: "Copy", tooltipDefs: toHint(COPIES_SELECTION_CLIPBOARD_TEXT) },
        {
            value: "Clear",
            isDisabled: access(props.isDisabled),
            isReachableWhenDisabled: access(props.isReachableWhenDisabled),
            tooltipDefs: toHint(access(props.isDisabled) ? NOTHING_SELECTED_SO_THERE_TEXT : DELETES_SELECTION_TEXT),
        },
        { value: "Paste", tooltipDefs: toHint(PUTS_CLIPBOARD_WHERE_CARET_TEXT) },
        { value: "Undo", tooltipDefs: toHint(TAKES_BACK_LAST_CHANGE_TEXT) },
    ];

    return (
        <>
            <ResizableBar>
                <SharedTooltip>
                    <Toolbar
                        actions={getActions}
                        ariaLabel={"Editing"}
                        overflowAriaLabel={MORE_EDITING_ACTIONS_LABEL}
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
