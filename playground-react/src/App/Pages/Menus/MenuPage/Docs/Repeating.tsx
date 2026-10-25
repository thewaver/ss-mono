import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
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
} from "../MenuPageReact.const";

export const RepeatingDocsExample = () => {
    const [zoomPercent, setZoomPercent] = useState(ZOOM_RESET_PERCENT);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={ZOOM_ACTIONS}
                ariaLabel={"Zoom actions"}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Zoom</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => {
                    const step = ZOOM_STEPS[action.name];

                    setZoomPercent((prev) =>
                        step === undefined ? ZOOM_RESET_PERCENT : Math.max(prev + step, ZOOM_STEP_PERCENT),
                    );
                }}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Zoom: ${zoomPercent}%`}</div>
        </>
    );
};
