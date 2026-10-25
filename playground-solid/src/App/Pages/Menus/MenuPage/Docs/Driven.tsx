import { createSignal } from "solid-js";

import { Button, Menu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageControlButtonContent } from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";

export const DrivenDocsExample = () => {
    const visibilitySignal = createSignal(false);
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                visibility={visibilitySignal}
                anchorRef={getAnchorRef}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <Button
                ref={setAnchorRef}
                id={"menuToggle"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>
                        {visibilitySignal[0]() ? "Close it" : "Open it"}
                    </PageControlButtonContent>
                )}
                onClick={() => {
                    visibilitySignal[1]((prev) => !prev);
                }}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
