import { createSignal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuBasicDocsExampleProps } from "../MenuPageSolid.types";

type Props = MenuBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                items={ACTIONS}
                isDisabled={props.isDisabled}
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
