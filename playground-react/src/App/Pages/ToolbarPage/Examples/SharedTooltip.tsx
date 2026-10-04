import { useState } from "react";

import { Toolbar, Tooltip } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

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

const PLACEMENT = { x: "center", y: "bottom-out" } as const;
const OFFSET = { x: 0, y: 8 };

type Props = ToolbarExampleProps;

export const SharedTooltipExample = (props: Props) => {
    const [anchor, setAnchor] = useState<HTMLElement>();

    const pickAnchor = (target: EventTarget | null) => {
        const button = target instanceof Element ? target.closest<HTMLElement>("button") : null;

        if (button?.querySelector("[data-hint]") && button !== anchor) setAnchor(button);
    };

    return (
        <div
            className={styles.hoverWatch}
            onPointerOver={(e) => pickAnchor(e.target)}
            onFocus={(e) => pickAnchor(e.target)}
        >
            <Toolbar
                actions={ACTIONS}
                gap={props.gap}
                ariaLabel={"Editing"}
                overflowAriaLabel={"More editing actions"}
                renderAction={(action, flags) => (
                    <PageButtonContent flags={flags}>
                        <span data-hint={action.value}>{action.value}</span>
                    </PageButtonContent>
                )}
                renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
                renderOverflowItem={renderToolbarOverflowItem}
                renderOverflowPopup={renderToolbarPopup}
                onActivate={props.onActivate}
            />

            <Tooltip
                anchorRef={anchor}
                placement={PLACEMENT}
                offset={OFFSET}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        {HINTS[anchor?.querySelector("[data-hint]")?.getAttribute("data-hint") ?? ""]}
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
