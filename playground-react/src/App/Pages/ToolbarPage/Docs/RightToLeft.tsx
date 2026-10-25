import { useState } from "react";

import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";
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
    const [lastRun, setLastRun] = useState<string>();

    return (
        <>
            <div dir={"rtl"} className={styles.docsDirectionBox}>
                <ResizableBar>
                    <Toolbar
                        actions={ACTIONS}
                        ariaLabel={"Formatting"}
                        overflowAriaLabel={"More formatting actions"}
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
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
        </>
    );
};
