import { Toolbar } from "@thewaver/ss-components-react";
import type { ToolbarAction } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Undo" },
    { value: "Redo" },
    { value: "Comment" },
    { value: "Share", collapse: "never" },
    { value: "Print", collapse: "always" },
    { value: "Archive" },
    { value: "Rename", isDisabled: true },
];

type Props = ToolbarExampleProps;

export const RefusingExample = (props: Props) => {
    return (
        <Toolbar
            actions={ACTIONS}
            gap={props.gap}
            ariaLabel={"Document"}
            overflowAriaLabel={"More document actions"}
            renderAction={(action, flags) => <PageButtonContent flags={flags}>{action.value}</PageButtonContent>}
            renderOverflowTrigger={(flags) => <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    );
};
