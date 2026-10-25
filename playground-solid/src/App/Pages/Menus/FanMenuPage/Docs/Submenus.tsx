import { createSignal } from "solid-js";

import { FanMenu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { NOTHING_RUN } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    FAN_LAYOUT_DEFS,
    FAN_LAYOUT_SIZE,
    NESTED_ACTIONS,
    renderFanFloater,
    renderFanItem,
    renderFanPopup,
} from "../FanMenuPageSolid.const";

export const SubmenusDocsExample = () => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <div class={styles.stage}>
                <FanMenu
                    layoutSize={FAN_LAYOUT_SIZE}
                    layoutDefs={FAN_LAYOUT_DEFS}
                    items={NESTED_ACTIONS}
                    ariaLabel={"Edit actions"}
                    placement={{ x: "center", y: "center" }}
                    renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Fan</PageMenuTriggerContent>}
                    renderItem={renderFanItem}
                    renderHighlightFloater={renderFanFloater}
                    renderPopup={renderFanPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
