import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { LAYERS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";

export const LongListDocsExample = () => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={LAYERS}
                ariaLabel={"Layers"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Layers</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
