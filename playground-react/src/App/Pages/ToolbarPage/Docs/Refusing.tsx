import { useState } from "react";

import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";
import { ResizableBar } from "./ResizableBar";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Undo" },
    { value: "Redo" },
    { value: "Comment" },
    { value: "Share", collapse: "never" },
    { value: "Print", collapse: "always" },
    { value: "Archive" },
    { value: "Rename", isDisabled: true },
];

export const RefusingDocsExample = () => {
    const [lastRun, setLastRun] = useState<string>();

    return (
        <>
            <ResizableBar>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Document"}
                    overflowAriaLabel={"More document actions"}
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
            </ResizableBar>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
        </>
    );
};
