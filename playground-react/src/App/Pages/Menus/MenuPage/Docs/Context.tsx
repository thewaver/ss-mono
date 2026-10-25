import { useState } from "react";

import { ContextMenu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";

export const ContextDocsExample = () => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <ContextMenu
                renderHighlightFloater={renderPageHighlightFloater}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                regionAriaLabel={"Editing area"}
                renderRegion={() => <div className={styles.contextRegion}>Right-click anywhere in this box</div>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
