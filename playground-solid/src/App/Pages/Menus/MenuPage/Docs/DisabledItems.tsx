import { createSignal } from "solid-js";

import { Menu, access } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    ACTIONS_WITH_DISABLED,
    ACTIONS_WITH_REACHABLE,
    NOTHING_RUN,
    renderMenuItem,
    renderMenuPopup,
} from "../MenuPageSolid.const";
import type { MenuDisabledItemsDocsExampleProps } from "../MenuPageSolid.types";

type Props = MenuDisabledItemsDocsExampleProps;

export const DisabledItemsDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={() => (access(props.isReachable) ? ACTIONS_WITH_REACHABLE : ACTIONS_WITH_DISABLED)}
                ariaLabel={"Edit actions"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
