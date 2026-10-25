import { createSignal } from "solid-js";

import { Menu, access } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuItemContent } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, NOTHING_RUN, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuGlideDocsExampleProps } from "../MenuPageSolid.types";

type Props = MenuGlideDocsExampleProps;

export const GlideDocsExample = (props: Props) => {
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={access(props.isGliding) ? renderPageHighlightFloater : undefined}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
                renderItem={(getItem, getFlags) => (
                    <PageMenuItemContent
                        isGliding={props.isGliding}
                        flags={getFlags}
                        kind={() => getItem().kind}
                        shortcut={() => getItem().value.shortcut ?? ""}
                    >
                        {getItem().value.name}
                    </PageMenuItemContent>
                )}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
