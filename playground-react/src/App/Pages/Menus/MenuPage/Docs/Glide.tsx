import { useState } from "react";

import { Menu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuItemContent } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, NOTHING_RUN, renderMenuPopup } from "../MenuPageReact.const";
import type { MenuGlideDocsExampleProps } from "../MenuPageReact.types";

type Props = MenuGlideDocsExampleProps;

export const GlideDocsExample = (props: Props) => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <Menu
                renderHighlightFloater={props.isGliding ? renderPageHighlightFloater : undefined}
                items={ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Edit</PageMenuTriggerContent>}
                renderItem={(item, flags) => (
                    <PageMenuItemContent
                        isGliding={props.isGliding}
                        flags={flags}
                        kind={item.kind}
                        shortcut={item.value.shortcut ?? ""}
                    >
                        {item.value.name}
                    </PageMenuItemContent>
                )}
                renderPopup={renderMenuPopup}
                onActivate={(action) => setLastRun(action.name)}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
