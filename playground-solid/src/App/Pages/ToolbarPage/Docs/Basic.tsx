import { createSignal } from "solid-js";

import { Toolbar } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import type { ToolbarBasicDocsExampleProps } from "../ToolbarPageSolid.types";
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
    const [getLastRun, setLastRun] = createSignal<string>();

    return (
        <>
            <ResizableBar width={props.barWidth} onResize={props.onBarWidthChange}>
                <Toolbar
                    actions={ACTIONS}
                    gap={props.gap}
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

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun() ?? "nothing yet"}`}</div>
        </>
    );
};
