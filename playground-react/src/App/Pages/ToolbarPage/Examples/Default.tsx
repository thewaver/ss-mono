import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align left" },
    { value: "Align center" },
    { value: "Bullets" },
    { value: "Numbering" },
];

type Props = ToolbarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Toolbar
            actions={ACTIONS}
            gap={props.gap}
            ariaLabel={"Formatting"}
            overflowAriaLabel={"More formatting actions"}
            renderAction={(action, flags) => <PageButtonContent flags={flags}>{action.value}</PageButtonContent>}
            renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    );
};
