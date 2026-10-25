import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    ZOOM_ACTIONS,
    ZOOM_RESET_PERCENT,
    ZOOM_STEPS,
    ZOOM_STEP_PERCENT,
    renderMenuItem,
    renderMenuPopup,
} from "../MenuPageSolid.const";

export const RepeatingDocsExample = () => {
    const [getZoomPercent, setZoomPercent] = createSignal(ZOOM_RESET_PERCENT);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={ZOOM_ACTIONS}
                ariaLabel={"Zoom actions"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Zoom</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => {
                    const step = ZOOM_STEPS[action.name];

                    setZoomPercent((prev) =>
                        step === undefined ? ZOOM_RESET_PERCENT : Math.max(prev + step, ZOOM_STEP_PERCENT),
                    );
                }}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Zoom: ${getZoomPercent()}%`}</div>
        </>
    );
};
