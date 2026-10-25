import { useState } from "react";

import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPageReact.const";
import { ResizableBar } from "./ResizableBar";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

export const PressedDocsExample = () => {
    const pressedValues = useState<string[]>([]);

    return (
        <>
            <ResizableBar>
                <Toolbar
                    actions={ACTIONS}
                    ariaLabel={"Text style"}
                    overflowAriaLabel={"More text styles"}
                    pressedValues={pressedValues}
                    renderAction={(action, flags) => (
                        <PageButtonContent flags={flags}>
                            <span
                                className={[styles.pressedMark, flags.isPressed && styles.isPressed]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {action.value}
                            </span>
                        </PageButtonContent>
                    )}
                    renderOverflowTrigger={(flags) => (
                        <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>
                    )}
                    renderOverflowItem={renderToolbarOverflowItem}
                    renderOverflowPopup={renderToolbarPopup}
                    onActivate={() => {}}
                />
            </ResizableBar>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Pressed: ${pressedValues[0].join(", ") || "nothing"}`}
            </div>
        </>
    );
};
