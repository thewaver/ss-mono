import { Menu } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps & { checked: readonly [Action[], (checked: Action[]) => void] };

export const StatefulExample = (props: Props) => {
    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={VIEW_OPTIONS}
            ariaLabel={"View options"}
            checked={props.checked}
            renderContent={(flags) => <PageMenuTriggerContent flags={flags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
