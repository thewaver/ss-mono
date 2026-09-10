import { PlacementLayoutUtils, Toolbar } from "@thewaver/ss-components";
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

const PALETTE_DEFS: ArcDefs = { width: 288, height: 288, spreadDegrees: 360, itemWidth: 102, itemHeight: 48 };

const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

const PALETTE_WIDTH = `${PALETTE_DEFS.width! + PALETTE_DEFS.itemWidth!}px`;

type Props = ToolbarExampleProps;

export const PaletteExample = (props: Props) => {
    return (
        <div style={{ width: PALETTE_WIDTH }}>
            <Toolbar
                actions={() => ACTIONS}
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
                onActivate={props.onActivate}
            />
        </div>
    );
};
