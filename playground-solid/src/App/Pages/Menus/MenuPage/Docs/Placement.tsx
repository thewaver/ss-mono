import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NESTED_ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuPlacementDocsExampleProps } from "../MenuPageSolid.types";

type Props = MenuPlacementDocsExampleProps;

export const PlacementDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={NESTED_ACTIONS}
                ariaLabel={"File actions"}
                placement={props.placement}
                submenuPlacement={props.submenuPlacement}
                submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>File</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
