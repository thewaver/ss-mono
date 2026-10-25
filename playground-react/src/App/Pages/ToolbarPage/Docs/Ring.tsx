import { useState } from "react";

import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PALETTE_LAYOUT, PALETTE_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Select" },
    { value: "Brush" },
    { value: "Erase" },
    { value: "Fill" },
    { value: "Text" },
    { value: "Shape" },
    { value: "Crop" },
    { value: "Zoom" },
];

export const RingDocsExample = () => {
    const [lastRun, setLastRun] = useState<string>();

    return (
        <>
            <div style={{ width: PALETTE_WIDTH }}>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Tools"}
                    overflowAriaLabel={"More tools"}
                    computeLayout={PALETTE_LAYOUT}
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
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
        </>
    );
};
