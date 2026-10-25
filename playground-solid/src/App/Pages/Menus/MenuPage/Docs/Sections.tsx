import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
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
} from "../MenuPageSolid.const";

export const SectionsDocsExample = () => {
    const checkedSignal = createSignal(VIEW_DEFAULTS);
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={SECTIONED_VIEW_OPTIONS}
                ariaLabel={"View options"}
                checked={checkedSignal}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>View</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderGroupHeader={(getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>}
                renderGroupBox={(renderContent) => <PageMenuGroupBox>{renderContent()}</PageMenuGroupBox>}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
