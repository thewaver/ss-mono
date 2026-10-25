import { createSignal } from "solid-js";

import { Toolbar } from "@thewaver/ss-components-solid";
import type { ToolbarAction } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageSolid.const";
import { ResizableBar } from "./ResizableBar";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

export const PressedDocsExample = () => {
    const pressedValues = createSignal<string[]>([]);

    return (
        <>
            <ResizableBar>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Text style"}
                    overflowAriaLabel={"More text styles"}
                    pressedValues={pressedValues}
                    renderAction={(getAction, getFlags) => (
                        <PageButtonContent flags={getFlags}>
                            <span class={styles.pressedMark} classList={{ [styles.isPressed]: getFlags().isPressed }}>
                                {getAction().value}
                            </span>
                        </PageButtonContent>
                    )}
                    renderOverflowTrigger={(getFlags) => (
                        <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>
                    )}
                    renderOverflowItem={renderToolbarOverflowItem}
                    renderOverflowPopup={renderToolbarPopup}
                    onActivate={() => {}}
                />
            </ResizableBar>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Pressed: ${pressedValues[0]().join(", ") || "nothing"}`}
            </div>
        </>
    );
};
