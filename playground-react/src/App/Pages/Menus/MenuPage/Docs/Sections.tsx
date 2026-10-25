import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuGroupBox } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageSelectGroupContent } from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import {
    NOTHING_RUN,
    SECTIONED_VIEW_OPTIONS,
    VIEW_DEFAULTS,
    renderMenuItem,
    renderMenuPopup,
} from "../MenuPageReact.const";

export const SectionsDocsExample = () => {
    const checkedState = useState(VIEW_DEFAULTS);
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={SECTIONED_VIEW_OPTIONS}
                ariaLabel={"View options"}
                checked={checkedState}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>View</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderGroupHeader={(group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent>}
                renderGroupBox={(renderContent) => <PageMenuGroupBox>{renderContent()}</PageMenuGroupBox>}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
