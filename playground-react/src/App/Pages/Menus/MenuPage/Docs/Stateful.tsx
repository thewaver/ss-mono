import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NOTHING_RUN, VIEW_DEFAULTS, VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";

export const StatefulDocsExample = () => {
    const checkedState = useState(VIEW_DEFAULTS);
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={VIEW_OPTIONS}
                ariaLabel={"View options"}
                checked={checkedState}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>View</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
