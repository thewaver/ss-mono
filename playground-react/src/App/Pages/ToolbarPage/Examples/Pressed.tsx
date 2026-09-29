import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarPressedExampleProps } from "../ToolbarPage.types";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

type Props = ToolbarPressedExampleProps;

export const PressedExample = (props: Props) => {
    return (
        <Toolbar
            actions={ACTIONS}
            gap={props.gap}
            ariaLabel={"Text style"}
            overflowAriaLabel={"More text styles"}
            pressedValues={props.pressedValues}
            renderAction={(action, flags) => (
                <PageButtonContent flags={flags}>
                    <span
                        className={[styles.pressedMark, flags.isPressed && styles.isPressed].filter(Boolean).join(" ")}
                    >
                        {action.value}
                    </span>
                </PageButtonContent>
            )}
            renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    );
};
