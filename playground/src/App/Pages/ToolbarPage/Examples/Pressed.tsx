import { Toolbar } from "@thewaver/ss-components";
import type { ToolbarAction } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarPressedExampleProps } from "../ToolbarPage.types";

import * as styles from "../ToolbarPage.css";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

type Props = ToolbarPressedExampleProps;

export const PressedExample = (props: Props) => {
    return (
        <Toolbar
            actions={() => ACTIONS}
            gap={props.gap}
            ariaLabel={"Text style"}
            overflowAriaLabel={"More text styles"}
            pressedValuesSignal={props.pressedValuesSignal}
            renderAction={(getAction, getFlags) => (
                <PageButtonContent flags={getFlags}>
                    <span class={styles.pressedMark} classList={{ [styles.isPressed]: getFlags().isPressed }}>
                        {getAction().value}
                    </span>
                </PageButtonContent>
            )}
            renderOverflowTrigger={(getFlags) => <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    );
};
