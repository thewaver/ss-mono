import { Toolbar, createRing } from "@thewaver/ss-components";
import type { ArcDefs, ToolbarAction } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const";
import type { ToolbarExampleProps } from "../ToolbarPage.types";

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

const PALETTE_DEFS: ArcDefs = { fit: "content", holeRadiusPx: 110, bandWidthPx: 68, labelMaxWidthRatio: 1.5 };

const PALETTE_LAYOUT = createRing(PALETTE_DEFS);

type Props = ToolbarExampleProps;

export const PaletteExample = (props: Props) => {
    return (
        <Toolbar
            actions={() => ACTIONS}
            ariaLabel={"Tools"}
            overflowAriaLabel={"More tools"}
            computeLayout={PALETTE_LAYOUT}
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
