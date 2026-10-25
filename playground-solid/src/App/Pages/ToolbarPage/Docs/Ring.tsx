import { createSignal } from "solid-js";

import { Toolbar } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PALETTE_LAYOUT, PALETTE_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";

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
    const [getLastRun, setLastRun] = createSignal<string>();

    return (
        <>
            <div style={{ width: PALETTE_WIDTH }}>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Tools"}
                    overflowAriaLabel={"More tools"}
                    computeLayout={PALETTE_LAYOUT}
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
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun() ?? "nothing yet"}`}</div>
        </>
    );
};
