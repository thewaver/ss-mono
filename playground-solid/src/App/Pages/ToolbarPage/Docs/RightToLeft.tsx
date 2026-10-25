import { createSignal } from "solid-js";

import { Toolbar } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import { ResizableBar } from "./ResizableBar";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align right" },
    { value: "Align center" },
    { value: "Bullets" },
    { value: "Numbering" },
];

export const RightToLeftDocsExample = () => {
    const [getLastRun, setLastRun] = createSignal<string>();

    return (
        <>
            <div dir={"rtl"} class={styles.docsDirectionBox}>
                <ResizableBar>
                    <Toolbar
                        actions={ACTIONS}
                        ariaLabel={"Formatting"}
                        overflowAriaLabel={"More formatting actions"}
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
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun() ?? "nothing yet"}`}</div>
        </>
    );
};
