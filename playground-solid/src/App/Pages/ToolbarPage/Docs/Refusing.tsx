import { createSignal } from "solid-js";

import { Toolbar } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
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
    const [getLastRun, setLastRun] = createSignal<string>();

    return (
        <>
            <ResizableBar>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Document"}
                    overflowAriaLabel={"More document actions"}
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
            </ResizableBar>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun() ?? "nothing yet"}`}</div>
        </>
    );
};
