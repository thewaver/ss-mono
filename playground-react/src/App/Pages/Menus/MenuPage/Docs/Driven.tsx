import { useState } from "react";

import { Button, Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageControlButtonContent } from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";

export const DrivenDocsExample = () => {
    const visibilityState = useState(false);
    const [anchorRef, setAnchorRef] = useState<HTMLElement>();
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                visibility={visibilityState}
                anchorRef={anchorRef}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <Button
                ref={(element) => setAnchorRef(element ?? undefined)}
                id={"menuToggle"}
                renderContent={(flags) => (
                    <PageControlButtonContent flags={flags}>
                        {visibilityState[0] ? "Close it" : "Open it"}
                    </PageControlButtonContent>
                )}
                onClick={() => {
                    visibilityState[1](!visibilityState[0]);
                }}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
