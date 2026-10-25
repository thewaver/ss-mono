import { createSignal } from "solid-js";

import { ContextMenu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";

export const ContextDocsExample = () => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <ContextMenu
                renderHighlightFloater={renderPageHighlightFloater}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                regionAriaLabel={"Editing area"}
                renderRegion={() => <div class={styles.contextRegion}>Right-click anywhere in this box</div>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
