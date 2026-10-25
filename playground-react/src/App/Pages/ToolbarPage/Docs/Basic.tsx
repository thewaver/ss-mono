import { useState } from "react";

import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";
import type { ToolbarBasicDocsExampleProps } from "../ToolbarPageReact.types";
import { ResizableBar } from "./ResizableBar";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align left" },
    { value: "Align center" },
    { value: "Bullets" },
    { value: "Numbering" },
];

type Props = ToolbarBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [lastRun, setLastRun] = useState<string>();

    return (
        <>
            <ResizableBar width={props.barWidth} onResize={props.onBarWidthChange}>
                <Toolbar
                    actions={ACTIONS}
                    gap={props.gap}
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

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
        </>
    );
};
