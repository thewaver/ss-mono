import { Menu } from "@thewaver/ss-components-react";
import type { MenuItem } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps & { items?: MenuItem<Action>[]; caption?: string };

export const DefaultExample = (props: Props) => {
    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={props.items ?? ACTIONS}
            ariaLabel={"Edit actions"}
            renderContent={(flags) => (
                <PageMenuTriggerContent flags={flags}>{props.caption ?? "Edit"}</PageMenuTriggerContent>
            )}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
