import { createSignal } from "solid-js";

import { Toolbar, Tooltip } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Cut" }, { value: "Copy" }, { value: "Paste" }, { value: "Undo" }];

const HINTS: Record<string, string> = {
    Cut: "Moves the selection to the clipboard",
    Copy: "Copies the selection to the clipboard",
    Paste: "Puts the clipboard where the caret is",
    Undo: "Takes back the last change",
};

const OFFSET = { x: 0, y: 8 };

type Props = ToolbarExampleProps;

export const SharedTooltipExample = (props: Props) => {
    const [getAnchor, setAnchor] = createSignal<HTMLElement>();

    const pickAnchor = (target: EventTarget | null) => {
        const button = target instanceof Element ? target.closest<HTMLElement>("button") : null;

        if (button?.querySelector("[data-hint]") && button !== getAnchor()) setAnchor(button);
    };

    return (
        <div
            class={styles.hoverWatch}
            onPointerOver={(e) => pickAnchor(e.target)}
            onFocusIn={(e) => pickAnchor(e.target)}
        >
            <Toolbar
                actions={() => ACTIONS}
                gap={props.gap}
                ariaLabel={"Editing"}
                overflowAriaLabel={"More editing actions"}
                renderAction={(getAction, getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        <span data-hint={getAction().value}>{getAction().value}</span>
                    </PageButtonContent>
                )}
                renderOverflowTrigger={(getFlags) => (
                    <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>
                )}
                renderOverflowItem={renderToolbarOverflowItem}
                renderOverflowPopup={renderToolbarPopup}
                onActivate={props.onActivate}
            />

            <Tooltip
                anchorRef={getAnchor}
                placement={() => ({ x: "center", y: "top-out" })}
                offset={() => OFFSET}
                hoverShowDelayMs={() => TOOLTIP_HOVER_DELAY_MS}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        {HINTS[getAnchor()?.querySelector("[data-hint]")?.getAttribute("data-hint") ?? ""]}
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
