import { Toolbar } from "@thewaver/ss-components";
import type { ToolbarAction } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align left" },
    { value: "Align centre" },
    { value: "Bullets" },
    { value: "Numbering" },
];

type Props = ToolbarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Toolbar
            actions={() => ACTIONS}
            gap={props.gap}
            ariaLabel={"Formatting"}
            overflowAriaLabel={"More formatting actions"}
            renderAction={(getAction, getFlags) => (
                <PageButtonContent flags={getFlags}>{getAction().value}</PageButtonContent>
            )}
            renderOverflowTrigger={(getFlags) => <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={props.onActivate}
        />
    );
};
