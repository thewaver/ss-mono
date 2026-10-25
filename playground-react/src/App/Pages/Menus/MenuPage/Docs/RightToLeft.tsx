import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NESTED_ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";

export const RightToLeftDocsExample = () => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div dir={"rtl"}>
                <Menu
                    renderHighlightFloater={renderPageHighlightFloater}
                    items={NESTED_ACTIONS}
                    ariaLabel={"File actions"}
                    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
                    renderContent={(flags) => <PageMenuTriggerContent flags={flags}>File</PageMenuTriggerContent>}
                    renderItem={renderMenuItem}
                    renderPopup={renderMenuPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
