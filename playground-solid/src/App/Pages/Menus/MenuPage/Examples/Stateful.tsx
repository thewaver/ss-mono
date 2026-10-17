import type { Signal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { Action, MenuExampleProps } from "../MenuPageSolid.types";

type Props = MenuExampleProps & { checked: Signal<Action[]> };

export const StatefulExample = (props: Props) => {
    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={VIEW_OPTIONS}
            ariaLabel={"View options"}
            checked={props.checked}
            renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
