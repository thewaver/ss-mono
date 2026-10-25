import { useState } from "react";

import { ContextMenu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { NESTED_ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";

export const ContextRightToLeftDocsExample = () => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div dir={"rtl"}>
                <ContextMenu
                    renderHighlightFloater={renderPageHighlightFloater}
                    items={NESTED_ACTIONS}
                    ariaLabel={"File actions"}
                    regionAriaLabel={"Editing area in a right-to-left box"}
                    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
                    renderRegion={() => <div className={styles.contextRegion}>Right-click anywhere in this box</div>}
                    renderItem={renderMenuItem}
                    renderPopup={renderMenuPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
