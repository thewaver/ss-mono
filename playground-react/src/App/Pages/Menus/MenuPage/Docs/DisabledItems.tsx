import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    ACTIONS_WITH_DISABLED,
    ACTIONS_WITH_REACHABLE,
    NOTHING_RUN,
    renderMenuItem,
    renderMenuPopup,
} from "../MenuPageReact.const";
import type { MenuDisabledItemsDocsExampleProps } from "../MenuPageReact.types";

type Props = MenuDisabledItemsDocsExampleProps;

export const DisabledItemsDocsExample = (props: Props) => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={props.isReachable ? ACTIONS_WITH_REACHABLE : ACTIONS_WITH_DISABLED}
                ariaLabel={"Edit actions"}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
